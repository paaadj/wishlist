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
import classNames from "classnames";
import Chat from "../../Chat/Chat";
import { Flex, IconButton, Spinner } from "@chakra-ui/react";
import { AddIcon, WarningIcon } from "@chakra-ui/icons";
import ReserveWishItemForm from "./ReserveWishItemForm";
import React from "react";

interface IWishlistProps {
  self: boolean;
  curUser: userData;
}

export type WishItem = {
  id: number;
  title: string;
  description: string;
  link: string;
  image_url: string;
  reserved_user?: number;
};

type WishList = {
  items: WishItem[];
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
};

const ROWS_PER_PAGE = 6;

function Wishlist(props: IWishlistProps) {
  const { self, curUser } = props;
  const { user, getAccessCookie, requestProvider } = useContext(
    UserContext
  ) as UserContextType;
  const [wishlist, setWishlist] = useState<WishList | undefined>(undefined);
  const [updateWishlist, setUpdateWishlist] = useState<boolean>(false);
  const [activeModalAdd, setActiveModalAdd] = useState(false);
  const [wishItemEdit, setWishItemEdit] = useState<WishItem | undefined>(
    undefined
  );
  const [wishItemReserved, setWishItemReserved] = useState<
    WishItem | undefined
  >(undefined);
  const [wishItemIsEdit, setWishItemIsEdit] = useState<boolean>(false);
  const [reserveFormActive, setReserveFormActive] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatItem, setChatItem] = useState<
    { id: number; title: string } | undefined
  >();

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestParams = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: getAccessCookie()
              ? "Bearer " + getAccessCookie()
              : "",
          },
        };
        const response = await requestProvider(
          fetch,
          `/backend/api/get_wishlist?page=${page}&per_page=${ROWS_PER_PAGE}&username=${curUser.username}`,
          requestParams
        );
        let data = await response.json();
        data.items.forEach((item: WishItem) => {
          if (item.image_url) {
            item.image_url += `?alt=media&t=${new Date().getTime()}`;
          }
        });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  /**
   * Setup an actual item that is on reserve
   *  */
  useEffect(() => {
    if (wishItemReserved) {
      setReserveFormActive(true);
    }
  }, [wishItemReserved]);

  const handleUpdateWishListFunction = useCallback(() => {
    setUpdateWishlist((prev) => !prev);
  }, []);

  const handleSetEditItem = useCallback(
    (wishEditItemId: number) => {
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
    },
    [wishlist]
  );

  const handleSetReserveItem = useCallback(
    (wishReserveItemId: number) => {
      if (wishlist) {
        const wishItem = wishlist.items.find(
          (item) => item.id === wishReserveItemId
        );
        if (wishItem) {
          setWishItemReserved({
            ...wishItem,
          });
        }
      }
    },
    [wishlist]
  );

  const handleEditWindowLeave = useCallback(() => {
    setWishItemEdit(undefined);
    setActiveModalAdd(false);
  }, []);

  const handleDeleteWishlistItem = async (wishId: number) => {
    const requestParams = {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
    };
    const response = await fetch(
      `/backend/api/delete/${wishId}`,
      requestParams
    );
    if (response.ok) {
      handleUpdateWishListFunction();
    }
  };

  const handleReserveItem = useCallback(
    async (itemId: number, date: string) => {
      const requestParams = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + getAccessCookie(),
          "Content-Type": "application/json",
        },
      };
      try {
        await fetch(
          `/backend/api/reserve?item_id=${itemId}` +
            (date ? `&date=${date}` : ""),
          requestParams
        );
        if (wishlist) {
          let updatedWishList = wishlist.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, reserved_user: 2 };
            } else {
              return item;
            }
          });
          setWishlist((prev) => {
            return prev ? { ...prev, items: updatedWishList } : prev;
          });
          setWishItemReserved(undefined);
          setReserveFormActive(false);
        }
      } catch (err) {}
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wishlist]
  );

  const handleUnreserveItem = useCallback(
    async (itemId: number) => {
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
      } catch (err) {}
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wishlist]
  );

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

  const handleChatOpen = useCallback(
    (chatItem: { id: number; title: string }) => {
      setChatItem(chatItem);
    },
    []
  );
  const handleChatClose = useCallback(() => {
    setChatItem(undefined);
  }, []);

  const handleCloseItemIsEdit = useCallback(() => {
    setWishItemIsEdit(false);
  }, []);

  const handleEditWishItem = useCallback(
    async (
      wishId: number,
      title?: string,
      description?: string,
      linkToSite?: string,
      imgBinary?: File,
      deleteImage?: boolean
    ) => {
      const formData = new FormData();
      let formIsEmpty = true;
      if (title) {
        formData.append("title", title);
        formIsEmpty = false;
      }
      if (description) {
        formData.append("description", description);
        formIsEmpty = false;
      }
      if (linkToSite) {
        formData.append("link", linkToSite);
        formIsEmpty = false;
      }
      if (imgBinary && !deleteImage) {
        formData.append("image", imgBinary, imgBinary.name);
        formIsEmpty = false;
      }

      const requestParams = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + getAccessCookie(),
        },
        body: formData,
      };
      let response: Response | undefined = undefined;
      if (!formIsEmpty) {
        response = await fetch(
          `/backend/api/update_item?item_id=${wishId}`,
          requestParams
        );
      }
      if (deleteImage) {
        const requestParams = {
          method: "GET",
          headers: {
            Authorization: "Bearer " + getAccessCookie(),
          },
        };
        response = await fetch(
          `/backend/api/${wishId}/delete_image`,
          requestParams
        );
      }
      if (response && response.ok) {
        setUpdateWishlist((prevState) => !prevState);
      } else {
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleAddWishItemToWishlist = async (
    title: string,
    description: string,
    linkToSite?: string,
    imgBinary?: File
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (linkToSite) {
      formData.append("link", linkToSite);
    }
    if (imgBinary) {
      formData.append("image", imgBinary, imgBinary.name);
    }
    const requestParams = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
      body: formData,
    };
    const response = await fetch(`/backend/api/add_item`, requestParams);
    if (response.ok) {
      if (wishlist) {
        if (wishlist.total_items - wishlist.page * wishlist.per_page < 0) {
          const data = await response.json();
          data.image_url += `?alt=media&t=${new Date().getTime()}`;
          wishlist.items.push(data);
        }
        setWishlist((prev) => {
          return prev
            ? {
                ...prev,
                items: wishlist.items,
                total_items: prev.total_items + 1,
                total_pages: Math.ceil((prev.total_items + 1) / prev.per_page),
              }
            : prev;
        });
      }
    } else {
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header_wrapper}>
          <h3
            className={classNames(styles.title, "page-text", "page-title-text")}
          >
            Wishlist
          </h3>
          {chatItem && (
            <Chat
              userReciver={curUser}
              chatItem={chatItem}
              handleClose={handleChatClose}
            />
          )}
          {self && (
            <IconButton
              aria-label="Add new wish"
              _hover={{ background: "transparent" }}
              bg="transparent"
              icon={
                <AddIcon
                  color="#34C924"
                  w="70%"
                  h="70%"
                  _hover={{ color: "#3ABF2B" }}
                />
              }
              onClick={() => {
                setActiveModalAdd(true);
              }}
              boxSize={10}
            />
          )}
        </div>
        <ModalWindow
          active={reserveFormActive}
          setActive={setReserveFormActive}
        >
          {reserveFormActive && (
            <ReserveWishItemForm
              updateReservation={handleReserveItem}
              wishId={wishItemReserved?.id}
            />
          )}
        </ModalWindow>
        <ModalWindow active={activeModalAdd} setActive={setActiveModalAdd}>
          <AddWishItemForm
            addWishItemToWishlistFunc={handleAddWishItemToWishlist}
          />
        </ModalWindow>
        <ModalWindow
          active={wishItemIsEdit}
          setActive={setWishItemIsEdit}
          onLeaving={handleEditWindowLeave}
        >
          {wishItemIsEdit ? (
            <EditWishItemForm
              wishId={wishItemEdit?.id}
              prevWishName={wishItemEdit?.title}
              prevWishDesc={wishItemEdit?.description}
              prevWishImg={wishItemEdit?.image_url}
              closeWishItemIsEdit={handleCloseItemIsEdit}
              editWishItemFunc={handleEditWishItem}
            />
          ) : (
            <Flex align="center" justifyContent="center" padding={50} w="100%">
              <Spinner />
            </Flex>
          )}
        </ModalWindow>

        <section className={styles.wishlist}>
          <div className={styles.wishlist_wrap}>
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
                    link={item.link}
                    imgUrl={item.image_url}
                    reservedUser={item.reserved_user}
                    updateWishlistFunction={handleUpdateWishListFunction}
                    setEditWishItem={handleSetEditItem}
                    handleDeleteItem={handleDeleteWishlistItem}
                    handleSetReserveItem={handleSetReserveItem}
                    handleUnreserveItem={handleUnreserveItem}
                    handleChatOpen={handleChatOpen}
                  />
                );
              })}
            {wishlist && wishlist.items.length === 0 && (
              <Flex
                justifyContent="center"
                h="100%"
                w="100%"
                className="page-text page-reg-text"
              >
                No data
              </Flex>
            )}
            {isLoading && (
              <Flex
                align="center"
                justifyContent="center"
                w="100%"
                padding={50}
              >
                <Spinner />
              </Flex>
            )}
            {error && (
              <Flex
                align="center"
                justifyContent="center"
                w="100%"
                padding={50}
              >
                <WarningIcon color="red" />
              </Flex>
            )}
          </div>

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
        </section>
      </div>
    </>
  );
}

export default React.memo(Wishlist);
