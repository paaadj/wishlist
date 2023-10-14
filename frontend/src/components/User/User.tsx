import { useContext } from "react";
import { UserContext, UserContextType } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

function User() {
  const {setAuthorizationTokens, isAuthenticated} = useContext(UserContext) as UserContextType;
  const navigate = useNavigate();

  return (
          <>
            <h1>Nice auth, {isAuthenticated ? isAuthenticated.username : "bro"}</h1>
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
