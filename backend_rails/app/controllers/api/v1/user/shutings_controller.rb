module Api
  module V1
    module User
      class ShutingsController < BaseController
        def index
          render json: Shuting.all, status: :ok
        end

        def show
          shuting = Shuting.find(params[:id])
          render json: shuting, serializer: ShutingSerializer, status: :ok
        end
      end
    end
  end
end
