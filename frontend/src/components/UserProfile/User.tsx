import { Button, Image } from "@chakra-ui/react";
import { userData } from "../../context/UserContext";
import ModalWindow from "../ModalWindow/ModalWindow";
import UserEditAvatarForm from "./UserEditAvatarForm";
import UserEditProfileDataForm from "./UserEditProfileDataForm";
import "./user.css";
import { useEffect, useState } from "react";
import { EditIcon } from "@chakra-ui/icons";

interface IUser {
  self: boolean;
  user: userData;
}

function User(props: IUser) {
  const { self, user } = props;
  const baseImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/";
  const [userImgUrl, setUserImgUrl] = useState(
    user.imgUrl
      ? user.imgUrl + `&t=${new Date().getTime()}`
      : "/img/username.png"
  );
  const [avatarIsEdit, setAvatarIsEdit] = useState<boolean>(false);
  const [userDataIsEdit, setUserDataIsEdit] = useState<boolean>(false);

  const handleEditAvatar = () => {
    setAvatarIsEdit(true);
  };
  const handleEditProfileData = () => {
    setUserDataIsEdit(true);
  };

  useEffect(() => {
    setUserImgUrl(
      user.imgUrl
        ? user.imgUrl + `&t=${new Date().getTime()}`
        : "/img/username.png"
    );
  }, [user]);

  return (
    <>
      <section className="personal-data">
        <h1 className="page-text page-title-text">
          {user ? user.firstName + " " + user.lastName : "Loading"}
        </h1>
        <h3 className="page-text page-title-text">
          {user ? "@" + user.username : "Loading"}
        </h3>
        <h6 className="page-text page-reg-text">
          {user ? user.email : "Loading"}
        </h6>
        {self && (
          <Button
            leftIcon={<EditIcon />}
            colorScheme="teal"
            onClick={handleEditProfileData}
          >
            Edit profile
          </Button>
        )}
        <ModalWindow active={userDataIsEdit} setActive={setUserDataIsEdit}>
          {userDataIsEdit && (
            <UserEditProfileDataForm
              prevFirstName={user.firstName}
              prevLastName={user.lastName}
              prevUsername={user.username}
              prevEmail={user.email}
              setActiveModal={setUserDataIsEdit}
            />
          )}
        </ModalWindow>
        <img src={userImgUrl} alt="avatar" className="personal-data-avatar" />
        {self && (
          <Button
            leftIcon={<EditIcon />}
            colorScheme="teal"
            onClick={handleEditAvatar}
          >
            Edit avatar
          </Button>
        )}
        <ModalWindow active={avatarIsEdit} setActive={setAvatarIsEdit}>
          {avatarIsEdit && (
            <UserEditAvatarForm
              updateUserAvatarUrl={setUserImgUrl}
              setActiveModal={setAvatarIsEdit}
            />
          )}
        </ModalWindow>
      </section>
    </>
  );
}

export default User;
