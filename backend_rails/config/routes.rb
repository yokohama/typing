Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resource :config, only: [:show]
      post 'auth/google', to: 'sessions#google'

      namespace :user do
        resource :profile, only: %i[show update]
        resources :shutings, only: %i[index show] do
          resources :results, only: %i[index create]
        end
        resources :results, only: %i[show]
      end
    end
  end
end
