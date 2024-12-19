module Api
  module V1
    module User
      class ProfilesController < BaseController

        def show
          render json: current_user, status: :ok
        end

        def update
          # TODO: implement (more expected use serializer)
          render json: current_user, status: :ok
        end
      end
    end
  end
end
