class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.text :body
      t.string :user_name
      t.references :diagram, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
