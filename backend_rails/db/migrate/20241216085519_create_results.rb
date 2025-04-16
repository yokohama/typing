class CreateResults < ActiveRecord::Migration[7.0]
  def change
    create_table :results do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :shuting, null: false, foreign_key: { on_delete: :cascade }
      t.integer :correct_count, null: false
      t.integer :incorrect_count, null: false
      t.integer :time, null: false
      t.integer :score, null: false
      t.integer :perfect_count, null: false
      t.integer :time_bonus, null: false
      t.integer :point, null: false
      t.timestamp :deleted_at, default: nil

      t.timestamps
    end
  end
end
