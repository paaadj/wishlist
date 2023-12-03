import React, { useContext, useRef } from "react";
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

  React.useEffect(() => {
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

        const response = await fetch(`/backend/apichats/${20}`, requestParams);
        if (!response.ok) {
          throw new Error("Cannot fetch previous chat messages");
        }
        const data = await response.json();
        setChatMessages(data);
      } catch (err) {
        console.log("Error" + (err instanceof Error ? err.message : ""));
      }
    };
    fetchPrevChatMessages();
    socket.current = new WebSocket("ws://127.0.0.1:8000/api/chats/20/ws");
    socket.current.onopen = () => {
      if (socket.current) {
        console.log(getAccessCookie());
        socket.current.send(getAccessCookie() ?? "");
        console.log("Connect");
      }
      if (chatMessages) {
        console.log(chatMessages);
      }
    };

    return () => {
      if (socket.current?.OPEN) {
        socket.current?.close();
        console.log("Disconnect");
      }
    };
  }, []);

  const handleChat = () => {
    if (socket.current) {
      socket.current.send(JSON.stringify({ text: "test", reply_to: 0 }));
      if (user && chatMessages) {
        const updateChatHistoryMessages = [
          ...chatMessages.messages,
          {
            id: (chatMessages.messages.at(-1)?.id ?? 0)  + 1,
            user: user?.id,
            text: "test " + new Date(),
            reply_to: 0,
            timestamp: "data",
          },
        ];
        setChatMessages((prev) => {
          return prev
            ? {
                ...prev,
                messages: updateChatHistoryMessages,
              }
            : prev;
        });
      }
      console.log("test");
    }
  };
  const handleConnection = () => {
    // socket.current = new WebSocket("ws://127.0.0.1:8000/api/chats/16/ws");
    // if(!socket.current.CONNECTING){
    //     socket.current.send(getAccessCookie() ?? "");
    // }
    console.log("Connect");
  };
  const handleDisconnection = () => {
    socket.current?.close();
    console.log("Disconnect");
  };

  return (
    <>
      <button onClick={handleConnection}>Connect</button>
      <button onClick={handleDisconnection}>Disonnect</button>
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
