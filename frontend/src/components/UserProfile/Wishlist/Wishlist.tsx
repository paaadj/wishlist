import { useCallback, useContext, useEffect, useState } from "react";
import styles from "./wishlistStyles.module.css";
import WishlistCard from "./WishlistCard";
import {
  UserContext,
  UserContextType,
  userData,
} from "../../../context/UserContext";
import ModalWindow from "../../ModalWindow/ModalWindow";
import AddWishItemForm from "./AddWishItemForm";
import EditWishItemForm from "./EditWishItemForm";
import Pagination from "../../Pagination/Pagination";
import classNames from 'classnames';
import Chat from "../../Chat/Chat";

interface IWishlistProps {
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

type WishList = {
  items: WishItem[];
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
};

const ROWS_PER_PAGE = 2;

function Wishlist(props: IWishlistProps) {
  const { self, curUser } = props;
  const { user, getAccessCookie } = useContext(UserContext) as UserContextType;
  const [wishlist, setWishlist] = useState<WishList | undefined>(undefined);
  const [updateWishlist, setUpdateWishlist] = useState<boolean>(false);
  const [activeModalAdd, setActiveModalAdd] = useState(false);
  const [wishItemEdit, setWishItemEdit] = useState<WishItem | undefined>(
    undefined
  );
  const [wishItemIsEdit, setWishItemIsEdit] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatItem, setChatItem] = useState<{id: number, title: string} | undefined>();

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestParams = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(
          `/backend/api/get_wishlist?page=${page}&per_page=${ROWS_PER_PAGE}&username=${curUser.username}`,
          requestParams
        );
        if (!response.ok) {
          throw new Error("Cannot fetch wishlist");
        }
        const data = await response.json();
        setWishlist(data);
      } catch (err) {
        setError(
          "Error wishlist fetch" +
            (err instanceof Error ? ": " + err.message : "")
        );
        setWishlist(undefined);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [updateWishlist, page]);
  /**
   * Update stated for a new current user
   */
  useEffect(() => {
    setPage(1);
    setWishlist(undefined);
    setUpdateWishlist((prevState) => !prevState);
  }, [curUser]);

  /**
   * Setup an actual item that is on edit
   *  */
  useEffect(() => {
    if (wishItemEdit) {
      setWishItemIsEdit(true);
    }
  }, [wishItemEdit]);

  const handleSetEditItem = (wishEditItemId: number) => {
    if (wishlist) {
      const wishItem = wishlist.items.find(
        (item) => item.id === wishEditItemId
      );
      if (wishItem) {
        setWishItemEdit({
          ...wishItem,
        });
      }
    }
  };

  const handleEditWindowLeave = useCallback(() => {
    setWishItemEdit(undefined);
  },[]);

  const handleReserveItem = async (itemId: number) => {
    const requestParams = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        `/backend/api/reserve?item_id=${itemId}`,
        requestParams
      );
      console.log("Reservation successful");
      if (wishlist) {
        let updatedWishList = wishlist.items.map((item) => {
          if (item.id === itemId) {
            return { ...item, reserved_user: user };
          } else {
            return item;
          }
        });
        setWishlist((prev) => {
          return prev ? { ...prev, items: updatedWishList } : prev;
        });
      }
    } catch (err) {
      console.log(
        "Error wishlist fetch" +
          (err instanceof Error ? ": " + err.message : "")
      );
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
    try {
      const response = await fetch(
        `/backend/api/unreserve?item_id=${itemId}`,
        requestParams
      );
      if (!response.ok) {
        throw new Error("Cannot unreserve item");
      }
      console.log("Unreservation successful");
      if (wishlist) {
        let updatedWishList = wishlist.items.map((item) => {
          if (item.id === itemId) {
            return { ...item, reserved_user: undefined };
          } else {
            return item;
          }
        });
        setWishlist((prev) => {
          return prev ? { ...prev, items: updatedWishList } : prev;
        });
      }
    } catch (err) {
      console.log(
        "Error wishlist fetch" +
          (err instanceof Error ? ": " + err.message : "")
      );
    }
  };

  const handleNextPageClick = useCallback(() => {
    const current = page;
    const next = current + 1;
    const total = wishlist ? wishlist.total_pages : current;

    setPage(next <= total ? next : current);
  }, [page, wishlist]);

  const handlePrevPageClick = useCallback(() => {
    const current = page;
    const prev = current - 1;

    setPage(prev > 0 ? prev : current);
  }, [page]);



  const handleChatOpen = (chatItem : {id: number, title: string}) => {
    setChatItem(chatItem);
  };
  const handleChatClose = () => {
    setChatItem(undefined);
  };
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header_wrapper}>
          <h3 className={classNames(styles.title, "page-text", "page-title-text")}>Wishlist</h3>
          {chatItem && <Chat userReciver={curUser} chatItem={chatItem} handleClose={handleChatClose}/>}
          {self && (
            <button
              type="button"
              onClick={() => {
                setActiveModalAdd(true);
              }}
              className={styles.add_button}
            >
              <img
                src="/img/plus.png"
                alt="media"
                className={styles.add_button__media}
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
        <section className={styles.wishlist}>
          {wishlist &&
            !isLoading &&
            wishlist.items.length > 0 &&
            wishlist.items.map((item) => {
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
                  handleChatOpen={handleChatOpen}
                />
              );
            })}
          {wishlist && wishlist.items.length === 0 && <h3>No data</h3>}
          {wishlist && wishlist.items.length > 0 && (
            <Pagination
              onNextPageClick={handleNextPageClick}
              onPrevPageClick={handlePrevPageClick}
              disable={{
                left: page === 1,
                right: page === wishlist.total_pages,
              }}
              nav={{
                current: page,
                total: wishlist.total_pages,
              }}
            />
          )}
          {isLoading && <h3>Loading</h3>}
          {error && <h3>Error</h3>}
        </section>
      </div>
    </>
  );
}

export default Wishlist;
