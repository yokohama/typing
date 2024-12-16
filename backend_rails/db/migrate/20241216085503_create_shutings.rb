class CreateShutings < ActiveRecord::Migration[7.0]
  def change
    create_table :shutings do |t|
      t.integer :level, null: false
      t.string :description, null: false
      t.boolean :is_random, default: false
      t.timestamp :deleted_at, default: nil

      t.timestamps
    end
  end
end
