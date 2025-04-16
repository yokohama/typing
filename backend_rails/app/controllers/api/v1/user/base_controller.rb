class Api::V1::User::BaseController < ApplicationController
  SECRET_KEY = ENV['JWT_SECRET']

  attr_reader :current_user

  before_action :authenticate_user

  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last

    raise ::MissingCredentialsError if token.blank?

    begin
      decoded_token = JWT.decode(
        token,
        SECRET_KEY,
        true,
        { algorithm: 'HS256' }
      )
      @current_user = User.find(decoded_token[0]['sub'])
    rescue JWT::DecodeError
      raise ::MissingCredentialsError, "Token: #{token} was missing."
    end
  end
end
