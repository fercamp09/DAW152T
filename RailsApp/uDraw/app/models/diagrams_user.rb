class DiagramsUser < ActiveRecord::Base
  belongs_to :user
  belongs_to :diagram


  def exists?
    self.diagram == current_user.diagrams
  end

end
