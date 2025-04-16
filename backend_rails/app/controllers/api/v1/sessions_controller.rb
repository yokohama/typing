require 'net/http'

class Api::V1::SessionsController < ApplicationController
  SECRET_KEY = ENV['JWT_SECRET']
  GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

  def google
    access_token = params[:googleToken]

    raise MissingCredentialsError unless access_token

    uri = URI(GOOGLE_USERINFO_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(uri)
    request['Authorization'] = "Bearer #{access_token}"

    begin
      response = http.request(request)
    rescue StandardError
      raise GoogleApiError, 'Error contacting Goole API'
    end

    raise GoogleApiError, "Google API error: #{response.code}" if response.code.to_i != 200

    begin
      user_info = JSON.parse(response.body)
    rescue JSON::ParseError
      raise GoogleApiError, 'Failed to parse user info'
    end

    user = User.find_or_create_by(email: user_info['email']) do |u|
      u.name = user_info['name']
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
    rescue StandardError
      raise GoogleApiError, 'Failed to generate JWT'
    end

    token
  end
end
