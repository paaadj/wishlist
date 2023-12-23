import { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  UserContext,
  UserContextType,
  userData,
} from "../../../context/UserContext";
import "../user.css";
import styles from "./wishlistStyles.module.css";
import ModalWindow from "../../ModalWindow/ModalWindow";
import classNames from "classnames";
import IconButton from "../../IconButton/IconButton";

interface IWishlistCard {
  self: boolean;
  authUserId?: number;
  wishItemId: number;
  title: string;
  description: string;
  imgUrl: string;
  reservedUser?: number;
  updateWishlistFunction: Dispatch<SetStateAction<boolean>>;
  setEditWishItem: (wishEditItemId: number) => void;
  handleReserveItem: (itemId: number) => Promise<void>;
  handleUnreserveItem: (itemId: number) => Promise<void>;
  handleChatOpen: (chatItem: { id: number; title: string }) => void;
}

function WishlistCard(props: IWishlistCard) {
  const {
    self,
    authUserId,
    wishItemId,
    title,
    description,
    imgUrl,
    reservedUser,
    updateWishlistFunction,
    setEditWishItem,
    handleReserveItem,
    handleUnreserveItem,
    handleChatOpen,
  } = props;
  const { getAccessCookie } = useContext(UserContext) as UserContextType;
  const [popUp, setPopUp] = useState(false);
  const deleteWishlistItem = async () => {
    const requestParams = {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
    };
    const response = await fetch(
      `/backend/api/delete/${wishItemId}`,
      requestParams
    );
    if (response.ok) {
      console.log("delete succsess");
      updateWishlistFunction((prevState) => !prevState);
    }
  };

  const handleEditButtonClick = () => {
    setEditWishItem(wishItemId);
    setPopUp(false);
  };

  const handleReserveButtonClick = () => {
    handleReserveItem(wishItemId);
    setPopUp(false);
  };

  const handleUnreserveButtonClick = () => {
    handleUnreserveItem(wishItemId);
    setPopUp(false);
  };

  const handleOpenChatButtonClick = () => {
    handleChatOpen({ id: wishItemId, title: title });
    setPopUp(false);
  };

  return (
    <div
      className={classNames(styles.card_wrapper, {
        [styles.reserved_wish]: reservedUser === 1,
        [styles.self_reserved_wish]: reservedUser === 2,
      })}
    >
      <div className={styles.card_img_wrapper}>
        <img
          src={
            imgUrl
              ? imgUrl
              : "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media"
          }
          alt="wishImg"
          className={styles.card_img}
        />
      </div>
      <div className={styles.card_data_wrapper}>
        <header className={styles.card_data_header}>
          <h5 className={classNames(styles.card_title, "page-text")}>
            {title}
          </h5>
          <div className={styles.card_data_header_buttons}>
            {reservedUser == 2 && (<IconButton iconSrc="/img/cross.png" onClick={handleUnreserveButtonClick} size={24} />)}
            {!reservedUser && !self && (<IconButton iconSrc="/img/check.png" onClick={handleReserveButtonClick} size={24} />)}
            {self && (<IconButton
              iconSrc="/img/dots.png"
              onClick={() => {
                setPopUp((prev) => !prev);
              }}
              size={24}
            />)}
          </div>
        </header>
        <p
          className={classNames("page-text", "page-reg-text", styles.card_desc)}
        >
          {description}
        </p>
        <div
          className={classNames(styles.buttons_popup, {
            [styles.active_popup]: popUp,
          })}
        >
          <button
            type="button"
            className={styles.card_button}
            onClick={handleOpenChatButtonClick}
          >
            Open chat
          </button>
          {self && (
            <button
              type="button"
              className={styles.card_button}
              onClick={deleteWishlistItem}
            >
              delete
            </button>
          )}
          {self && (
            <button
              type="button"
              className={styles.card_button}
              onClick={handleEditButtonClick}
            >
              Edit
            </button>
          )}
          
          <button type="button" className={styles.card_button}>
            Check
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;
