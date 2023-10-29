import { useContext, useEffect } from "react";
import { UserContext, UserContextType } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

function User() {
  const navigate = useNavigate();

  const {getAccessCookie, setAuthorizationTokens, isAuthenticated} = useContext(UserContext) as UserContextType;

  useEffect(()=> {
    
    console.log(getAccessCookie());
  },[])

  return (
          <>
            <h1>Nice auth, {isAuthenticated ? "Auth" : "NoAuth"}</h1>
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
