import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserContextType } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./authentication.css";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";

interface ILoginInput {
  username: string;
  password: string;
}

const registrationValidationSchema = yup.object().shape({
  username: yup
    .string()
    .matches(/^([^0-9]*)$/, "Username should not contain numbers")
    .required("Username is a required field"),
  password: yup.string().required("Password is required"),
});

const LoginForm = () => {
  const { setAuthorizationTokens } = useContext(UserContext) as UserContextType;
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const defaultValues = {
    username: username,
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginInput>({
    defaultValues,
    resolver: yupResolver(registrationValidationSchema),
    mode: "onBlur",
  });

  const onSubmitHandler = async (values: ILoginInput) => {
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(
        `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };
    const response = await fetch("/backend/token", requestParams);
    const data = await response.json();

    if (!response.ok) {
    } else {
      setAuthorizationTokens(data.access_token, data.refresh_token);
    }
    navigate("/");
  };

  return (
    <Flex
      boxSizing="border-box"
      direction="column"
      minW="300px"
      m={2}
      w="500px"
      maxWidth="100%"
      bg="white"
      borderRadius={10}
      p={8}
    >
      <Flex align="center" mb={5}>
        <IconButton
          onClick={() => navigate("/")}
          aria-label="Go back"
          icon={<ArrowLeftIcon />}
          bg="transparent"
        />
        <Heading
          textAlign="center"
          as="h3"
          className=" page-text page-title-text"
        >
          Sign In
        </Heading>
      </Flex>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="authentication-form"
        id="signInForm"
      >
          <FormControl isInvalid={!!errors.username}>
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
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel htmlFor="username">Password</FormLabel>
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
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
      </form>
      <Button
        mt={4}
        colorScheme="teal"
        isLoading={isSubmitting}
        type="submit"
        form="signInForm"
      >
        Sign In
      </Button>
    </Flex>
  );
};

export default LoginForm;
