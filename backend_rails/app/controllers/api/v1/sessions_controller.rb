require 'net/http'

class Api::V1::SessionsController < ApplicationController
  SECRET_KEY = ENV["JWT_SECRET"]
  GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

  def google
    access_token = params[:googleToken]

    unless access_token
      render json: { error: "Missing Google token" }, status: :bad_request
      return
    end

    uri = URI(GOOGLE_USERINFO_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "Bearer #{access_token}"

    begin
      response = http.request(request)
    rescue StandardError => e
      logger.error "Google AIP Error"
      logger.error e.message
      render json: { 
        error: "Error contacting Google API"
      }, status: :internal_server_error
      return
    end

    if response.code.to_i != 200
      logger.error "Google API Error"
      logger.error "Status: #{response.code}, Body: #{response.body}"
      render json: {
        error: "Google API error: #{response.code}"
      }, status: :internal_server_error
      return
    end

    begin
      user_info = JSON.parse(response.body)
    rescue JSON::ParseError => e
      logger.error "Parse Error: #{e.message}"
      render json: {
        error: "Failed to parse user info"
      }, status: :internal_server_error
      return
    end

    user = User.find_or_create_by(email: user_info["email"]) do |u|
      u.name = user_info["name"]
    end

    render json: {
      jwt: create_jwt(user.id)
    }, status: :ok
  end

  private
  
  def create_jwt(user_id)
    exp = 24.hours.from_now.to_i
  
    payload = {
      sub: user_id,
      exp: exp
    }
  
    begin
      token = JWT.encode(payload, SECRET_KEY, 'HS256')
    rescue StandardError => e
      logger.error "Error generating JWT: #{e.message}"
      render json: { 
        error: 'Failed to generate JWT'
      }, status: :internal_server_error
      return
    end

    token
  end
end
