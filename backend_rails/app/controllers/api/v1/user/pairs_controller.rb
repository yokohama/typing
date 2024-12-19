module Api
  module V1
    module User
      class PairsController < BaseController
        def index
          # TODO: serializerを使用
          #render json: current_user.fetch_relations, each_serializer: PairSerializer, status: :ok
          render json: current_user.fetch_relations, status: :ok
        end

        def create
          if ParentChild.exists?(
            parent_user_id: pair_params[:parent_user_id],
            child_user_id: pair_params[:child_user_id]
          )
            raise ActiveRecord::RecordNotUnique, duplicate_pair_message
          end

          pair = ParentChild.new(pair_params)
          pair.save!
          render json: pair, status: :ok
        end

        private

        def pair_params
          params.require(:pair).permit(
            :parent_user_id,
            :child_user_id
          )
        end

        def duplicate_pair_message
          "Pair (#{pair_params[:parent_user_id]}, #{pair_params[:child_user_id]}) already exists"
        end
      end
    end
  end
end
