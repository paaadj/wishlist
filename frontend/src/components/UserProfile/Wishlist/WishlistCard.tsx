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
  };

  const handleReserveButtonClick = () => {
    handleReserveItem(wishItemId);
  };

  const handleUnreserveButtonClick = () => {
    handleUnreserveItem(wishItemId);
  };

  const handleOpenChatButtonClick = () => {
    handleChatOpen({ id: wishItemId, title: title });
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
        <h5 className={styles.card_title}>{title}</h5>
        {reservedUser && <p>Reserved</p>}
        <p
          className={classNames("page-text", "page-reg-text", styles.card_desc)}
        >
          {description}
        </p>
        <button onClick={handleOpenChatButtonClick}>Open chat</button>
        {self && <button onClick={deleteWishlistItem}>delete</button>}
        {self && <button onClick={handleEditButtonClick}>Edit</button>}
        {!reservedUser && !self && (
          <button onClick={handleReserveButtonClick}>Reserve</button>
        )}
        {reservedUser && authUserId && reservedUser === 2 && (
          <button onClick={handleUnreserveButtonClick}>Unreserve</button>
        )}
        <button type="button" className={styles.card_button}>
          Check
        </button>
      </div>
    </div>
  );
}

export default WishlistCard;
