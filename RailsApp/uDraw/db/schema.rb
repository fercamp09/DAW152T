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

ActiveRecord::Schema.define(version: 20160220013128) do

  create_table "atributes", force: :cascade do |t|
    t.string   "info",           limit: 255
    t.integer  "entity_id",      limit: 4
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.string   "x",              limit: 255
    t.string   "y",              limit: 255
    t.string   "atribute_class", limit: 255
  end

  add_index "atributes", ["entity_id"], name: "index_atributes_on_entity_id", using: :btree

  create_table "diagrams", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.text     "image",      limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.integer  "global_id",  limit: 4
  end

  create_table "diagrams_users", id: false, force: :cascade do |t|
    t.integer "diagram_id", limit: 4, null: false
    t.integer "user_id",    limit: 4, null: false
    t.boolean "shared"
  end

  create_table "entities", force: :cascade do |t|
    t.string   "height",     limit: 255
    t.string   "width",      limit: 255
    t.string   "y0",         limit: 255
    t.string   "x0",         limit: 255
    t.string   "title",      limit: 255
    t.string   "transform",  limit: 255
    t.string   "svg_id",     limit: 255
    t.integer  "diagram_id", limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "entities", ["diagram_id"], name: "index_entities_on_diagram_id", using: :btree

  create_table "identities", force: :cascade do |t|
    t.integer  "user_id",    limit: 4
    t.string   "provider",   limit: 255
    t.string   "uid",        limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "identities", ["user_id"], name: "index_identities_on_user_id", using: :btree

  create_table "relations", force: :cascade do |t|
    t.string   "arrow_start",    limit: 255
    t.string   "arrow_end",      limit: 255
    t.string   "relation_class", limit: 255
    t.string   "x1",             limit: 255
    t.string   "y1",             limit: 255
    t.string   "x2",             limit: 255
    t.string   "y2",             limit: 255
    t.integer  "entity_id",      limit: 4
    t.integer  "diagram_id",     limit: 4
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.string   "name",           limit: 255
  end

  add_index "relations", ["diagram_id"], name: "index_relations_on_diagram_id", using: :btree
  add_index "relations", ["entity_id"], name: "index_relations_on_entity_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name",                limit: 255
    t.string   "facebook",            limit: 255
    t.string   "twitter",             limit: 255
    t.string   "google",              limit: 255
    t.string   "espol",               limit: 255
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.datetime "remember_created_at"
    t.string   "role",                limit: 255
  end

  add_foreign_key "atributes", "entities"
  add_foreign_key "entities", "diagrams"
  add_foreign_key "identities", "users"
  add_foreign_key "relations", "diagrams"
  add_foreign_key "relations", "entities"
end
