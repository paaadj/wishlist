import "./header.css";
import { ParsedNotificationType } from "./Header";
interface INotification {
  notification: ParsedNotificationType;
  readNotification: (id: number) => Promise<void>;
}

function Notification(props: INotification) {
  const { id, read, type, data, date } = props.notification;
  const { readNotification } = props;
  const onHoverNotification = () => {
    if (read) {
      return;
    }
    readNotification(id);
  };
  return (
    <div className="notification" onMouseEnter={onHoverNotification}>
      {type === "reserve reminder" && (
        <p className="page-text page-reg-text notification__text">
          Reservation reminer for <span className="notification-reserve-item">{data.text}</span>
        </p>
      )}
      {!read && <div className="unreadNotification"></div>}
    </div>
  );
}

export default Notification;
