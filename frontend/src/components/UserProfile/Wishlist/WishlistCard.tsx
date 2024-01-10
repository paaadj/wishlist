import "../user.css";
import styles from "./wishlistStyles.module.css";
import classNames from "classnames";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  CiBookmarkMinus,
  CiBookmarkPlus,
} from "react-icons/ci";
import {
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ChatIcon, DeleteIcon, EditIcon, LinkIcon } from "@chakra-ui/icons";
import React from "react";

interface IWishlistCard {
  self: boolean;
  authUserId?: number;
  wishItemId: number;
  title: string;
  description: string;
  link?: string;
  imgUrl: string;
  reservedUser?: number;
  updateWishlistFunction: ()=>void;
  setEditWishItem: (wishEditItemId: number) => void;
  handleSetReserveItem: (wishEditItemId: number) => void;
  handleDeleteItem: (wishId: number) => Promise<void>
  handleUnreserveItem: (itemId: number) => Promise<void>;
  handleChatOpen: (chatItem: { id: number; title: string }) => void;
}

function WishlistCard(props: IWishlistCard) {
  const {
    self,
    wishItemId,
    title,
    description,
    link,
    imgUrl,
    reservedUser,
    setEditWishItem,
    handleDeleteItem,
    handleSetReserveItem,
    handleUnreserveItem,
    handleChatOpen,
  } = props;

  const baseImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/";
  const fixImageUrl = (url: string | undefined) => {
    return url ? url.replace("/", "%2F") : url;
  };
  const fixedImageUrl = imgUrl
    ? baseImageUrl + fixImageUrl(imgUrl)
    : "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/mqdefault.jpeg?alt=media";
  const deleteWishlistItem = () => {
    handleDeleteItem(wishItemId);
  };

  const handleEditButtonClick = () => {
    setEditWishItem(wishItemId);
  };

  const handleReserveButtonClick = () => {
    handleSetReserveItem(wishItemId);
  };


  const handleUnreserveButtonClick = () => {
    handleUnreserveItem(wishItemId);
  };

  const handleOpenChatButtonClick = () => {
    handleChatOpen({ id: wishItemId, title: title });
  };

  return (
    <div className={styles.card_wrapper}>
      <div
        className={classNames(styles.card, styles.card_size, {
          [styles.reserved_wish]: reservedUser === 1,
          [styles.self_reserved_wish]: reservedUser === 2,
        })}
      >
        <div className={styles.card_data_header_buttons}>
          {reservedUser === 2 && (
            <IconButton
              aria-label="Unreserve wish"
              isRound={true}
              bg="transparent"
              _hover={{ background: "#e1dfdf" }}
              icon={<Icon as={CiBookmarkMinus} w="100%" h="100%" color="red" />}
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
          <Menu isLazy placement="left-start" closeOnSelect={true}>
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
              {self && (
                <MenuItem
                  fontWeight="500"
                  color="red"
                  icon={<DeleteIcon />}
                  onClick={deleteWishlistItem}
                >
                  Delete
                </MenuItem>
              )}
              {self && (
                <MenuItem
                  fontWeight="500"
                  color="#bc4749"
                  icon={<EditIcon />}
                  onClick={handleEditButtonClick}
                >
                  Edit
                </MenuItem>
              )}

              <MenuItem onClick={() => {
                window.open(link, '_blank');
              }} fontWeight="500" icon={<LinkIcon /> }>
                Check external link
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className={styles.card_img_wrapper}>
          <Image
            src={fixedImageUrl}
            alt="wishImg"
            className={styles.card_img}
            m={8}
            borderRadius={5}
            boxShadow="xl"
          />
        </div>

        <h5 className={classNames(styles.card_title, "page-text")}>{title}</h5>
        <p
          className={classNames("page-text", "page-reg-text", styles.card_desc)}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export default React.memo(WishlistCard);
