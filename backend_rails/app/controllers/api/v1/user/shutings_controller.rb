class Api::V1::User::ShutingsController < Api::V1::User::BaseController
  def index
    render json: Shuting.all, status: :ok
  end

  def show
    shuting = Shuting.find(params[:id])
    render json: shuting, serializer: ShutingSerializer, status: :ok
  end
end
