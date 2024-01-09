import { Navigate, Outlet, useNavigate, useOutlet } from "react-router-dom";
import "./authenticationPage.css";
import LoginForm from "../../components/Authentication/LoginForm";
import RegistrationForm from "../../components/Authentication/RegistrationForm";
interface IAuthenticationPage{
  login: boolean;
  registraion: boolean;
}
function AuthenticationPage(props: IAuthenticationPage) {
  const {login, registraion} = props;
  const navigate = useNavigate();

  const registerUser = async (
    firstName: string,
    username: string,
    email: string,
    password: string,
    lastName?: string
  ) => {
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
      }),
    };
    console.log(lastName);
    const response = await fetch("/backend/register", requestParams);
    // const data = await response.json();

    if (!response.ok) {
      console.log("DB error");
    } else {
      // setToken(data.access_token);

      console.log("Registration successful");
      navigate("/");
    }
  };

  return (
    <div className="auth-wrapper">
      {/* <img src="/img/auth_bg.jpg" alt="BG" className="auth-background" />
      <div className="auth-window">
        <div className="welcome-side">
          <div className="logo-wrapper">
            <button type="button" onClick={() => navigate("/")} className="welcome-side__media-wrapper">
              <img
                src="/img/go-back-arrow.png"
                alt="media"
                className="welcome-side__media"
              />
            </button>
            <div className="welcome-side__logo page-text page-title-text">
              WISHLIST
            </div>
          </div>
          <h2 className="welcome-side__title page-text page-title-text">
            Welcome to our Wishlist
          </h2>
          <p className="welcome-side__desc page-text page-reg-text">
            Nulla facilisi. In sollicitudin eu ante at pellentesque. Curabitur
            consectetur vel erat in malesuada. Pellentesque scelerisque mi quis
            nisi molestie porta. Donec a felis eu enim facilisis laoreet finibus
            sed velit.
          </p>
          <nav className="welcome-side__media-container">
            <button type="button" className="welcome-side__media-wrapper">
              <img
                src="/img/github.png"
                alt="media"
                className="welcome-side__media"
              />
            </button>
            <button type="button" className="welcome-side__media-wrapper">
              <img
                src="/img/vk.png"
                alt="media"
                className="welcome-side__media"
              />
            </button>
            <button type="button" className="welcome-side__media-wrapper">
              <img
                src="/img/ok.png"
                alt="media"
                className="welcome-side__media"
              />
            </button>
            <button type="button" className="welcome-side__media-wrapper">
              <img
                src="/img/telegram.png"
                alt="media"
                className="welcome-side__media"
              />
            </button>
          </nav>
        </div> */}
      {login && <LoginForm />}
      {registraion && <RegistrationForm registerUser={registerUser}/>}
      {/* </div> */}
    </div>
  );
}

export default AuthenticationPage;
