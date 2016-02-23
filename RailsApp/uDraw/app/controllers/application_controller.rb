class ApplicationController < ActionController::Base
  before_action :require_user, only: [:workstation, :window]
  before_action :set_document, only: [:workstation]
  before_action :set_my_documents, only: [:window]
  before_action :set_shared_documents, only: [:window]

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :current_user
  helper_method :require_user

  def not_found
    respond_to do |format|
      format.html { render status: 404 }
    end
  rescue ActionController::UnknownFormat
    render status: 404, text: "nope"
  end

  def index
  end

  def login
  end

  def window

  end

  def workstation
    gon.push({ :diagram_image => @document.image })
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def require_user
    redirect_to '/login' unless current_user
  end

  def require_editor
    redirect_to window_url unless current_user.editor?
  end

  def delete_owns
    redirect_to window_url unless current_user.editor_or_admin?
  end

  def require_editor_or_admin
    redirect_to window_url unless current_user.editor_or_admin?
  end

  def require_admin
    redirect_to window_url unless current_user.admin?
  end

  private
  def set_document
    @document = Diagram.find(params[:id])
  end

  def set_my_documents
     #@my_documents = (User.find_by espol: current_user).own_diagrams
     @my_documents =  current_user.own_diagrams.map do |d| (Diagram.find_by id: d.diagram_id) end
    #@my_documents = Diagram.all
  end

  def set_shared_documents
    #@shared_documents = (User.find_by espol: 'ferecamp').diagrams_users.where(shared: true)
    #@shared_documents = User.first.shared_diagrams
    #@shared_documents = Diagram.joins(:users).where(: 'ferecamp')
    @shared_documents =  current_user.shared_diagrams.map do |d| (Diagram.find_by id: d.diagram_id) end
    #@shared_documents = Diagram.all
  end




end