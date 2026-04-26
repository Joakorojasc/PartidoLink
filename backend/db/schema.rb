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

ActiveRecord::Schema[8.1].define(version: 2026_04_26_032302) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "bookings", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "created_by_id", null: false
    t.date "date", null: false
    t.time "end_time", null: false
    t.text "notes"
    t.string "payment_mode", default: "full"
    t.time "start_time", null: false
    t.string "status", default: "pending"
    t.bigint "team_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "venue_id", null: false
    t.index ["created_by_id"], name: "index_bookings_on_created_by_id"
    t.index ["team_id"], name: "index_bookings_on_team_id"
    t.index ["venue_id"], name: "index_bookings_on_venue_id"
  end

  create_table "conversation_participants", force: :cascade do |t|
    t.bigint "conversation_id", null: false
    t.datetime "created_at", null: false
    t.bigint "team_id", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_conversation_participants_on_conversation_id"
    t.index ["team_id"], name: "index_conversation_participants_on_team_id"
  end

  create_table "conversations", force: :cascade do |t|
    t.string "conversation_type", default: "direct"
    t.datetime "created_at", null: false
    t.bigint "match_id"
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["match_id"], name: "index_conversations_on_match_id"
  end

  create_table "match_results", force: :cascade do |t|
    t.integer "away_score", null: false
    t.datetime "created_at", null: false
    t.integer "home_score", null: false
    t.boolean "is_validated", default: false
    t.bigint "match_id", null: false
    t.text "notes"
    t.string "status", default: "pending"
    t.bigint "submitted_by_team_id", null: false
    t.boolean "suspicious", default: false
    t.datetime "updated_at", null: false
    t.index ["match_id", "submitted_by_team_id"], name: "index_match_results_on_match_id_and_submitted_by_team_id", unique: true
    t.index ["match_id"], name: "index_match_results_on_match_id"
    t.index ["submitted_by_team_id"], name: "index_match_results_on_submitted_by_team_id"
  end

  create_table "matches", force: :cascade do |t|
    t.bigint "away_team_id", null: false
    t.bigint "booking_id"
    t.string "commune"
    t.datetime "created_at", null: false
    t.bigint "home_team_id", null: false
    t.boolean "is_open", default: false
    t.datetime "scheduled_at"
    t.bigint "sport_id", null: false
    t.string "status", default: "scheduled"
    t.datetime "updated_at", null: false
    t.bigint "venue_id"
    t.index ["away_team_id"], name: "index_matches_on_away_team_id"
    t.index ["booking_id"], name: "index_matches_on_booking_id"
    t.index ["home_team_id"], name: "index_matches_on_home_team_id"
    t.index ["sport_id"], name: "index_matches_on_sport_id"
    t.index ["venue_id"], name: "index_matches_on_venue_id"
  end

  create_table "messages", force: :cascade do |t|
    t.text "content", null: false
    t.bigint "conversation_id", null: false
    t.datetime "created_at", null: false
    t.datetime "read_at"
    t.bigint "sender_id", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "ratings", force: :cascade do |t|
    t.text "comment"
    t.datetime "created_at", null: false
    t.boolean "is_public", default: true
    t.bigint "match_id"
    t.bigint "rated_team_id", null: false
    t.bigint "rater_id", null: false
    t.integer "score", null: false
    t.datetime "updated_at", null: false
    t.index ["match_id"], name: "index_ratings_on_match_id"
    t.index ["rated_team_id"], name: "index_ratings_on_rated_team_id"
    t.index ["rater_id"], name: "index_ratings_on_rater_id"
  end

  create_table "sports", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "icon"
    t.string "name", null: false
    t.string "sport_type", null: false
    t.datetime "updated_at", null: false
  end

  create_table "team_members", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "role", default: "member"
    t.bigint "team_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["team_id", "user_id"], name: "index_team_members_on_team_id_and_user_id", unique: true
    t.index ["team_id"], name: "index_team_members_on_team_id"
    t.index ["user_id"], name: "index_team_members_on_user_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "avatar_url"
    t.bigint "captain_id", null: false
    t.string "commune"
    t.datetime "created_at", null: false
    t.text "description"
    t.boolean "is_open", default: true
    t.string "name", null: false
    t.bigint "sport_id", null: false
    t.datetime "updated_at", null: false
    t.index ["captain_id"], name: "index_teams_on_captain_id"
    t.index ["sport_id"], name: "index_teams_on_sport_id"
  end

  create_table "user_sports", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "skill_level", default: "beginner"
    t.bigint "sport_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["sport_id"], name: "index_user_sports_on_sport_id"
    t.index ["user_id", "sport_id"], name: "index_user_sports_on_user_id_and_sport_id", unique: true
    t.index ["user_id"], name: "index_user_sports_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "avatar_url"
    t.text "bio"
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "jti", default: "", null: false
    t.string "name", null: false
    t.string "phone"
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.string "rut", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["rut"], name: "index_users_on_rut", unique: true
  end

  create_table "venues", force: :cascade do |t|
    t.string "address"
    t.string "city", default: "Santiago"
    t.string "commune"
    t.datetime "created_at", null: false
    t.text "description"
    t.string "image_url"
    t.boolean "is_active", default: true
    t.string "name", null: false
    t.string "phone"
    t.integer "price_per_hour"
    t.bigint "sport_id", null: false
    t.datetime "updated_at", null: false
    t.string "website"
    t.index ["sport_id"], name: "index_venues_on_sport_id"
  end

  add_foreign_key "bookings", "teams"
  add_foreign_key "bookings", "users", column: "created_by_id"
  add_foreign_key "bookings", "venues"
  add_foreign_key "conversation_participants", "conversations"
  add_foreign_key "conversation_participants", "teams"
  add_foreign_key "conversations", "matches"
  add_foreign_key "match_results", "matches"
  add_foreign_key "match_results", "teams", column: "submitted_by_team_id"
  add_foreign_key "matches", "bookings"
  add_foreign_key "matches", "sports"
  add_foreign_key "matches", "teams", column: "away_team_id"
  add_foreign_key "matches", "teams", column: "home_team_id"
  add_foreign_key "matches", "venues"
  add_foreign_key "messages", "conversations"
  add_foreign_key "messages", "users", column: "sender_id"
  add_foreign_key "ratings", "matches"
  add_foreign_key "ratings", "teams", column: "rated_team_id"
  add_foreign_key "ratings", "users", column: "rater_id"
  add_foreign_key "team_members", "teams"
  add_foreign_key "team_members", "users"
  add_foreign_key "teams", "sports"
  add_foreign_key "teams", "users", column: "captain_id"
  add_foreign_key "user_sports", "sports"
  add_foreign_key "user_sports", "users"
  add_foreign_key "venues", "sports"
end
