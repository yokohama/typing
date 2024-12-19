module Api
  module V1
    module User
      class ShutingResultsController < BaseController
        def index
          results = Result.all
          render json: results, each_serializer: ResultSerializer, status: :ok
        end

        def create
          result = Result.new(
            result_params.merge(
              user_id: current_user.id,
              score: score,
              time_bonus: time_bonus,
              point: point
            )
          )
          result.save!

          render json: result, serializer: ResultSerializer, status: :created
        end

        private

        def result_params
          params.require(:shuting_result).permit(
            :shuting_id,
            :correct_count,
            :incorrect_count,
            :time,
            :perfect_count
          )
        end

        # TODO: implement
        def score
          0
        end

        # TODO: implement
        def time_bonus
          0
        end

        # TODO: implement
        def point
          0
        end
      end
    end
  end
end
