import "./header.css";
import { NotificationType } from "./Header";
interface INotification {
  notification: NotificationType;
  readNotification: (id: number) => Promise<void>;
}

function Notification(props: INotification) {
  const { id, read, type, data, date } = props.notification;
  const {readNotification} = props;
  const onHoverNotification = () => {
    if (read) {
      return;
    }
    readNotification(id);
  };
  return (
    <div className="notification" onMouseEnter={onHoverNotification}>
      <p className="page-text page-reg-text notification__text">{data.text}</p>
      {!read && <div className="unreadNotification"></div>}
    </div>
  );
}

export default Notification;
