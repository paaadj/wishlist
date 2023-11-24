import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext, UserContextType } from "../../context/UserContext";
import "./header.css";
import useDebounce from "../../hooks/useDebounce";
import useDebounceUserSearch from "../../hooks/useDebounceUserSearch";

function Header() {
  const navigate = useNavigate();
  const { user, setAuthorizationTokens } = useContext(
    UserContext
  ) as UserContextType;
  const [searchUserValue, setSearchUserValue] = useState<string>("");
  const debounceInput = useDebounceUserSearch(searchUserValue, user?.id, 500);
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
          {user ? (
            <>
              <div className="profile">
                <Link to="/user/me">{user.username}</Link>
              </div>
              <button
                onClick={() => {
                  setAuthorizationTokens(undefined, undefined);
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="login-button"></div>
          )}
          <input
            type="text"
            value={searchUserValue}
            onChange={(e) => {
              setSearchUserValue(e.target.value);
            }}
            placeholder="Search user..."
          />
          <button
            onClick={() => {
              console.log(user?.id);
              console.log(debounceInput);
            }}
          >
            dafasd
          </button>

          {debounceInput && debounceInput.length > 0 && (
            <div>
              {debounceInput.map((item, index) => {
                return <div key={index}>{item.username} </div>;
              })}
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
