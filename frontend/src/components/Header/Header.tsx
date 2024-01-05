import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext, UserContextType } from "../../context/UserContext";
import "./header.css";
import useDebounce from "../../hooks/useDebounce";
import useDebounceUserSearch from "../../hooks/useDebounceUserSearch";
import UserInput from "../UserInput/UserInput";
// import IconButton from "../IconButton/IconButton";
import Notification from "./Notification";
import { Icon, IconButton } from "@chakra-ui/react";
import { LuBell, LuBellDot } from "react-icons/lu";
import { IoExitSharp } from "react-icons/io5";
export type NotificationType = {
  id: number;
  read: boolean;
  type: string;
  data: { text: string };
  date: string;
};

function Header() {
  const navigate = useNavigate();
  const { user, setAuthorizationTokens, requestProvider, getAccessCookie } =
    useContext(UserContext) as UserContextType;
  const [searchUserValue, setSearchUserValue] = useState<string>("");
  const debounceInput = useDebounceUserSearch(searchUserValue, user?.id, 200);

  const [notifications, setNotifications] = useState<NotificationType[] | []>(
    []
  );
  const [notificationIsActive, setNotificationIsActive] =
    useState<boolean>(false);
  const [notificationsUnread, setNotificationsUnread] =
    useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  const hasUnreadNotification = (notifications: NotificationType[] | []) => {
    return notifications.some((item) => !item.read);
  };

  const fetchNotifications = async () => {
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAccessCookie(),
      },
    };
    try {
      const response = await requestProvider(
        fetch,
        "/backend/my_notifications",
        requestParams
      );
      const data = await response.json();
      console.log(user?.username + "::::" + data);
      setNotificationsUnread(hasUnreadNotification(data));
      setNotifications(data);
      // setNotifications(data);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };
  const readNotification = async (id: number) => {
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAccessCookie(),
      },
    };
    try {
      const response = await requestProvider(
        fetch,
        `/backend/my_notifications/${id}/read`,
        requestParams
      );
      const readIndex = notifications.findIndex((item) => item.id === id);
      if (readIndex !== -1) {
        notifications[readIndex].read = true;
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
    //
  };
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (user) {
      fetchNotifications();
      intervalRef.current = window.setInterval(() => {
        fetchNotifications();
      }, 120000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user]);

  return (
    <>
      <header>
        <div className="header-container">
          <div className="page-text page-title-text logo">WISHLIST</div>
          <div className="search">
            <UserInput
              id="searchInput"
              name="searchInput"
              className="user-input header-search-input"
              type="text"
              onChange={(e: any) => {
                setSearchUserValue(e.target.value);
              }}
              onBlur={(e: any) => {
                setSearchUserValue("");
              }}
              onFocus={(e: any) => {
                setSearchUserValue(e.target.value);
              }}
              placeholder="Search user..."
              imgSource="/img/search-lens.png"
              fieldClassName="header-search-input-field"
            />
            {debounceInput && (
              <div className="search-result-block">
                {debounceInput.length > 0 ? (
                  debounceInput.map((item, index) => {
                    return (
                      <Link
                        className="search-result-link page-text page-reg-text"
                        key={index}
                        to={"/user/" + item.username}
                      >
                        {" " + item.username + " "}
                      </Link>
                    );
                  })
                ) : (
                  <p className="search-result-link page-text page-reg-text">
                    No results
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="header__control">
            {user ? (
              <>
                <div className="profile">
                  <IconButton
                    aria-label="Notifications"
                    isRound={true}
                    _hover={{ background: "transparent" }}
                    icon={
                      notificationsUnread ? (
                        <Icon as={LuBellDot} w="100%" h="100%" />
                      ) : (
                        <Icon as={LuBell} w="100%" h="100%" />
                      )
                    }
                    boxSize={6}
                    bg="transparent"
                    onClick={() => {
                      setNotificationIsActive(
                        (prevNotificationIsActive) => !prevNotificationIsActive
                      );
                    }}
                  />
                  {notificationIsActive ? (
                    <div className="notification-block">
                      {notifications.length > 0 ? (
                        notifications.map((item, index) => {
                          return (
                            <Notification
                              key={item.id}
                              notification={item}
                              readNotification={readNotification}
                            />
                          );
                        })
                      ) : (
                        <p className="search-result-link page-text page-reg-text">
                          No results
                        </p>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                  <img
                    alt="profile"
                    src={user.imgUrl}
                    className="profile__img"
                  />
                  <Link
                    className="page-text page-reg-text profile__link"
                    to="/user/me"
                  >
                    {user.username}
                  </Link>
                  <IconButton
                    aria-label="Logout"
                    w={"24px"}
                    _hover={{ background: "transparent" }}
                    bg={"inherit"}
                    icon={<Icon as={IoExitSharp} boxSize={6} color={"black"} />}
                    onClick={() => {
                      setAuthorizationTokens(undefined, undefined);
                      navigate("/");
                    }}
                  />
                  
                </div>
              </>
            ) : (
              <div className="profile">
                <Link
                  className="page-text page-reg-text profile-login"
                  to="/authentication/login"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
