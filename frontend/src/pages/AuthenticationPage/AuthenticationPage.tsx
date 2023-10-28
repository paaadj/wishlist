import { Navigate, Outlet, useOutlet } from "react-router-dom";
import "./authenticationPage.css";
function AuthenticationPage() {
  const outlet = useOutlet();
  return (
    <div className="auth-wrapper">
      <img src="/img/auth_bg.jpg" alt="BG" className="auth-background" />
      <div className="auth-window">
        <div className="welcome-side">
          <div className="welcome-side__logo page-text page-title-text">
            WISHLIST
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
              <img src="/img/github.png" alt="media" className="welcome-side__media" />
            </button>
            <button type="button" className="welcome-side__media-wrapper">
              <img src="/img/vk.png" alt="media" className="welcome-side__media" />
            </button>
            <button type="button" className="welcome-side__media-wrapper">
              <img src="/img/ok.png" alt="media" className="welcome-side__media" />
            </button>
            <button type="button" className="welcome-side__media-wrapper">
              <img src="/img/telegram.png" alt="media" className="welcome-side__media" />
            </button>
          </nav>
        </div>
        {outlet ? <Outlet /> : <Navigate to="/" />}
      </div>
    </div>
  );
}

export default AuthenticationPage;
