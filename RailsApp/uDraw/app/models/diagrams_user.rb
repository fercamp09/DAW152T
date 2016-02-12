class DiagramsUser < ActiveRecord::Base
  belongs_to :user
  belongs_to :diagram
end
