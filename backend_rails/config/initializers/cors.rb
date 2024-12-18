Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV['CORS_ORIGINS'].split(',')

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      max_age: 600
  end
end
