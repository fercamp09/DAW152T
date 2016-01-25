class Diagram < ActiveRecord::Base
  has_many :diagrams_users
  has_many :users, through: :diagrams_users
end
