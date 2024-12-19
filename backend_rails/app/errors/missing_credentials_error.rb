class MissingCredentialsError < StandardError
  def initialize(message = "Wrong token.")
    super(message)
  end
end
