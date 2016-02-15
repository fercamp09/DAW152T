# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160126182618) do

  create_table "diagrams", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.text     "image",      limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "diagrams_users", id: false, force: :cascade do |t|
    t.integer "diagram_id", limit: 4, null: false
    t.integer "user_id",    limit: 4, null: false
    t.boolean "shared"
  end

  create_table "identities", force: :cascade do |t|
    t.integer  "user_id",    limit: 4
    t.string   "provider",   limit: 255
    t.string   "uid",        limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "identities", ["user_id"], name: "index_identities_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name",                limit: 255
    t.string   "facebook",            limit: 255
    t.string   "twitter",             limit: 255
    t.string   "google",              limit: 255
    t.string   "espol",               limit: 255
    t.string   "email",               limit: 255
    t.string   "password_digest",     limit: 255
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.datetime "remember_created_at"
  end

  add_foreign_key "identities", "users"
end
