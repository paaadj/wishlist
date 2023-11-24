import { Dispatch, SetStateAction, useContext, useState } from "react";
import { UserContext, UserContextType } from "../../../context/UserContext";
import "../user.css";
import ModalWindow from "../../ModalWindow/ModalWindow";

interface IWishlistCard {
  self: boolean;
  wishItemId: number;
  title: string;
  description: string;
  imgUrl: string;
  updateWishlistFunction: Dispatch<SetStateAction<boolean>>;
  setEditWishItem: (wishEditItemId: number) => void;
}

function WishlistCard(props: IWishlistCard) {
  const {
    self,
    wishItemId,
    title,
    description,
    imgUrl,
    updateWishlistFunction,
    setEditWishItem,
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

  return (
    <div className="wishlist-card-wrapper">
      <div className="wishlist-card-img-wrapper">
        <img
          src={
            imgUrl
              ? imgUrl
              : "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media"
          }
          alt="wishImg"
          className="wishlist-card-img"
        />
      </div>
      <div className="wishlist-card-data-wrapper">
        <h5 className="wishlist-card-title">{title}</h5>
        <p className="page-text page-reg-text wishlist-card-desc">
          {description}
        </p>
        {self && (<button onClick={deleteWishlistItem}>delete</button>)}
        {self && (<button onClick={handleEditButtonClick}>Edit</button>)}
        <button type="button" className="wishlist-card-button">
          Check
        </button>
      </div>
    </div>
  );
}

export default WishlistCard;
