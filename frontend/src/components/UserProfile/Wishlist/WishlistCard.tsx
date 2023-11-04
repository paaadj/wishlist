import "../user.css";

interface IWishlistCard {
  title: string;
  description: string;
  imgUrl: string;
}

function WishlistCard(props: IWishlistCard) {
  const { title, description, imgUrl } = props;
  return (
    <div className="wishlist-card-wrapper">
      <div className="wishlist-card-img-wrapper">
        <img src={imgUrl} alt="wishImg" className="wishlist-card-img" />
      </div>
      <div className="wishlist-card-data-wrapper">
        <h5 className="wishlist-card-title">{title}</h5>
        <p className="page-text page-reg-text wishlist-card-desc">{description}</p>
        <button type="button" className="wishlist-card-button">Check</button>
      </div>
      
    </div>
  );
}

export default WishlistCard;
