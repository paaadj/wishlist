import { useContext, useEffect, useState } from "react";
import "./wishlist.css";
import WishlistCard from "./WishlistCard";
import { UserContext, UserContextType, userData } from "../../../context/UserContext";

interface IWishlist{
  user: userData;
};

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
  const {user} = props;
  const [wishlist, setWishlist] = useState([]);
  const { getAccessCookie } = useContext(
    UserContext
  ) as UserContextType;


  const addItemToWishlist = async () => {
    const formData = new FormData()
    formData.append("title", "testik")
    formData.append("description", "testikdesc")
    const requestParams = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
      body: formData,
    };
    const response = await fetch(`/backend/api/add_item`, requestParams);
    if(response.ok){
      console.log("Added item");
    }
    else{
      console.log("Don't added item");
    }
  } 

  const test = () => {
    console.log(wishlist);
  }

  useEffect(()=> {
    const fetchWishlist = async()=> {
      const requestParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(`/backend/api/get_wishlist?page=${1}&per_page=${3}&username=${user.username}`, requestParams);
      if(response.ok){
        const data = await response.json();
        setWishlist(data.items);
      }
      else{
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [])

  return (
    <>
      <div className="wishlist-wrapper">
        <h3 className="page-text page-title-text wishlist-title">Wishlist</h3>
        <button type="button" onClick={addItemToWishlist}>Add Item</button>

        <section className="wishlist">
          {mocklist.map((item) => {
            return (
              <WishlistCard
                key={item.id}
                title={item.title}
                description={item.description}
                imgUrl={item.image_url}
              />
            );
          })}
        </section>
      </div>
    </>
  );
}

export default Wishlist;
