import { useContext, useEffect, useState } from "react";
import "./wishlist.css";
import WishlistCard from "./WishlistCard";
import {
  UserContext,
  UserContextType,
  userData,
} from "../../../context/UserContext";
import ModalWindow from "../../ModalWindow/ModalWindow";
import AddWishItemForm from "./AddWishItemForm";

interface IWishlist {
  user: userData;
}

type WishItem = {
  id: number,
  title: string,
  description: string,
  link: string,
  image_url: string
}

const mocklist = [
  {
    id: 0,
    title: "first",
    description: "kekadsfasdfasdf asfd adsf asdffdsaf a df asdf asdf asdf",
    link: "https://example.com/",
    image_url:
      "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media",
  },
  {
    id: 1,
    title: "second",
    description: "kekadsfasdfasdf asfd adsf asdffdsaf a df asdf asdf asdf",
    link: "https://example.com/",
    image_url:
      "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media",
  },
  {
    id: 2,
    title: "third",
    description: "kekadsfasdfasdf asfd adsf asdffdsaf a df asdf asdf asdf",
    link: "https://example.com/",
    image_url:
      "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media",
  },
  {
    id: 3,
    title: "forth",
    description: "kekadsfasdfasdf asfd adsf asdffdsaf a df asdf asdf asdf",
    link: "https://example.com/",
    image_url:
      "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media",
  },
  {
    id: 4,
    title: "fifth",
    description: "kekadsfasdfasdf asfd adsf asdffdsaf a df asdf asdf asdf",
    link: "https://example.com/",
    image_url:
      "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media",
  },
  {
    id: 5,
    title: "sixth",
    description: "kekadsfasdfasdf asfd adsf asdffdsaf a df asdf asdf asdf",
    link: "https://example.com/",
    image_url:
      "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media",
  },
  {
    id: 6,
    title: "seventh",
    description: "kekadsfasdfasdf asfd adsf asdffdsaf a df asdf asdf asdf",
    link: "https://example.com/",
    image_url:
      "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media",
  },
];

function Wishlist(props: IWishlist) {
  const { user } = props;
  const [wishlist, setWishlist] = useState<WishItem[] | undefined>(undefined);
  const [updateWishlist, setUpdateWishlist] = useState<boolean>(false);
  const [activeModalAdd, setActiveModalAdd] = useState(false);
  const [needNotification, setNeedNotification] = useState(false);

  
  useEffect(() => {
    const fetchWishlist = async () => {
      const requestParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(
        `/backend/api/get_wishlist?page=${1}&per_page=${10}&username=${
          user.username
        }`,
        requestParams
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data.items);
        setWishlist(data.items);
      } else {
        setWishlist(undefined);
      }
    };
    fetchWishlist();
  }, [updateWishlist]);

  return (
    <>
      <div className="wishlist-wrapper">
        <div className="wishlist-header-wrapper">
          <h3 className="page-text page-title-text wishlist-title">Wishlist</h3>
          <button
            type="button"
            onClick={() => {
              setActiveModalAdd(true);
            }}
            className="wishlist-add-button"
          >
            <img
              src="/img/plus.png"
              alt="media"
              className="wishlist-add-button__media"
            />
          </button>
        </div>

        <ModalWindow active={activeModalAdd} setActive={setActiveModalAdd}>
          <AddWishItemForm updateWishlistFunction={setUpdateWishlist}/>
        </ModalWindow>
        <section className="wishlist">
          {wishlist ? (wishlist.map((item) => {
            return (
              <WishlistCard
                key={item.id}
                wishItemId={item.id}
                title={item.title}
                description={item.description}
                imgUrl={item.image_url}
                updateWishlistFunction={setUpdateWishlist}
              />
            );
          })) : (<h3>Loading</h3>)}
        </section>
      </div>
    </>
  );
}

export default Wishlist;
