# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_12_16_085734) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "gift_requests", force: :cascade do |t|
    t.bigint "parent_user_id", null: false
    t.bigint "child_user_id", null: false
    t.integer "point", null: false
    t.datetime "approved_at", precision: nil
    t.datetime "rejected_at", precision: nil
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["child_user_id"], name: "index_gift_requests_on_child_user_id"
    t.index ["parent_user_id"], name: "index_gift_requests_on_parent_user_id"
  end

  create_table "parent_children", id: false, force: :cascade do |t|
    t.bigint "parent_user_id", null: false
    t.bigint "child_user_id", null: false
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["child_user_id", "parent_user_id"], name: "index_parent_children_on_child_and_parent", unique: true
    t.index ["child_user_id"], name: "index_parent_children_on_child_user_id"
    t.index ["parent_user_id"], name: "index_parent_children_on_parent_user_id"
    t.check_constraint "child_user_id <> parent_user_id", name: "chk_no_self_reference"
  end

  create_table "results", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "shuting_id", null: false
    t.integer "correct_count", null: false
    t.integer "incorrect_count", null: false
    t.integer "time", null: false
    t.integer "score", null: false
    t.integer "perfect_count", null: false
    t.integer "time_bonus", null: false
    t.integer "point", null: false
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shuting_id"], name: "index_results_on_shuting_id"
    t.index ["user_id"], name: "index_results_on_user_id"
  end

  create_table "shutings", force: :cascade do |t|
    t.integer "level", null: false
    t.string "description", null: false
    t.boolean "is_random", default: false
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "name"
    t.integer "point", default: 0, null: false
    t.integer "total_point", default: 0, null: false
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "words", force: :cascade do |t|
    t.bigint "shuting_id", null: false
    t.string "word", null: false
    t.integer "limit_sec", default: 0, null: false
    t.datetime "deleted_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shuting_id"], name: "index_words_on_shuting_id"
  end

  add_foreign_key "gift_requests", "users", column: "child_user_id", on_delete: :cascade
  add_foreign_key "gift_requests", "users", column: "parent_user_id", on_delete: :cascade
  add_foreign_key "parent_children", "users", column: "child_user_id", on_delete: :cascade
  add_foreign_key "parent_children", "users", column: "parent_user_id", on_delete: :cascade
  add_foreign_key "results", "shutings", on_delete: :cascade
  add_foreign_key "results", "users", on_delete: :cascade
  add_foreign_key "words", "shutings", on_delete: :cascade
end
