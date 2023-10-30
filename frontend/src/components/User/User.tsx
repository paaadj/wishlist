import { useContext } from "react";
import { UserContext, UserContextType } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";


function User() {
  const navigate = useNavigate();

  const { user, setAuthorizationTokens, isAuthenticated } =
    useContext(UserContext) as UserContextType;
  
  return (
    <>
      <h1>Nice auth, {user ? user.username : "Loading"}</h1>
      <button
        onClick={() => {
          console.log(isAuthenticated);
          setAuthorizationTokens(undefined, undefined);
          navigate("/");
        }}
      >
        Logout
      </button>
    </>
  );
}

export default User;
