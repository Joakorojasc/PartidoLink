Rails.application.routes.draw do
  devise_for :users,
    path: '',
    path_names: {
      sign_in: 'api/v1/auth/login',
      sign_out: 'api/v1/auth/logout',
      registration: 'api/v1/auth/signup'
    },
    controllers: {
      sessions: 'api/v1/auth/sessions',
      registrations: 'api/v1/auth/registrations'
    }

  namespace :api do
    namespace :v1 do
      get 'auth/me', to: 'auth/users#me'

      resources :users, only: [:show, :update] do
        member do
          get :sports
        end
      end

      resources :sports, only: [:index]

      resources :teams, only: [:index, :create, :show, :update] do
        member do
          post :join
          get :matches
          get :stats
        end
      end

      resources :venues, only: [:index, :show]

      resources :bookings, only: [:create, :show] do
        member do
          patch :cancel
        end
      end

      resources :matches, only: [:index, :create, :show] do
        member do
          post :challenge
        end
        resources :results, only: [:create], controller: 'match_results' do
          member do
            patch :accept
            patch :reject
          end
        end
      end

      resources :conversations, only: [:index, :create] do
        resources :messages, only: [:index, :create]
      end

      resources :ratings, only: [:create]
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
