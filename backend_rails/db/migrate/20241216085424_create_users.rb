class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email, null: false, unique: true
      t.string :name
      t.integer :point, null: false, default: 0
      t.integer :total_point, null: false, default: 0
      t.timestamp :deleted_at, default: nil

      t.timestamps
    end
    add_index :users, :email, unique: true
  end
end
