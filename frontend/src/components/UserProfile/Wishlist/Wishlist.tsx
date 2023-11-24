import { useEffect, useState } from "react";
import "./wishlist.css";
import WishlistCard from "./WishlistCard";
import { userData } from "../../../context/UserContext";
import ModalWindow from "../../ModalWindow/ModalWindow";
import AddWishItemForm from "./AddWishItemForm";
import EditWishItemForm from "./EditWishItemForm";

interface IWishlist {
  self: boolean;
  user: userData;
}

type WishItem = {
  id: number;
  title: string;
  description: string;
  link: string;
  image_url: string;
};

function Wishlist(props: IWishlist) {
  const { self, user } = props;
  const [wishlist, setWishlist] = useState<WishItem[] | undefined>(undefined);
  const [updateWishlist, setUpdateWishlist] = useState<boolean>(false);
  const [activeModalAdd, setActiveModalAdd] = useState(false);
  const [wishItemEdit, setWishItemEdit] = useState<WishItem | undefined>(
    undefined
  );
  const [wishItemIsEdit, setWishItemIsEdit] = useState<boolean>(false);

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
        setWishlist(data.items);
      } else {
        setWishlist(undefined);
      }
    };
    fetchWishlist();
  }, [updateWishlist]);

  useEffect(() => {
    if (wishItemEdit) {
      setWishItemIsEdit(true);
    }
  }, [wishItemEdit]);

  const handleSetEditItem = (wishEditItemId: number) => {
    if (wishlist) {
      const wishItem = wishlist.find((item) => item.id === wishEditItemId);
      if (wishItem) {
        setWishItemEdit({
          id: wishItem.id,
          title: wishItem.title,
          description: wishItem.description,
          link: wishItem.link,
          image_url: wishItem.image_url,
        });
      }
    }
  };

  const handleEditWindowLeave = () => {
    setWishItemEdit(undefined);
  };
  return (
    <>
      <div className="wishlist-wrapper">
        <div className="wishlist-header-wrapper">
          <h3 className="page-text page-title-text wishlist-title">Wishlist</h3>
          {self && (
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
          )}
        </div>

        <ModalWindow active={activeModalAdd} setActive={setActiveModalAdd}>
          <AddWishItemForm updateWishlistFunction={setUpdateWishlist} />
        </ModalWindow>
        <ModalWindow
          active={wishItemIsEdit}
          setActive={setWishItemIsEdit}
          onLeaving={handleEditWindowLeave}
        >
          {wishItemIsEdit ? (
            <EditWishItemForm
              updateWishlistFunction={setUpdateWishlist}
              wishId={wishItemEdit?.id}
              prevWishName={wishItemEdit?.title}
              prevWishDesc={wishItemEdit?.description}
              prevWishImg={wishItemEdit?.image_url}
            />
          ) : (
            <h3>Loading</h3>
          )}
        </ModalWindow>
        <section className="wishlist">
          {wishlist ? (
            wishlist.map((item) => {
              return (
                <WishlistCard
                  self={self}
                  key={item.id}
                  wishItemId={item.id}
                  title={item.title}
                  description={item.description}
                  imgUrl={item.image_url}
                  updateWishlistFunction={setUpdateWishlist}
                  setEditWishItem={handleSetEditItem}
                />
              );
            })
          ) : (
            <h3>Loading</h3>
          )}
        </section>
      </div>
    </>
  );
}

export default Wishlist;
