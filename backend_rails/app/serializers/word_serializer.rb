class WordSerializer < ActiveModel::Serializer
  attributes :id, :word, :limit_sec, :created_at
end
