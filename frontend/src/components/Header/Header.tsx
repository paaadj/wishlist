import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext, UserContextType } from "../../context/UserContext";
import "./header.css";
import useDebounceUserSearch from "../../hooks/useDebounceUserSearch";
import Notification from "./Notification";
import {
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { LuBell, LuBellDot } from "react-icons/lu";
import { IoExitSharp } from "react-icons/io5";
import { SearchIcon } from "@chakra-ui/icons";
import classNames from "classnames";
export type NotificationType = {
  id: number;
  read: boolean;
  type: string;
  data: { item_id: number };
  date: string;
};
export type ParsedNotificationType  = Omit<NotificationType, "data"> & {
  data: { text: string };
};
function Header() {
  const navigate = useNavigate();
  const { user, setAuthorizationTokens, requestProvider, getAccessCookie } =
    useContext(UserContext) as UserContextType;

  const [searchIsOpen, setSearchIsOpen] = useState<boolean>();
  const [searchUserValue, setSearchUserValue] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string | undefined>(
    user?.imgUrl
  );
  const debounceInput = useDebounceUserSearch(searchUserValue, user?.id, 200);

  const [notifications, setNotifications] = useState<ParsedNotificationType[] | []>(
    []
  );
  const [notificationsUnread, setNotificationsUnread] =
    useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  const hasUnreadNotification = (notifications: ParsedNotificationType[] | []) => {
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
      const urls: string[] = [];
      data.forEach((note: NotificationType) => {
        urls.push(`/backend/api/get_item?item_id=${note.data.item_id}`)
      });
      const noteTexts = await Promise.all(urls.map(async url => {
        const resp = await fetch(url);
        return resp.json();
      }));
      const parsedNotifications: ParsedNotificationType[] = [];
      data.forEach((item: NotificationType, index : number) => {
        parsedNotifications.push({...item, data:{text: noteTexts[index].title}})
      });
      setNotificationsUnread(hasUnreadNotification(parsedNotifications));
      setNotifications(parsedNotifications);
    } catch (err) {
      if (err instanceof Error) {
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
       await requestProvider(
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
      }
    }
  };
  useEffect(() => {
    setUserAvatar(
      user?.imgUrl + `&t=${new Date().getTime()}` ?? "/img/username.png"
    );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <header>
        <div className="header-container">
          <div className="page-text page-title-text logo">WISHLIST</div>

          <div
            className={classNames("search", "search-visability", {
              "search-isActive": searchIsOpen,
            })}
          >
            <InputGroup>
              <InputRightElement pointerEvents="none">
                <SearchIcon />
              </InputRightElement>
              <Input
                variant="outlined"
                focusBorderColor="lightblue"
                fontSize="1.1rem"
                className="page-text page-text-reg"
                type="text"
                placeholder="Search by username"
                _placeholder={{ opacity: 0.5, color: "gray.500" }}
                onChange={(e: any) => {
                  setSearchUserValue(e.target.value);
                }}
                onBlur={(e: any) => {
                  setSearchUserValue("");
                }}
                onFocus={(e: any) => {
                  setSearchUserValue(e.target.value);
                }}
              />
            </InputGroup>
            {debounceInput && (
              <VStack
                bg="white"
                className="page-text page-text-reg"
                position="absolute"
                top="90%"
                w="100%"
                maxHeight="20vh"
                minHeight="20vh"
                alignItems="center"
                overscroll="auto"
                borderBottomRadius="5px"
                overflowY="auto"
                divider={<StackDivider borderColor="gray.300" />}
              >
                {debounceInput.length > 0 ? (
                  debounceInput.map((item, index) => {
                    return (
                      <Link
                        className="search-result-link"
                        key={index}
                        to={"/user/" + item.username}
                      >
                        {" " + item.username + " "}
                      </Link>
                    );
                  })
                ) : (
                  <p >No results</p>
                )}
              </VStack>
            )}
          </div>

          <div className="header__control">
            {user ? (
              <>
                <div className="profile">
                  <IconButton
                    aria-label="Seach user"
                    isRound={true}
                    _hover={{ background: "transparent" }}
                    boxSize={5}
                    bg="transparent"
                    icon={<SearchIcon w="100%" h="100%" />}
                    className="search-buttom-visability"
                    onClick={() => {
                      setSearchIsOpen((prev) => !prev);
                    }}
                  />
                  <Popover isLazy placement="auto-start">
                    <PopoverTrigger>
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
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader><Heading as="h5" size="sm">Notifications</Heading></PopoverHeader>
                      <PopoverBody>
                        <Flex align="flex-start" justify="center" direction="column">
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
                            <p className="page-text page-reg-text">
                              No results
                            </p>
                          )}
                        </Flex>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>

                  <Image
                    alt="profile"
                    src={userAvatar}
                    boxSize="40px"
                    objectFit="cover"
                    borderRadius="full"
                    cursor="pointer"
                    onClick={() => navigate("/user/me")}
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
