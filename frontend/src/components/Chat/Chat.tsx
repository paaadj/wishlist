import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  UserContext,
  UserContextType,
  userData,
} from "../../context/UserContext";
import styles from "./chat.module.css";
import classNames from "classnames";
interface IChat {
  userReciver: userData;
  chatId: number;
  handleClose: () => void;
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
  const { userReciver, chatId, handleClose } = props;
  const { getAccessCookie, user, tryRefreshToken } = useContext(
    UserContext
  ) as UserContextType;
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [chatMessages, setChatMessages] = React.useState<
    chatHistory | undefined
  >(undefined);
  const chatMessage = React.useRef<chatMessage>();
  const chatMessagesContainerRef = React.useRef<HTMLDivElement>(null);
  const chatInputRef = React.useRef<HTMLDivElement>(null);
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
    console.log(user);
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

        const response = await fetch(
          `/backend/api/chats/${chatId}`,
          requestParams
        );
        if (!response.ok) {
          throw new Error("Cannot fetch previous chat messages");
        }
        const data = await response.json();
        setChatMessages(data);
      } catch (err) {
        try {
          const refreshResponse = await tryRefreshToken();
          if (!refreshResponse) {
            throw new Error("Cannot refresh user");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "");
          console.log("Error" + (err instanceof Error ? err.message : ""));
          return;
        }
      }
    };

    socket.current = new WebSocket(
      `ws://127.0.0.1:8000/api/chats/${chatId}/ws`
    );
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
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTop =
        chatMessagesContainerRef.current.scrollHeight;
    }
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

  const handleChat = (message: string) => {
    if (socket.current && message) {
      socket.current.send(JSON.stringify({ text: message, reply_to: 0 }));
      console.log("SEND");
    }
  };

  return (
    <>
      <div className={classNames(styles.chat)}>
        <h5>{userReciver.username}</h5>
        <button onClick={handleClose}>Close chat</button>
        <div
          ref={chatMessagesContainerRef}
          className={styles.messages_container}
        >
          {chatMessages && user ? (
            chatMessages.messages.map((item) => {
              console.log(item.user + " and " + user.id);
              return (
                <p
                  className={classNames(
                    styles.message,
                    { [styles.self_message]: item.user === user.id },
                    { [styles.recived_message]: item.user !== user.id }
                  )}
                  key={item.id}
                >
                  {item.text + " : " + item.timestamp}
                </p>
              );
            })
          ) : (
            <p>Loading</p>
          )}
        </div>
        <div className={styles.chat_input_field}>
          <div
            contentEditable
            className={styles.chat_input}
            onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
              if (event.key === "Enter" && chatInputRef.current) {
                handleChat(chatInputRef.current.innerHTML);
                chatInputRef.current.innerHTML = "";
              }
            }}
            ref={chatInputRef}
          ></div>
          <button
            onClick={() => {
              if (chatInputRef.current) {
                handleChat(chatInputRef.current.innerHTML);
                chatInputRef.current.innerHTML = "";
              }
            }}
          >
            Send message
          </button>
        </div>
      </div>
    </>
  );
}

export default Chat;
