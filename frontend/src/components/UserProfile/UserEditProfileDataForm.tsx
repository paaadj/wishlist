import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
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

interface IUserEditProfileData {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
}

interface IUserEditProfileDataForm {
  prevFirstName: string;
  prevLastName: string | undefined;
  prevUsername: string;
  prevEmail: string;
  setActiveModal: React.Dispatch<React.SetStateAction<boolean>>;
  onExit?: () => void;
}

function UserEditProfileDataForm(props: IUserEditProfileDataForm) {
  const {
    prevFirstName,
    prevLastName,
    prevUsername,
    prevEmail,
    setActiveModal,
  } = props;
  const [firstName, setFirstName] = useState<string>(prevFirstName);
  const [lastName, setLastName] = useState<string>(prevLastName ?? "");
  const [username, setUsername] = useState<string>(prevUsername);
  const [email, setEmail] = useState<string>(prevEmail);
  const { user, setUser, getAccessCookie, requestProvider } = useContext(
    UserContext
  ) as UserContextType;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IUserEditProfileData>({
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
    },
  });
  const onSubmitHandler = async (values: IUserEditProfileData) => {
    const formData = new FormData();
    let formDataIsEmpty = true;
    if (prevFirstName !== firstName) {
      formData.append("first_name", firstName);
      formDataIsEmpty = false;
    }
    if (prevLastName !== lastName) {
      formData.append("last_name", lastName);
      formDataIsEmpty = false;
    }
    if (prevUsername !== username) {
      formData.append("username", username);
      formDataIsEmpty = false;
    }
    if (prevEmail !== email) {
      formData.append("email", email);
      formDataIsEmpty = false;
    }

    const requestParams = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
      body: formData,
    };
    try {
      if (!formDataIsEmpty) {
        await requestProvider(
          fetch,
          "/backend/edit_info",
          requestParams
        );
        if (user) {
          setUser({
            id: user.id,
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            imgUrl: user.imgUrl,
          });
        }
        reset();
        setActiveModal(false);
      }
    } catch (err) {}
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

export default UserEditProfileDataForm;
