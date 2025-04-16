class CreateParentChildren < ActiveRecord::Migration[7.0]
  def change
    create_table :parent_children, id: false do |t|
      t.references :parent_user, null: false, foreign_key: { to_table: :users, on_delete: :cascade }
      t.references :child_user, null: false, foreign_key: { to_table: :users, on_delete: :cascade }
      t.timestamp :deleted_at, default: nil

      t.timestamps

      t.index [:child_user_id, :parent_user_id], unique: true, name: "index_parent_children_on_child_and_parent"
    end

    # 自己参照を防ぐチェック制約
    reversible do |dir|
      dir.up do
        execute <<-SQL
          ALTER TABLE parent_children
          ADD CONSTRAINT chk_no_self_reference
          CHECK (child_user_id != parent_user_id)
        SQL
      end

      dir.down do
        execute <<-SQL
          ALTER TABLE parent_children
          DROP CONSTRAINT chk_no_self_reference
        SQL
      end
    end
  end
end
