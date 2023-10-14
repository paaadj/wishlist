import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext, UserContextType } from "../../context/UserContext";

function Header() {
  const { isAuthenticated } = useContext(UserContext) as UserContextType;
  return (
    <>
      <Link to="/">Main</Link>
      <Link to="/login">Login</Link>
      <Link to="/registration">Registration</Link>
      {isAuthenticated ? (
        <Link to="/user">{isAuthenticated.username}</Link>
      ) : (
        <></>
      )}
    </>
  );
}

export default Header;
