class Api::V1::User::ProfilesController < Api::V1::User::BaseController

  def show
    render json: current_user, status: :ok
  end

  def update
  end
end
