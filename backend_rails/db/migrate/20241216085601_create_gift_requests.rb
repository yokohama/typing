class CreateGiftRequests < ActiveRecord::Migration[7.0]
  def change
    create_table :gift_requests do |t|
      t.references :parent_user, null: false, foreign_key: { to_table: :users, on_delete: :cascade }
      t.references :child_user, null: false, foreign_key: { to_table: :users, on_delete: :cascade }
      t.integer :point, null: false
      t.timestamp :approved_at
      t.timestamp :rejected_at
      t.timestamp :deleted_at, default: nil

      t.timestamps
    end
  end
end
