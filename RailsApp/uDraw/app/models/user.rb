class User < ActiveRecord::Base
  has_many :diagrams_users
  has_many :diagrams, through: :diagrams_users
  has_many :shared_diagrams , -> { where shared: true }, class_name: "DiagramsUser"
  has_many :own_diagrams , -> { where shared: nil}, class_name: "DiagramsUser"

end
