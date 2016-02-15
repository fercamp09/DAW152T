class AddColumnSharedToDiagramsUsers < ActiveRecord::Migration
  def change
    add_column :diagrams_users, :shared, :boolean
  end
end
