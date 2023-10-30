import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

type userData = {
  firstName: string,
  lastName?: string,
  username: string,
  email: string
};

function User() {
  const navigate = useNavigate();

  const { user, setAuthorizationTokens, isAuthenticated } =
    useContext(UserContext) as UserContextType;
  
  useEffect(() => {
    console.log(user);
  }, []);

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
