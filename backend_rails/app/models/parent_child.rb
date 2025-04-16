class ParentChild < ApplicationRecord
  belongs_to :parent, class_name: 'User', foreign_key: 'parent_user_id'
  belongs_to :child, class_name: 'User', foreign_key: 'child_user_id'
end
