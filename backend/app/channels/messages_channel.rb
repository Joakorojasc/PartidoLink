class MessagesChannel < ApplicationCable::Channel
  def subscribed
    conversation_id = params[:conversation_id]
    if conversation_id
      stream_from "conversation_#{conversation_id}"
    else
      reject
    end
  end

  def unsubscribed
    stop_all_streams
  end
end
