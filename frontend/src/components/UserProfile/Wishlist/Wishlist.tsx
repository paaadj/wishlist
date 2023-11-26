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
import EditWishItemForm from "./EditWishItemForm";

interface IWishlist {
  self: boolean;
  curUser: userData;
}

type WishItem = {
  id: number;
  title: string;
  description: string;
  link: string;
  image_url: string;
  reserved_user?: userData;
};

function Wishlist(props: IWishlist) {
  const { self, curUser } = props;
  const { user, getAccessCookie } = useContext(UserContext) as UserContextType;
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
          curUser.username
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

  useEffect(()=>{
    setWishlist(undefined);
    setUpdateWishlist((prevState)=>!prevState)
  }, [curUser])

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

  const handleReserveItem = async (itemId: number) => {
    const requestParams = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      `/backend/api/reserve?item_id=${itemId}`,
      requestParams
    );
    if (response.ok) {
      console.log("Reservation successful");
      if (wishlist) {
        let updatedWishList = wishlist.map((item) => {
          if (item.id === itemId) {
            return { ...item, reserved_user: user };
          } else {
            return item;
          }
        });
        setWishlist(updatedWishList);
      }
    }
  };

  const handleUnreserveItem = async (itemId: number) => {
    const requestParams = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      `/backend/api/unreserve?item_id=${itemId}`,
      requestParams
    );
    if (response.ok) {
      console.log("Unreservation successful");
      if (wishlist) {
        let updatedWishList = wishlist.map((item) => {
          if (item.id === itemId) {
            return { ...item, reserved_user: undefined };
          } else {
            return item;
          }
        });
        setWishlist(updatedWishList);
      }
    }
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
                  authUserId={user?.id}
                  key={item.id}
                  wishItemId={item.id}
                  title={item.title}
                  description={item.description}
                  imgUrl={item.image_url}
                  reservedUser={item.reserved_user}
                  updateWishlistFunction={setUpdateWishlist}
                  setEditWishItem={handleSetEditItem}
                  handleReserveItem={handleReserveItem}
                  handleUnreserveItem={handleUnreserveItem}
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
