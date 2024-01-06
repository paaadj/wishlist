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
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  CiBookmarkMinus,
  CiBookmarkPlus,
  CiBookmarkCheck,
} from "react-icons/ci";
import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ChatIcon, DeleteIcon, EditIcon, LinkIcon } from "@chakra-ui/icons";

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
  const [popUp, setPopUp] = useState(false);
  const baseImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/";
  const fixImageUrl = (url: string | undefined) => {
    return url ? url.replace("/", "%2F") : url;
  };
  const fixedImageUrl = imgUrl
    ? baseImageUrl + fixImageUrl(imgUrl) + "?alt=media"
    : "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media";
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
    setPopUp(false);
  };

  const handleReserveButtonClick = () => {
    handleReserveItem(wishItemId);
    setPopUp(false);
  };

  const handleUnreserveButtonClick = () => {
    handleUnreserveItem(wishItemId);
    setPopUp(false);
  };

  const handleOpenChatButtonClick = () => {
    handleChatOpen({ id: wishItemId, title: title });
    setPopUp(false);
  };

  return (
    <div
      className={classNames(styles.card_wrapper, {
        [styles.reserved_wish]: reservedUser === 1,
        [styles.self_reserved_wish]: reservedUser === 2,
      })}
    >
      <div className={styles.card_img_wrapper}>
        <img src={fixedImageUrl} alt="wishImg" className={styles.card_img} />
      </div>
      <div className={styles.card_data_wrapper}>
        <header className={styles.card_data_header}>
          <h5 className={classNames(styles.card_title, "page-text")}>
            {title}
          </h5>
          <div className={styles.card_data_header_buttons}>
            {reservedUser == 2 && (
              <IconButton
                aria-label="Unreserve wish"
                isRound={true}
                bg="transparent"
                _hover={{ background: "#e1dfdf" }}
                icon={
                  <Icon as={CiBookmarkMinus} w="100%" h="100%" color="red" />
                }
                onClick={handleUnreserveButtonClick}
                boxSize={6}
              />
            )}
            {!reservedUser && !self && (
              <IconButton
                aria-label="Reserve wish"
                isRound={true}
                bg="transparent"
                _hover={{ background: "#e1dfdf" }}
                icon={
                  <Icon as={CiBookmarkPlus} w="100%" h="100%" color="green" />
                }
                onClick={handleReserveButtonClick}
                boxSize={6}
              />
            )}
            {/* {self && (
              <IconButton
                aria-label="See more actions"
                isRound={true}
                _hover={{background: "#e1dfdf"}}
                bg="transparent"
                icon={<Icon as={BsThreeDotsVertical} w="100%" h="100%" />}
                onClick={() => {
                  setPopUp((prev) => !prev);
                }}
                boxSize={6}
              />
            )} */}
            {self && (
              <Menu isLazy placement="left" closeOnSelect={true}>
                <MenuButton
                  as={IconButton}
                  aria-label="See more actions"
                  isRound={true}
                  _hover={{ background: "#e1dfdf" }}
                  bg="transparent"
                  icon={<Icon as={BsThreeDotsVertical} w="100%" h="100%" />}
                  boxSize={6}
                />
                <MenuList>
                  {/* MenuItems are not rendered unless Menu is open */}
                  <MenuItem
                    fontWeight="500"
                    color="#2a9d8f"
                    icon={<ChatIcon />}
                    onClick={handleOpenChatButtonClick}
                  >
                    Open chat
                  </MenuItem>
                  <MenuItem
                    fontWeight="500"
                    color="red"
                    icon={<DeleteIcon />}
                    onClick={deleteWishlistItem}
                  >
                    Delete
                  </MenuItem>
                  <MenuItem
                    fontWeight="500"
                    color="#bc4749"
                    icon={<EditIcon />}
                    onClick={handleEditButtonClick}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem fontWeight="500" icon={<LinkIcon />}>
                    Check
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </div>
        </header>
        <p
          className={classNames("page-text", "page-reg-text", styles.card_desc)}
        >
          {description}
        </p>
        <div
          className={classNames(styles.buttons_popup, {
            [styles.active_popup]: popUp,
          })}
        >
          <button
            type="button"
            className={styles.card_button}
            onClick={handleOpenChatButtonClick}
          >
            Open chat
          </button>
          {self && (
            <button
              type="button"
              className={styles.card_button}
              onClick={deleteWishlistItem}
            >
              delete
            </button>
          )}
          {self && (
            <button
              type="button"
              className={styles.card_button}
              onClick={handleEditButtonClick}
            >
              Edit
            </button>
          )}

          <button type="button" className={styles.card_button}>
            Check
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;
