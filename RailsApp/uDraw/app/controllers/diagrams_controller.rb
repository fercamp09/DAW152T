class DiagramsController < ApplicationController
  before_action :require_diagram_exists, only: [:show, :edit]
  before_action :set_diagram, only: [:show, :edit, :update, :destroy, :share]
  before_action :set_diagrams_id, only: [:new]
  before_action :require_user, only: [:index, :show, :new, :edit, :create, :update, :destroy]
  before_action :require_editor_or_admin, only: [:show, :edit]
  before_action :require_admin, only: [:index]
  before_action :require_shared, only: [:show, :edit]
  before_action :require_owner, only: [:destroy]

  # GET /diagrams
  # GET /diagrams.json
  def index
    @diagrams = Diagram.page(params[:page]).per(10)
  end

  # GET /diagrams/1
  # GET /diagrams/1.json
  def show
    @comment = Comment.new
    @comments = Comment.order('created_at DESC')
    gon.push({:diagram_image => @diagram.image, :diagram_id => @diagram.id, :global_id => @diagram.global_id})
    gon.diagram_entities = @diagram.entities.as_json
    for i in 0...gon.diagram_entities.length
        gon.diagram_entities[i].merge!({'atributes' => @diagram.entities[i].atributes.as_json })
    end
    gon.diagram_relations = @diagram.relations.as_json
  end

  # GET /diagrams/new
  def new
    @diagram = Diagram.new
    #gon.push({:global_id => 0})
  end

  # GET /diagrams/1/edit
  def edit
  end

  # POST /diagrams
  # POST /diagrams.json
  def create
    #@diagram = current_user.diagrams.create({name: params[:diagram][:name], image: params[:diagram][:name]+'.png', global_id: params[:diagram][:global_id]})
    @diagram = current_user.diagrams.create(diagram_params)
    @diagram.global_id = 0
    @diagram.image = @diagram.name + '.png'
    respond_to do |format|
      if @diagram.save
        format.html { redirect_to @diagram, notice: 'Diagram was successfully created.' }
        format.json { render :show, status: :created, location: @diagram, notice: 'Diagram was successfully created.'  }
      else
        format.html { render :new }
        format.json { render json: @diagram.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /diagrams/1
  # PATCH/PUT /diagrams/1.json
  def update
    create_diagram
    #entities_hash.each {|key, value| @diagram.update({entities: entities.merge!(value)}) }
    #entity = Entity.new(entities, {diagram_id: @diagram.id})
    #entities_hash.each {|key, value| entities.push(value)}
    #ent = @diagram.entities.update(@diagram.entities.ids, entities)
    #diag = @diagram.relations.update(@diagram.relations.ids, relations_hash)
    respond_to do |format|
      if @diagram.update(diagram_params)
        format.html { redirect_to @diagram, notice: 'Diagram was successfully updated.' }
        format.json { render :show, status: :ok, location: @diagram }
      else
        format.html { render :edit }
        format.json { render json: @diagram.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /diagrams/1
  # DELETE /diagrams/1.json
  def destroy
    @diagram.destroy
    respond_to do |format|
      format.html { redirect_to window_path, notice: 'Diagram was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def share
    DiagramsUser.create(diagram_id: @diagram.id, user_id: (User.find_by espol: params[:share_user]).id, shared: true)
    respond_to do |format|
      format.html { }
      format.json {head :no_content}
    end
  end
  private
  # Use callbacks to share common setup or constraints between actions.
  def set_diagram
    @diagram = Diagram.find_by_id (params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def diagram_params
    params.permit(:diagram_entities, :diagram_relations)
    params.require(:diagram).permit(:name, :global_id)
  end

  def set_diagrams_id
    @diagrams_id = Diagram.last.id + 1
  end

  def create_diagram
    entities = []
    entities_hash = ActiveSupport::JSON.decode(params[:diagram_entities])
    relations_hash = ActiveSupport::JSON.decode(params[:diagram_relations])
    @diagram.entities.destroy_all
    @diagram.relations.destroy_all
    entities_hash.each {|key, value|
      entity = @diagram.entities.create({height: value['height'], width: value['width'], y0: value['y0'], x0: value['x0'], title: value['title'], transform: value['transform'], svg_id: value['svg_id']})
      value['atributes'].each { |hash|
        entity.atributes.create({info: hash['info'], x: hash['x'], y: hash['y'], atribute_class: hash['atribute_class'], svg_id: hash['svg_id']})
      }
    }
    relations_hash.each {|hash|
      diagram = @diagram.relations.create(hash)
    }
  end

  def owner_diagram?
    #self.diagram_user
    @diagram.diagrams_users.exists?(user_id: current_user.id, shared: nil)
  end

  def belongs_to_user?
    #self.diagram_user
    @diagram.diagrams_users.exists?(user_id: current_user.id)
  end

  def require_owner
    redirect_to window_url unless owner_diagram? or current_user.admin?
  end

  def require_shared
    redirect_to window_url unless belongs_to_user? or current_user.admin?
  end

  def diagram_exists?
    @diagram = Diagram.find_by_id (params[:id])
    #@diagram ? true : false
  end

  def require_diagram_exists
    redirect_to window_url unless diagram_exists?
  end

end
