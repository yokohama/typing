class User < ApplicationRecord
  has_many :results, dependent: :destroy

  has_many :parent_relationships,
    class_name: "ParentChild", foreign_key: "child_user_id",
    dependent: :destroy
  has_many :parents, through: :parent_relationships, source: :parent

  has_many :child_relationships,
    class_name: "ParentChild", foreign_key: "parent_user_id",
    dependent: :destroy
  has_many :children, through: :child_relationships, source: :child

  def fetch_relations
    child_results = self.child_relationships.includes(:child).map do |r|
      {
        relation_type: 'child',
        relation_user_id: r.child_id,
        relation_user_name: r.child.name,
        created_at: r.created_at
      }
    end

    parent_results = self.parent_relationships.includes(:parent).map do |r|
      {
        relation_type: 'parent',
        relation_user_id: r.parent_id,
        relation_user_name: r.parent.name,
        created_at: r.created_at
      }
    end

    child_results + parent_results
  end
end
