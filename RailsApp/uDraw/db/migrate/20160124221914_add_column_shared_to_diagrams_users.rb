class AddColumnSharedToDiagramsUsers < ActiveRecord::Migration
  def change
    change_column :diagrams_users, :shared, :boolean
  end
end
