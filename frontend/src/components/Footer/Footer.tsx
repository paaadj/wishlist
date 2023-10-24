import "./footer-1920.css";
import "./footer-810-1919.css";
import "./footer-phone.css";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer grey-color">
      <div className="footer-wrap">
        <div className="footer-links">
          <div className="footer-links-column">
            <h5 className="footer-link-column-title">Support</h5>
            <Link to="#" className="footer-link-column-link">
              FAQs
            </Link>
            <Link to="#" className="footer-link-column-link">
              Contact
            </Link>
            <Link to="#" className="footer-link-column-link">
              Tutorial
            </Link>
          </div>
          <div className="footer-links-column">
            <h5 className="footer-link-column-title">Legal</h5>
            <Link to="#" className="footer-link-column-link">
              Privacy
            </Link>
            <Link to="#" className="footer-link-column-link">
              Terms
            </Link>
            <Link to="#" className="footer-link-column-link">
              DMCA
            </Link>
          </div>
          <div className="footer-links-column">
            <h5 className="footer-link-column-title">Social</h5>
            <Link to="#" className="footer-link-column-link">
              Odnoklasniki
            </Link>
            <Link to="#" className="footer-link-column-link">
              Telegram
            </Link>
            <Link to="#" className="footer-link-column-link">
              VK
            </Link>
          </div>
        </div>
        <div className="footer-media">
          <div className="footer-media-icons">
            <button type="button" className="footer__icon-wrapper">
              <img
                src="/img/telegram.png"
                alt="media"
                className="footer__icon"
              />
            </button>
            <button type="button" className="footer__icon-wrapper">
              <img src="/img/vk.png" alt="media" className="footer__icon" />
            </button>
            <button type="button" className="footer__icon-wrapper">
              <img src="/img/ok.png" alt="media" className="footer__icon" />
            </button>
            <button type="button" className="footer__icon-wrapper">
              <img src="/img/github.png" alt="media" className="footer__icon" />
            </button>
          </div>
          <p className="footer-rights">© 2023 All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
