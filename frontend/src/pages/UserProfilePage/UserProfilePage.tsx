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
        imgUrl: data?.image_url,
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
      <Header />
      {currentUser ? <User self={self} user={currentUser} /> : <h1>Loading</h1>}
      {currentUser ? (
        <Wishlist self={self} curUser={currentUser} />
      ) : (
        <h1>Loading</h1>
      )}
    </>
  );
}

export default UserProfilePage;
