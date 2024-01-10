import { Button, Icon, Image } from "@chakra-ui/react";
import {
  UserContext,
  UserContextType,
  userData,
} from "../../context/UserContext";
import ModalWindow from "../ModalWindow/ModalWindow";
import UserEditAvatarForm from "./UserEditAvatarForm";
import UserEditProfileDataForm from "./UserEditProfileDataForm";
import "./user.css";
import { useContext, useEffect, useState } from "react";
import { EditIcon } from "@chakra-ui/icons";
import { RiEditLine } from "react-icons/ri";
import UserChangePasswordForm from "./UserChangePasswordForm";

interface IUser {
  self: boolean;
  user: userData;
}

function User(props: IUser) {
  const { self, user } = props;
  const { getAccessCookie, setUser, requestProvider } = useContext(
    UserContext
  ) as UserContextType;
  const [userImgUrl, setUserImgUrl] = useState(
    user.imgUrl
      ? user.imgUrl + `&t=${new Date().getTime()}`
      : "/img/username.png"
  );
  const [avatarIsEdit, setAvatarIsEdit] = useState<boolean>(false);
  const [userDataIsEdit, setUserDataIsEdit] = useState<boolean>(false);
  const [userPasswordChange, setUserPasswordChange] = useState<boolean>(false);
  const baseImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/";
  const fixImageUrl = (url: string | undefined) => {
    return url ? url.replace("/", "%2F") : "mqdefault.jpeg";
  };

  const handleEditAvatar = () => {
    setAvatarIsEdit(true);
  };
  const handleEditProfileData = () => {
    setUserDataIsEdit(true);
  };
  const handleChangeUserPassword = () => {
    setUserPasswordChange(true);
  };

  useEffect(() => {
    setUserImgUrl(
      user.imgUrl
        ? user.imgUrl + `&t=${new Date().getTime()}`
        : "/img/username.png"
    );
  }, [user]);

  const editUserAvatar = async (
    deleteUserAvatar: boolean,
    imgBinary?: File,
    username?: string
  ) => {
    let response: Response;
    if (deleteUserAvatar) {
      const requestParams = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + getAccessCookie(),
        },
      };
      response = await fetch(`/backend/delete_image`, requestParams);
    } else {
      if (!imgBinary) {
        return;
      }
      const formData = new FormData();
      if (imgBinary) {
        formData.append("image", imgBinary, imgBinary.name);
      }

      const requestParams = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + getAccessCookie(),
        },
        body: formData,
      };
      response = await fetch(`/backend/edit_info`, requestParams);
    }
    if (response.ok) {
      const data = await response.json();
      if (user && data) {
        setUser((prev) => {
          if (prev) {
            return {
              ...prev,
              imgUrl: baseImageUrl + fixImageUrl(data.image_url) + "?alt=media",
            };
          }
          return prev;
        });
        setUserImgUrl(
          user.imgUrl + `&t=${new Date().getTime()}` ?? "/img/username.png"
        );
      }
    } else {
      console.log("dont Edit avatar");
    }
  };

  const changeUserPassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    const formData = new FormData();
    formData.append("current_password", currentPassword);
    formData.append("new_password", newPassword);
    const requestParams = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
      body: formData,
    };
    try {
      const response = await requestProvider(
        fetch,
        `/backend/edit_info`,
        requestParams
      );
      console.log("Password changed");
    } catch (err) {
      console.log("Password doesnt changed");
      console.log(err instanceof Error ? " : " + err.message : "");
    }
  };

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
          <>
            <Button
              leftIcon={<EditIcon />}
              colorScheme="teal"
              onClick={handleEditProfileData}
            >
              Edit profile
            </Button>
            <Button
              leftIcon={<Icon as={RiEditLine} />}
              colorScheme="teal"
              onClick={handleChangeUserPassword}
            >
              Change Password
            </Button>
          </>
        )}
        <ModalWindow
          active={userPasswordChange}
          setActive={setUserPasswordChange}
        >
          {userPasswordChange && (
            <UserChangePasswordForm
              editUserPassword={changeUserPassword}
              setActiveModal={setUserPasswordChange}
            />
          )}
        </ModalWindow>
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
              editUserAvatar={editUserAvatar}
              setActiveModal={setAvatarIsEdit}
            />
          )}
        </ModalWindow>
      </section>
    </>
  );
}

export default User;
