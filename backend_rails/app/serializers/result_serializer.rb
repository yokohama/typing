class ResultSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :shuting_id, :score, :correct_count,
    :incorrect_count, :time, :perfect_count, :time_bonus,
    :point, :created_at
end
