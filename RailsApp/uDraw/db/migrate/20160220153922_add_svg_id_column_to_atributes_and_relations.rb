class AddSvgIdColumnToAtributesAndRelations < ActiveRecord::Migration
  def change
    add_column :atributes, :svg_id, :string
    add_column :relations, :svg_id, :string
  end
end
