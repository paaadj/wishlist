import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { UserContext, UserContextType } from "../../../context/UserContext";
import { UserData } from "../../../pages/AdminPage/AdminPage";

interface IUserEditProfileData {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
}

interface IAdminUserEditForm {
  prevFirstName: string;
  prevLastName: string | undefined;
  prevUsername: string;
  prevEmail: string;
  editUserFunc: (
    prevFirstName: string,
    prevLastName: string | undefined,
    prevUsername: string,
    prevEmail: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  setActiveModal: React.Dispatch<React.SetStateAction<UserData | undefined>>;
  onExit?: () => void;
}

function AdminUserEditForm(props: IAdminUserEditForm) {
  console.log("UserEditDataRerender");
  const {
    prevFirstName,
    prevLastName,
    prevUsername,
    prevEmail,
    editUserFunc,
    setActiveModal,
  } = props;
  const [firstName, setFirstName] = useState<string>(prevFirstName);
  const [lastName, setLastName] = useState<string>(prevLastName ?? "");
  const [username, setUsername] = useState<string>(prevUsername);
  const [email, setEmail] = useState<string>(prevEmail);
  const [password, setPassword] = useState<string>("");
  const { getAccessCookie, requestProvider } = useContext(
    UserContext
  ) as UserContextType;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IUserEditProfileData>({
    defaultValues: {
      firstName: prevFirstName ?? "",
      lastName: prevLastName ?? "",
      username: prevUsername ?? "",
      email: prevEmail ?? "",
    },
  });
  const onSubmitHandler = async (values: IUserEditProfileData) => {
    editUserFunc(
      prevFirstName,
      prevLastName,
      prevUsername,
      prevEmail,
      firstName,
      lastName,
      username,
      email,
      password
    );
    reset();
    setActiveModal(undefined);
  };

  return (
    <>
      <Heading
        mb={5}
        textAlign="center"
        className="page-text page-title-text"
        color="teal"
      >
        Edit profile data
      </Heading>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <FormControl>
          <FormLabel htmlFor="firstName">First name</FormLabel>
          <Input
            type="text"
            id="firstName"
            placeholder="First name"
            {...register("firstName", {
              onChange: (e) => {
                setFirstName(e.target.value);
              },
            })}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="lastName">Last name</FormLabel>
          <Input
            type="text"
            id="lastName"
            placeholder="Last name"
            {...register("lastName", {
              onChange: (e) => {
                setLastName(e.target.value);
              },
            })}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            type="text"
            id="username"
            placeholder="Username"
            {...register("username", {
              onChange: (e) => {
                setUsername(e.target.value);
              },
            })}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            {...register("email", {
              onChange: (e) => {
                setEmail(e.target.value);
              },
            })}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">New password</FormLabel>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            {...register("password", {
              onChange: (e) => {
                setPassword(e.target.value);
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
            Submit
          </Button>
        </Flex>
      </form>
    </>
  );
}

export default AdminUserEditForm;
