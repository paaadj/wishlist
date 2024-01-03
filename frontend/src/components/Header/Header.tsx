import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext, UserContextType } from "../../context/UserContext";
import "./header.css";
import useDebounce from "../../hooks/useDebounce";
import useDebounceUserSearch from "../../hooks/useDebounceUserSearch";
import UserInput from "../UserInput/UserInput";
import IconButton from "../IconButton/IconButton";

type Notification = {
  id: number,
  read: boolean,
  type: string,
  data: object,
  date: string
};


function Header() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { user, setAuthorizationTokens } = useContext(
    UserContext
  ) as UserContextType;
  const [searchUserValue, setSearchUserValue] = useState<string>("");
  const debounceInput = useDebounceUserSearch(searchUserValue, user?.id, 200);


  const [notifications, setNotifications] = useState<Notification[] | undefined>(undefined);

  
  return (
    <>
      <header>
        <div className="header-container">
          <div className="page-text page-title-text logo">WISHLIST</div>
          <div className="search">
            <UserInput
              id="searchInput"
              name="searchInput"
              className="user-input header-search-input"
              type="text"
              onChange={(e: any) => {
                setSearchUserValue(e.target.value);
              }}
              onBlur={(e: any) => {
                setSearchUserValue("");
              }}
              onFocus={(e: any) => {
                setSearchUserValue(e.target.value);
              }}
              placeholder="Search user..."
              imgSource="/img/search-lens.png"
              fieldClassName="header-search-input-field"
            />
            {debounceInput && (
              <div className="search-result-block">
                {debounceInput.length > 0 ? debounceInput.map((item, index) => {
                  return (
                    <Link className="search-result-link page-text page-reg-text" key={index} to={"/user/" + item.username}>
                      {" " + item.username + " "}
                    </Link>
                  );
                }) : <p className="search-result-link page-text page-reg-text">No results</p>}
              </div>
            )}
          </div>
          <div className="header__control">
            {user ? (
              <>
                <div className="profile">
                  <IconButton iconSrc="/img/bell.png" size={24}/>
                  <img
                    alt="profile"
                    src={user.imgUrl}
                    className="profile__img"
                  />
                  <Link
                    className="page-text page-reg-text profile__link"
                    to="/user/me"
                  >
                    {user.username}
                  </Link>
                  <button
                    className="profile-logout-button"
                    onClick={() => {
                      setAuthorizationTokens(undefined, undefined);
                      navigate("/");
                    }}
                  >
                    <img
                      alt="logout"
                      src="/img/logout.png"
                      className="profile-logout-img"
                    />
                  </button>
                </div>
              </>
            ) : (
              <div className="profile">
                <Link
                  className="page-text page-reg-text profile-login"
                  to="/authentication/login"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
