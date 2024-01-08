import { useForm } from "react-hook-form";
import UserInput from "../UserInput/UserInput";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { UserContext, UserContextType } from "../../context/UserContext";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

interface IUserEditAvatarForm {
  updateUserAvatarUrl: Dispatch<SetStateAction<string>>;
  setActiveModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IEditAvatar {
  userAvatar: File;
}

function UserEditAvatarForm(props: IUserEditAvatarForm) {
  console.log("UserEditAvatarFormRerender");
  const { updateUserAvatarUrl, setActiveModal } = props;
  const [userAvatar, setUserAvatar] = useState<File | undefined>(undefined);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IEditAvatar>();
  const { user, getAccessCookie, setUser } = useContext(
    UserContext
  ) as UserContextType;
  const baseImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/";
  const fixImageUrl = (url: string | undefined) => {
    return url ? url.replace("/", "%2F") : url;
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
        // user.imgUrl = baseImageUrl + fixImageUrl(data.image_url) + "?alt=media";
        setUser((prev) => {
          if (prev) {
            return {
              ...prev,
              imgUrl: baseImageUrl + fixImageUrl(data.image_url) + "?alt=media",
            };
          }
          return prev;
        });
        updateUserAvatarUrl(
          user.imgUrl + `&t=${new Date().getTime()}` ?? "/img/username.png"
        );
        
      }
    } else {
      console.log("dont Edit avatar");
    }
  };

  const onSubmitHandler = async (values: IEditAvatar) => {
    editUserAvatar(userAvatar);
    setUserAvatar(undefined);
    reset();
    setActiveModal(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUserAvatar(e.target.files[0]);
    }
  };

  return (
    <>
      <Heading
        mb={5}
        textAlign="center"
        className="page-text page-title-text"
        color="teal"
      >
        Edit avatar
      </Heading>
      <form id="editAvatarForm" onSubmit={handleSubmit(onSubmitHandler)}>
        <FormControl>
          <FormLabel htmlFor="userAvatar">Wish image</FormLabel>
          <Input
            type="file"
            id="userAvatar"
            placeholder="Wish image"
            {...register("userAvatar", { onChange: handleFileChange })}
          />
        </FormControl>
        {/* <UserInput
          type="file"
          id="userAvatar"
          {...register("userAvatar", { onChange: handleFileChange })}
          className="user-input edit-form-input"
          placeholder="Wish image"
          fieldClassName="edit-form-field"
        /> */}
        <Flex justifyContent="center" alignItems="center" mt={5}>
          <Button
            mt={4}
            colorScheme="teal"
            type="submit"
            isLoading={isSubmitting}
            rightIcon={<ArrowForwardIcon />}
          >
            Submit
          </Button>
        </Flex>
      </form>

      {/* <button
        type="submit"
        form="editAvatarForm"
        className="modal-user-form-button"
      >
        Submit
      </button> */}
    </>
  );
}

export default UserEditAvatarForm;
