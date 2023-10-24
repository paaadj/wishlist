import { Link } from "react-router-dom";
import MainPageCard from "./MainPageCard/MainPageCard";
import "./mainPage.css";
import "./mainPage-1920.css";
import "./mainPage-810-1919.css";
import "./mainPage-phone.css";
import { useEffect, useState } from "react";

function MainPage() {
  const [userScreenWidth, setГserScreenWidth] = useState(0);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setГserScreenWidth(window.innerWidth);
    });
  }, []);
  return (
    <>
      <main className="main-container">
        <div className="title-content blue-color">
          <div className="title-text-controlls">
            <h1 className="title__text">Unleash Your Wishlist</h1>
            <div className="title-controlls">
              <Link
                to="/login"
                className="title__button white-color white-button-text"
              >
                Login
              </Link>
              <Link
                to="#"
                className="title__button white-color white-button-text"
              >
                Create Wishlist
              </Link>
              <Link
                to="#"
                className="title__button grey-color grey-button-text"
              >
                Browse Items
              </Link>
            </div>
          </div>
          <div className="title-imgs">
            <div className="title-img-wrapper m1-img">
              {/* <img src="/img/bag.jpeg" alt="temp" className="title__img" /> */}
            </div>
            <div className="title-img-wrapper m2-img">
              {/* <img src="/img/" alt="temp" className="title__img" /> */}
            </div>
            <div className="title-img-wrapper l1-img">
              {/* <img src="/img/suvenir.jpg    " alt="temp" className="title__img" /> */}
            </div>
          </div>
        </div>

        <div className="content-block white-color">
          <div className="paragraph">
            <h2 className="paragraph__title">The Ultimate Wish Machine</h2>
            <div className="paragraph__desc">
              <p className="paragraph-text-block">
                Welcome to the future of gift-giving, where creating, managing,
                and sharing wishlists is just a few clicks away. Our
                user-friendly platform helps you effectively communicate your
                desires to those who matter the most.
              </p>
              <p className="paragraph-text-block">
                No more hint-dropping or passive-aggressive suggestions; just
                simple, seamless, and efficient wishlist management for every
                occasion.
              </p>
              <p className="paragraph-text-block">
                Whether it’s your birthday, anniversary or just because, you can
                count on our Wishlist feature to make every celebration
                unforgettable.
              </p>
            </div>
          </div>
        </div>

        <div className="content-block grey-color">
          <div className="cards-container">
            <MainPageCard>
              {userScreenWidth <= 809 ? (
                <div className="card-img-wrapper">
                  <img
                    src="/img/bag.jpeg"
                    alt="Temp"
                    className="card-img first-card-img"
                  />
                </div>
              ) : (
                <></>
              )}
              <div className="card-content">
                <h3 className="card-title">
                  Add, Manage, and Share Your Desired Items with Ease
                </h3>
                <p className="card-desc">
                  Our platform offers easy addition and management of your
                  wishlist items. Just click on 'add item' and you're set!
                </p>
              </div>
              {userScreenWidth > 809 ? (
                <div className="card-img-wrapper">
                  <img
                    src="/img/bag.jpeg"
                    alt="Temp"
                    className="card-img first-card-img"
                  />
                </div>
              ) : (
                <></>
              )}
            </MainPageCard>
            <MainPageCard>
              <div className="card-img-wrapper">
                <img
                  src="/img/bag.jpeg"
                  alt="Temp"
                  className="card-img second-card-img"
                />
              </div>
              <div className="card-content">
                <h3 className="card-title">
                  One Wishlist, Endless Possibilities
                </h3>
                <p className="card-desc">
                  Invite your friends and family to view your wishlist, ensuring
                  everyone is always up to date with your latest desires.
                </p>
              </div>
            </MainPageCard>
          </div>
        </div>

        <div className="content-block grey-color">
          <div className="get-started">
            <h2 className="get-started__title">Get Started</h2>
            <p className="get_started__desc">
              Ready to create your masterpiece of wishes? Sign up today and
              transform the way you receive gifts, forever.
            </p>
            <div className="get_started__controlls">
              <Link
                to="/registration"
                className="get-started__button white-color white-button-text"
              >
                Sign Up Now
              </Link>
              <Link
                to="#"
                className="get-started__button black-color black-button-text"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default MainPage;
