class CreateWords < ActiveRecord::Migration[7.0]
  def change
    create_table :words do |t|
      t.references :shuting, null: false, foreign_key: { on_delete: :cascade }
      t.string :word, null: false
      t.integer :limit_sec, null: false, default: 0
      t.timestamp :deleted_at, default: nil

      t.timestamps
    end
  end
end
