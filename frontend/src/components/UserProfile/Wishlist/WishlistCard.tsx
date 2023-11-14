import { Dispatch, SetStateAction, useContext } from "react";
import { UserContext, UserContextType } from "../../../context/UserContext";
import "../user.css";

interface IWishlistCard {
  wishItemId: number;
  title: string;
  description: string;
  imgUrl: string;
  updateWishlistFunction: Dispatch<SetStateAction<boolean>>;
}

function WishlistCard(props: IWishlistCard) {
  const { wishItemId, title, description, imgUrl, updateWishlistFunction } = props;
  const { getAccessCookie } = useContext(UserContext) as UserContextType;

  const deleteWishlistItem = async() => {
    const requestParams = {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
    };
    const response = await fetch(`/backend/api/delete/${wishItemId}`, requestParams);
    if(response.ok){
      console.log("delete succsess");
      updateWishlistFunction(prevState => !prevState);
    }
  }


  return (
    <div className="wishlist-card-wrapper">
      <div className="wishlist-card-img-wrapper">
        <img src={imgUrl} alt="wishImg" className="wishlist-card-img" />
      </div>
      <div className="wishlist-card-data-wrapper">
        <h5 className="wishlist-card-title">{title}</h5>
        <p className="page-text page-reg-text wishlist-card-desc">{description}</p>
        <button onClick={deleteWishlistItem}>delete</button>
        <button type="button" className="wishlist-card-button">Check</button>
      </div>
      
    </div>
  );
}

export default WishlistCard;
