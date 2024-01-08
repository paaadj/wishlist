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
import Message from "./Message";
import { Flex, Icon, IconButton, Spinner } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { IoSend } from "react-icons/io5";
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
  const [currentMessageReplyTo, setCurrentMessageReplyTo] = React.useState<
    { messageId: number; messageText: string } | undefined
  >(undefined);

  const addMessage = async (message: chatMessage) => {
    if (chatMessages && message) {
      const updatedChatMessages = {
        ...chatMessages,
        messages: [...chatMessages.messages, message],
      };

      setChatMessages(updatedChatMessages);
    }
  };

  useEffect(() => {
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
  /**Handle click on sendMessageButton */
  const handleChat = (message: string) => {
    if (socket.current && message) {
      socket.current.send(
        JSON.stringify({
          text: message,
          reply_to: currentMessageReplyTo ? currentMessageReplyTo.messageId : 0,
        })
      );
      console.log("SEND");
    }
  };

  const sendMessage = () => {
    if (chatInputRef.current) {
      handleChat(chatInputRef.current.innerHTML);
      chatInputRef.current.innerHTML = "";
      setCurrentMessageReplyTo(undefined);
    }
  };
  /**Handle click on message in message container*/
  const handleMessageClick = (messageId: number, messageText: string) => {
    setCurrentMessageReplyTo({
      messageId: messageId,
      messageText: messageText,
    });
  };

  return (
    <>
      <div className={classNames(styles.chat)}>
        <div className={styles.header}>
          <h5 className={classNames(styles.header_wish_title, "page-text")}>
            {chatItem.title}
          </h5>
          <IconButton
          bg="transparent"
            aria-label="Close chat"
            icon={<CloseIcon />}
            boxSize={5}
            onClick={handleClose}
          />
        </div>
        <div
          ref={chatMessagesContainerRef}
          className={styles.messages_container}
        >
          {chatMessages && !isLoading && user ? (
            chatMessages.messages.map((item) => {
              return (
                <Message
                  key={item.id}
                  id={item.id}
                  chatId={chatItem.id}
                  text={item.text}
                  timestamp={item.timestamp}
                  replyId={item.reply_to ? item.reply_to : undefined}
                  className={classNames(
                    styles.message,
                    { [styles.self_message]: item.user === user.id },
                    { [styles.recived_message]: item.user !== user.id }
                  )}
                  onClick={handleMessageClick}
                />
              );
            })
          ) : (
            <Flex align="center" justifyContent="center" padding={50} w="100%" h="100%">
              <Spinner />
            </Flex>
          )}
        </div>
        <div className={styles.chat_input_field}>
          {currentMessageReplyTo && (
            <div className={styles.chat_input_field_reply}>
              <p className={styles.chat_input_field_reply_text}>
                {currentMessageReplyTo.messageText}
              </p>
              <IconButton
              bg="transparent"
                aria-label="Close reply message"
                icon={<CloseIcon w="100%" h="100%"/>}
                boxSize={3}
                onClick={() => {
                  setCurrentMessageReplyTo(undefined);
                }}
              />
            </div>
          )}
          <div className={styles.chat_input_wrapper}>
            <div
              contentEditable
              className={classNames(
                styles.chat_input,
                "page-text",
                "page-reg-text"
              )}
              onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              ref={chatInputRef}
            ></div>
            <IconButton
            bg="transparent"
              aria-label="Send message"
              boxSize={5}
              icon={<Icon h="100%" w="100%" as={IoSend} />}
              onClick={() => {
                sendMessage();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
