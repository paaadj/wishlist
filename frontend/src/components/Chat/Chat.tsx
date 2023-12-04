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
import IconButton from "../IconButton/IconButton";
interface IChat {
  userReciver: userData;
  chatItem: { id: number; title: string };
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
  const { userReciver, chatItem, handleClose } = props;
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
          `/backend/api/chats/${chatItem.id}`,
          requestParams
        );
        if (!response.ok) {
          throw new Error("Cannot fetch previous chat messages");
        }
        const data = await response.json();
        setChatMessages(data);
        setLoading(false);
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
    if (socket.current?.OPEN) {
      socket.current?.close();
      console.log("Disconnect");
    }
    socket.current = new WebSocket(
      `ws://127.0.0.1:8000/api/chats/${chatItem.id}/ws`
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
  }, [chatItem]);
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
        <div className={styles.header}>
          <h5>{userReciver.username}</h5>
          <h5>{chatItem.title}</h5>
          <button onClick={handleClose}>Close chat</button>
        </div>
        <div
          ref={chatMessagesContainerRef}
          className={styles.messages_container}
        >
          {chatMessages && !isLoading && user ? (
            chatMessages.messages.map((item) => {
              return (
                <p
                  className={classNames(
                    styles.message,
                    "page-text",
                    "page-reg-text",
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
            className={classNames(styles.chat_input, "page-text", "page-reg-text")}
            onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
              if (event.key === "Enter" && chatInputRef.current) {
                event.preventDefault();
                handleChat(chatInputRef.current.innerHTML);
                chatInputRef.current.innerHTML = "";
              }
            }}
            ref={chatInputRef}
          ></div>
          <IconButton size={32} iconSrc="/img/telegram.png" onClick={() => {
              if (chatInputRef.current) {
                handleChat(chatInputRef.current.innerHTML);
                chatInputRef.current.innerHTML = "";
              }
            }} />
          {/* <button
            onClick={() => {
              if (chatInputRef.current) {
                handleChat(chatInputRef.current.innerHTML);
                chatInputRef.current.innerHTML = "";
              }
            }}
          >
            Send message
          </button> */}
        </div>
      </div>
    </>
  );
}

export default Chat;
