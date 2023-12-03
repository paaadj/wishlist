import React, { useContext, useEffect, useRef } from "react";
import {
  UserContext,
  UserContextType,
  userData,
} from "../../context/UserContext";
import styles from "./chat.module.css";
interface IChat {
  userReciver: userData;
}
type chatMessage = {
  id: number;
  user: number;
  text: string;
  reply_to: number | null;
  timestamp: string;
};
type chatHistory = {
  id: number;
  wishlist_item: number;
  messages: chatMessage[];
};

function Chat(props: IChat) {
  const socket = useRef<WebSocket>();
  const { userReciver } = props;
  const { getAccessCookie, user } = useContext(UserContext) as UserContextType;
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [chatMessages, setChatMessages] = React.useState<
    chatHistory | undefined
  >(undefined);
  const chatMessage = React.useRef<chatMessage>();

  const addMessage = async (message: chatMessage) => {
    if (chatMessages && message) {
      const updatedChatMessages = {
        ...chatMessages,
        messages: [...chatMessages.messages, message],
      };

      setChatMessages(updatedChatMessages);
    }
  };

  React.useEffect(() => {
    console.log("Connect");
    const fetchPrevChatMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestParams = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getAccessCookie(),
          },
        };

        const response = await fetch(`/backend/api/chats/${20}`, requestParams);
        if (!response.ok) {
          throw new Error("Cannot fetch previous chat messages");
        }
        const data = await response.json();
        setChatMessages(data);
      } catch (err) {
        console.log("Error" + (err instanceof Error ? err.message : ""));
      }
    };

    socket.current = new WebSocket("ws://127.0.0.1:8000/api/chats/20/ws");
    socket.current.onopen = () => {
      if (socket.current) {
        socket.current.send(getAccessCookie() ?? "");
      }
    };

    fetchPrevChatMessages();
    return () => {
      if (socket.current?.OPEN) {
        socket.current?.close();
        console.log("Disconnect");
      }
    };
  }, []);
  /**
   * Update onMessage function to see current chatMessages(fix required maybe, I don't know)
   */
  useEffect(() => {
    if (socket.current) {
      socket.current.onmessage = (message) => {
        if (message.data !== "Success") {
          const messageData = JSON.parse(message.data);
          if (messageData.text !== "Success") {
            chatMessage.current = messageData;
            if (chatMessage.current) {
              addMessage(chatMessage.current);
            }
          }
        }
      };
    }
  }, [chatMessages]);

  const handleChat = () => {
    if (socket.current) {
      socket.current.send(JSON.stringify({ text: "test", reply_to: 0 }));
      console.log("SEND");
    }
  };


  return (
    <>
      <button onClick={handleChat}>Send message</button>
      <div className={styles.chat}>
        <div className={styles.messages_container}>
          {chatMessages ? (
            chatMessages.messages.map((item) => {
              return <p key={item.id}>{item.text + " : " + item.timestamp}</p>;
            })
          ) : (
            <p>Loading</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
