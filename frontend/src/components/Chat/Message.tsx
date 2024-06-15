import React from "react";
import styles from "./chat.module.css";
import classNames from "classnames";
import IconButton from "../IconButton/IconButton";

interface IMessage {
  id: number;
  chatId: number;
  text: string;
  timestamp: string;
  className: string;
  replyId: number | undefined;
  onClick: (messageId: number, messageText: string) => void;
}

function Message(props: IMessage) {
  const { id, chatId, text, timestamp, className, replyId, onClick } = props;
  const [showReplyButton, setShowReplyButton] = React.useState<boolean>(false);
  const [replyMessageText, setReplyMessageText] = React.useState<
    string | undefined
  >();
  const timestamp_adjustment = (inputDate: string): string => {
    // Разбиваем строку на компоненты
    const [datePart, timePart] = inputDate.split(" ");

    // Переводим дату в объект Date
    const dateObject = new Date(datePart);

    // Получаем компоненты времени
    const [hours, minutes, secondsWithTimeZone] = timePart.split(":");
    const seconds = Math.floor(parseFloat(secondsWithTimeZone.split("+")[0])); // Округляем секунды вниз

    // Получаем смещение временной зоны
    const timezoneOffset = parseInt(secondsWithTimeZone.split("+")[1], 10);

    // Применяем смещение временной зоны
    dateObject.setMinutes(dateObject.getMinutes() - timezoneOffset);

    // Форматируем дату в нужный вид
    const formattedHours = hours.padStart(2,  "0");
    const formattedMinutes = minutes.padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    const resultDate =
      `${dateObject.getDate()}.${
        dateObject.getMonth() + 1
      }.${dateObject.getFullYear()}/` +
      `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    return resultDate;
  };
  React.useEffect(() => {
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const fetchReplyMessage = async () => {
      const response = await fetch(
        `/backend/api/chats/${chatId}/${replyId}`,
        requestParams
      );
      if (response.ok) {
        const replyMessageData = await response.json();
        setReplyMessageText(replyMessageData.text);
      }
    };
    if (replyId) {
      fetchReplyMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleMessageClick = () => {
    onClick(id, text);
  };
  const [adjastedDate, adjastedTime] = timestamp_adjustment(timestamp).split("/");
  return (
    <>
      <div
        className={className}
        onMouseEnter={() => {
          setShowReplyButton(true);
        }}
        onMouseLeave={() => {
          setShowReplyButton(false);
        }}
      >
        <IconButton
          className={classNames(
            styles.reply_button,
            { [styles.active]: showReplyButton },
            { [styles.within_reply]: replyId !== undefined },
            { [styles.without_reply]: replyId === undefined }
          )}
          size={20}
          iconSrc="/img/reply.png"
          onClick={handleMessageClick}
        />

        {replyId && (
          <div
            className={classNames(
              "page-text page-reg-text",
              styles.message_reply
            )}
          >
            <span>Reply to:</span>
            <p>{replyMessageText}</p>
          </div>
        )}
        <p
          className={classNames("page-text page-reg-text", styles.message_text)}
        >
          {text}
        </p>
        <p className={styles.message_timestamp}>{adjastedDate + " || " + adjastedTime}</p>
      </div>
    </>
  );
}

export default Message;