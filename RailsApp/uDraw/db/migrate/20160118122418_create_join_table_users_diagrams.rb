class CreateJoinTableUsersDiagrams < ActiveRecord::Migration
  def change
    create_join_table :diagrams, :users
  end
end
