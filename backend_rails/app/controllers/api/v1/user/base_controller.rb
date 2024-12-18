class Api::V1::User::BaseController < ApplicationController
  SECRET_KEY = ENV["JWT_SECRET"]

  before_action :authenticate_user

  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last

    if token.blank?
      logger.error "Authorization token error"
      render json: { 
        error: "Authorization token is missing or invalid" 
      }, status: :unauthorized
      return
    end

    begin
      decoded_token = JWT.decode(
        token,
        SECRET_KEY,
        true,
        { algorithm: 'HS256' }
      )
      @current_user = User.find(decoded_token[0]['sub'])
    rescue JWT::DecodeError => e
      logger.error "JWT Decode error: #{e.message}"
      render json: {
        error: "JWT Decode error"
      }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
