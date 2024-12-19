module ErrorHandler
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound, with: :not_found
    rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
    rescue_from ActiveRecord::RecordNotUnique, with: :duplicate_record
    rescue_from MissingCredentialsError, with: :missing_credential
    rescue_from GoogleApiError, with: :google_api_error
  end

  private

  def not_found(exception)
    render_error(
      'NotFound',
      exception.message,
      nil,
      :not_found
    )
  end

  def unprocessable_entity(exception)
    render_error(
      'UnprocessableEntity',
      exception.message,
      exception.record&.errors&.full_messages,
      :unprocessable_entity
    )
  end

  def duplicate_record(exception)
    render_error(
      'DuplicateRecordError',
      exception.message,
      nil,
      :conflict
    )
  end

  def missing_credential(exception)
    render_error(
      'MissingCredentials',
      exception.message,
      nil,
      :unauthorized
    )
  end

  def google_api_error(exception)
    render_error(
      'InternalServerError',
      exception.message,
      nil,
      :internal_server_error
    )
  end

  def render_error(error_type, message, details, status)
    render json: {
      error_type: error_type,
      message: message,
      details: details
    }, status: status
  end
end
