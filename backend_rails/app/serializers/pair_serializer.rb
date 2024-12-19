class PairSerializer < ActiveModel::Serializer
  attributes :relation_type,
    :relation_user_id,
    :relation_user_name,
    :created_at
end
