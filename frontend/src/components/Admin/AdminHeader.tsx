import classNames from "classnames";
import styles from "./admin.module.css";
import React from "react";
import { IconButton } from "@chakra-ui/react";
import { ArrowForwardIcon, ArrowRightIcon, HamburgerIcon } from "@chakra-ui/icons";

interface IAdminHeader {
  toggleSideMenu: () => void;
}

function AdminHeader(props: IAdminHeader) {
  const { toggleSideMenu } = props;
  const [userScreenWidth, setUserScreenWidth] = React.useState(0);
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setUserScreenWidth(window.innerWidth);
    });
  }, []);
  return (
    <header className={classNames(styles.header)}>
      <div className={styles.header_side}>
        {userScreenWidth <= 809 && (

          <IconButton
            icon={<HamburgerIcon boxSize={6} color={"white"}/>}
            _hover={
              {background: "transparent"}
            }
            aria-label="Open side menu"
            w={"24px"}
            bg={"inherit"}
            onClick={toggleSideMenu}
          />
        )}
        <span
          className={classNames("page-text", "page-title-text", styles.logo)}
        >
          WISHLIST
        </span>
      </div>
      <div className={styles.header_side}>
        <img src="/img/username.png" alt="avatar" className={styles.avatar} />
        <p
          className={classNames("page-text", "page-reg-text", styles.username)}
        >
          mon Seigneur
        </p>
        <IconButton
        aria-label="Logout"
          w={"24px"}
          _hover={
            {background: "transparent"}
          }
          bg={"inherit"}
          icon={<ArrowRightIcon boxSize={4} color={"white"}/>}
        />
      </div>
    </header>
  );
}

export default AdminHeader;
