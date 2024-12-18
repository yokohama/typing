class Api::V1::User::ResultsController < Api::V1::User::BaseController
  def index
    results = Result.all
    render json: results, each_serializer: ResultSerializer, status: :ok
  end

  def show
    result = Result.find(params[:id])
    render json: result, serializer: ResultSerializer, status: :ok
  end

  def create
    result = Result.new(
      result_params.merge(
        user_id: current_user.id,
        score: score,
        time_bonus: time_bonus,
        point: point
      )
    )

    if result.save
      render json: result, serializer: ResultSerializer, status: :created
    else
      render json: {
        error: "Failed to create result",
        details: result.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def result_params
    params.require(:result).permit(
      :shuting_id,
      :correct_count,
      :incorrect_count,
      :time,
      :perfect_count
    )
  end

  # TODO: implement
  def score
    0
  end

  # TODO: implement
  def time_bonus
    0
  end

  # TODO: implement
  def point
    0
  end
end
