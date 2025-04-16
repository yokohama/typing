class GoogleApiError < StandardError
  def initialize(message = "Google API error occurred.")
    super(message)
  end
end
