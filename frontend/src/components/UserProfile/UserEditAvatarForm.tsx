import { useForm } from "react-hook-form";
import UserInput from "../UserInput/UserInput";
import { ChangeEvent, Dispatch, SetStateAction, useContext, useState } from "react";
import { UserContext, UserContextType } from "../../context/UserContext";

interface IUserEditAvatarForm {
  updateUserAvatarUrl: Dispatch<SetStateAction<string>>;
}

interface IEditAvatar {
  userAvatar: File;
}

function UserEditAvatarForm(props: IUserEditAvatarForm) {
  const { updateUserAvatarUrl } = props;
  const [userAvatar, setUserAvatar] = useState<File | undefined>(undefined);
  const { register, handleSubmit, reset } = useForm<IEditAvatar>();
  const { user, getAccessCookie } = useContext(UserContext) as UserContextType;
  const baseImageUrl = "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/";
  const fixImageUrl = (url:string | undefined) => {
    return url ? url.replace('/', "%2F") : url;
  };
  const editUserAvatar = async (imgBinary?: File) => {
    if (!imgBinary) {
      return;
    }
    const formData = new FormData();
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
    const response = await fetch(`/backend/edit_info`, requestParams);
    if (response.ok) {
      const data = await response.json();
      if (user && data) {
        user.imgUrl = baseImageUrl + fixImageUrl(data.image_url) + "?alt=media";
        updateUserAvatarUrl(user.imgUrl + `&t=${new Date().getTime()}` ?? "/img/username.png")
      }
    } else {
      console.log("dont Edit avatar");
    }
  };

  const onSubmitHandler = async (values: IEditAvatar) => {
    editUserAvatar(userAvatar);
    setUserAvatar(undefined);
    reset();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUserAvatar(e.target.files[0]);
    }
  };

  return (
    <>
      <h3>Edit avatar</h3>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <UserInput
          type="file"
          id="userAvatar"
          {...register("userAvatar", { onChange: handleFileChange })}
          className="user-input"
          placeholder="Wish image"
        />
        <button>Submit</button>
      </form>
    </>
  );
}

export default UserEditAvatarForm;
