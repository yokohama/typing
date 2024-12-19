Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resource :config, only: [:show]
      post 'auth/google', to: 'sessions#google'

      namespace :user do
        resource :profile, only: %i[show update]
        resources :shutings, only: %i[index show] do
          resources :results, only: %i[index create], controller: 'shuting_results'
        end
        resources :results, only: %i[index show]
        resources :pairs, only: %i[index create]
        resources :gift_requests, only: %i[index]
      end
    end
  end
end
