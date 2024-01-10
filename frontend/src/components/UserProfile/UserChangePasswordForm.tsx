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
  FormHelperText,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { ArrowForwardIcon, DeleteIcon } from "@chakra-ui/icons";

interface IUserChangePasswordForm {
  editUserPassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  setActiveModal: React.Dispatch<React.SetStateAction<boolean>>;
  username?: string;
}

interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

function UserChangePasswordForm(props: IUserChangePasswordForm) {
  console.log("UserEditAvatarFormRerender");
  const { editUserPassword, setActiveModal, username } = props;
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<IChangePassword>();
  const { user, getAccessCookie, setUser } = useContext(
    UserContext
  ) as UserContextType;

  const onSubmitHandler = async (values: IChangePassword) => {

    if (currentPassword && newPassword) {
      editUserPassword(currentPassword, newPassword);
    }
    setCurrentPassword("");
    setNewPassword("");
    reset();
    if (isSubmitted && isSubmitSuccessful) {
      setActiveModal(false);
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
        Change Password
      </Heading>
      <form id="editAvatarForm" onSubmit={handleSubmit(onSubmitHandler)}>
        <FormControl>
          <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
          <Input
            type="password"
            id="currentPassword"
            placeholder="Current Password"
            {...register("currentPassword", {
              onChange: (e) => {
                setCurrentPassword(e.target.value);
              },
            })}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="newPassword">New Password</FormLabel>
          <Input
            type="password"
            id="newPassword"
            placeholder="New Password"
            {...register("newPassword", {
              onChange: (e) => {
                setNewPassword(e.target.value);
              },
            })}
          />
        </FormControl>

        <Flex justifyContent="center" alignItems="center" mt={5}>
          <Button
            mt={4}
            colorScheme="teal"
            type="submit"
            isLoading={isSubmitting}
            rightIcon={<ArrowForwardIcon />}
          >
            Change Password
          </Button>
        </Flex>
      </form>
    </>
  );
}

export default UserChangePasswordForm;
