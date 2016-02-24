class CommentsController < ApplicationController
  def new
    @comment = Comment.new
    @comments = Comment.order('created_at DESC')
  end

  def create
    @diagram = Diagram.find_by(id: comment_params[:diagram_id])
    respond_to do |format|
      if 1
        #@comment = Comment.create(comment_params)
        @comment = @diagram.comments.build(body: comment_params[:body], user_name: comment_params[:user_name])
        if @comment.save
          flash.now[:success] = 'Your comment was successfully posted!'
        else
          flash.now[:error] = 'Your comment cannot be saved.'
        end
        format.html {redirect_to @diagram}
        format.js
      else
        format.html {redirect_to @diagram}
        format.js {render nothing: true}
      end
    end
  end

  private
  def comment_params
    params.require(:comment).permit(:body, :diagram_id, :user_name)
  end
end
