import User from "../../components/UserProfile/User";
import Wishlist from "../../components/UserProfile/Wishlist/Wishlist";
import { useContext, useEffect, useState } from "react";
import {
  UserContext,
  UserContextType,
  userData,
} from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import styles from "./userProfilePage.module.css";
import { Flex, Spinner } from "@chakra-ui/react";
interface IUserProfilePage {
  self: boolean;
}

function UserProfilePage(props: IUserProfilePage) {
  const navigate = useNavigate();
  const { username } = useParams();
  const { self } = props;
  const { user } = useContext(UserContext) as UserContextType;
  const [currentUser, setCurrentUser] = useState<userData | undefined>(
    undefined
  );
  const baseImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/";
  const fixImageUrl = (url: string | undefined) => {
    return url ? url.replace("/", "%2F") : url;
  };
  const fetchAnotherUser = async () => {
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      `/backend/users?username=${username}`,
      requestParams
    );
    if (response.ok) {
      const data = await response.json();
      setCurrentUser({
        id: data.id,
        firstName: data.first_name,
        lastName: data?.last_name ?? "",
        username: data.username,
        email: data.email,
        imgUrl:
          baseImageUrl +
          (data.image
            ? fixImageUrl(data.image_url)
            : "mqdefault.jpeg") +
          "?alt=media",
      });
    } else {
      setCurrentUser(undefined);
      navigate("/");
    }
  };
  useEffect(() => {
    if (user && !self && user.username === username) {
      navigate("/user/me");
    } else {
      if (self) {
        setCurrentUser(user);
      } else {
        fetchAnotherUser();
      }
    }
  }, [self, user, username]);
  return (
    <>
      <div className={styles.container}>
        <Header />
        {currentUser ? (
          <User self={self} user={currentUser} />
        ) : (
          <Flex align="center" justifyContent="center" padding={50}>
            <Spinner />
          </Flex>
        )}
        {currentUser ? (
          <Wishlist self={self} curUser={currentUser} />
        ) : (
          <Flex align="center" justifyContent="center" padding={50}>
            <Spinner />
          </Flex>
        )}
      </div>
    </>
  );
}

export default UserProfilePage;
