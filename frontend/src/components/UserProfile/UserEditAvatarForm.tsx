import { useForm } from "react-hook-form";
import {
  ChangeEvent,
  useState,
} from "react";
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
  const { editUserAvatar, setActiveModal, username } = props;
  const [userAvatar, setUserAvatar] = useState<File | undefined>(undefined);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IEditAvatar>();


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
          <FormLabel htmlFor="userAvatar">Avatar image</FormLabel>
          <Input
            type="file"
            id="userAvatar"
            placeholder="Wish image"
            {...register("userAvatar", { onChange: handleFileChange })}
          />
        </FormControl>

        <Flex justifyContent="center" alignItems="center" mt={5} columnGap={3}>
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
    </>
  );
}

export default UserEditAvatarForm;
