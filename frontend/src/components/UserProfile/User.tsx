import { userData } from "../../context/UserContext";
import ModalWindow from "../ModalWindow/ModalWindow";
import UserEditAvatarForm from "./UserEditAvatarForm";
import UserEditProfileDataForm from "./UserEditProfileDataForm";
import "./user.css";
import { useEffect, useState } from "react";

interface IUser {
  self: boolean;
  user: userData;
}

function User(props: IUser) {
  const { self, user } = props;
  
  // const [userFirstName, setUserFirstName] = useState(user.firstName);
  // const [userLastName, setUserLastName] = useState(user.lastName);
  // const [userUsername, setUserUsername] = useState(user.username);
  // const [userEmail, setUserEmail] = useState(user.email);
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
        {self && <button onClick={handleEditProfileData}>Edit profile</button>}
        <ModalWindow active={userDataIsEdit} setActive={setUserDataIsEdit}>
          <UserEditProfileDataForm
            prevFirstName={user.firstName}
            prevLastName={user.lastName}
            prevUsername={user.username}
            prevEmail={user.email}
          />
        </ModalWindow>
        <img src={userImgUrl} alt="avatar" className="personal-data-avatar" />
        {self && <button onClick={handleEditAvatar}>Edit avatar</button>}
        <ModalWindow active={avatarIsEdit} setActive={setAvatarIsEdit}>
          <UserEditAvatarForm updateUserAvatarUrl={setUserImgUrl} />
        </ModalWindow>
      </section>
    </>
  );
}

export default User;
