require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"

require "dotenv"
Dotenv.load(".env.#{ENV['RAILS_ENV']}")

Bundler.require(*Rails.groups)

module BackendRails
  class Application < Rails::Application
    config.load_defaults 7.0
    config.api_only = true
  end
end
