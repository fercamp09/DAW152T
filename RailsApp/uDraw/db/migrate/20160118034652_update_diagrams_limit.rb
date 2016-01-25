class UpdateDiagramsLimit < ActiveRecord::Migration
  def change
    change_column :diagrams, :image, :text, limit: 5.kilobyte
  end
end
