import User from "../../components/UserProfile/User";
import Wishlist from "../../components/UserProfile/Wishlist/Wishlist";
import { useContext } from "react";
import { UserContext, UserContextType } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";

function UserProfilePage() {
  const navigate = useNavigate();

  const { user, setAuthorizationTokens } = useContext(
    UserContext
  ) as UserContextType;
  return (
    <>
      <Header />
      {user ? <User user={user} /> : <h1>Loading</h1>}
      <button
        onClick={() => {
          setAuthorizationTokens(undefined, undefined);
          navigate("/");
        }}
      >
        Logout
      </button>
      {user ? <Wishlist user={user} /> : <h1>Loading</h1>}
      
    </>
  );
}

export default UserProfilePage;
