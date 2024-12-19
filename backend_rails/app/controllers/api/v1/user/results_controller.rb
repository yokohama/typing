module Api
  module V1
    module User
      class ResultsController < BaseController
        def index
          results = current_user.results
          render json: results, each_serializer: ResultSerializer, status: :ok
        end

        def show
          result = current_user.results.find(params[:id])
          render json: result, serializer: ResultSerializer, status: :ok
        end
      end
    end
  end
end
