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
import { ArrowForwardIcon, DeleteIcon } from "@chakra-ui/icons";

interface IUserEditAvatarForm {
  editUserAvatar: (
    deleteUserAvatar: boolean,
    imgBinary?: File,
    username?: string,
  ) => Promise<void>;
  setActiveModal: React.Dispatch<React.SetStateAction<boolean>>;
  username?: string;
}

interface IEditAvatar {
  userAvatar: File;
}

function UserEditAvatarForm(props: IUserEditAvatarForm) {
  console.log("UserEditAvatarFormRerender");
  const { editUserAvatar, setActiveModal, username } = props;
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

  const onSubmitHandler = async (values: IEditAvatar) => {
    editUserAvatar(false, userAvatar, username);
    setUserAvatar(undefined);
    reset();
    setActiveModal(false);
  };

  const onDeleteHandler = async () => {
    editUserAvatar(true);
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
            Edit Image
          </Button>
          <Button
            mt={4}
            colorScheme="teal"
            type="button"
            rightIcon={<DeleteIcon />}
            onClick={onDeleteHandler}
          >
            Delete Image
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
