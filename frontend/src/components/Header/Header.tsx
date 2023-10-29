import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext, UserContextType } from "../../context/UserContext";
import "./header.css";

function Header() {
  const { isAuthenticated } = useContext(UserContext) as UserContextType;
  return (
    <>
      <header>
        <div className="header-container">
          <div className="logo">WISHLIST</div>
          <div className="links">
            <Link to="/">Main</Link>
            <Link to="/login">Login</Link>
            <Link to="/registration">Registration</Link>
          </div>
          {isAuthenticated ? (
            <div className="profile">
              <Link to="/user">{isAuthenticated.toString()}</Link>
            </div>
          ) : (
            <div className="login-button"></div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
