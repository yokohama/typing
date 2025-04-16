class ShutingSerializer < ActiveModel::Serializer
  attributes :id, :level, :description, :is_random, :created_at

  has_many :words, serializer: WordSerializer
end
