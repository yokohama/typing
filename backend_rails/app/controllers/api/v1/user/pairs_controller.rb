module Api
  module V1
    module User
      class PairsController < BaseController
        def index
          render json: current_user.fetch_relations,
            each_serializer: PairSerializer,
            status: :ok
        end

        def create
          # TODO: implement
          render json: ParentChild.new,
            status: :ok
        end
      end
    end
  end
end
