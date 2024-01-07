import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserContextType } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./authentication.css";
import UserInput from "../UserInput/UserInput";
import {
  Box,
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

const Login = () => {
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
    console.table(values);
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
          {/* <UserInput
          type="text"
          id="username"
          placeholder="Username"
          className="user-input"
          imgSource="/img/username.png"
          error={!!errors.username}
          helperText={errors.username?.message}
          {...register("username", {
            onChange: (e) => {
              setUsername(e.target.value);
            },
          })}
        /> */}
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
          {/* <UserInput
          type="password"
          id="password"
          placeholder="Password"
          className="user-input"
          imgSource="/img/password.png"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password", {
            onChange: (e) => {
              setPassword(e.target.value);
            },
          })}
        /> */}
        

        {/* <div className="submit-wrapper">
          <button className="submit-button" type="submit">
            <span>Sign In</span>
          </button>
        </div> */}
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

    // <>
    //   <form onSubmit={handleSubmit(onSubmitHandler)}>
    //     <div>
    //       <input
    //         {...register("username")}
    //         type="text"
    //         id="username"
    //         placeholder="Username"
    //         onChange={(e) => {
    //           setUsername(e.target.value);
    //         }}
    //       />
    //     </div>
    //     <div>
    //       <input
    //         {...register("password")}
    //         type="password"
    //         id="password"
    //         placeholder="Password"
    //         onChange={(e) => {
    //           setPassword(e.target.value);
    //         }}
    //       />
    //     </div>
    //     {errors && (
    //       <div>
    //         <p>{errors.username?.message}</p>
    //         <p>{errors.password?.message}</p>
    //       </div>
    //     )}
    //     <div>
    //       <button type="submit">Submit</button>
    //     </div>
    //   </form>
    // </>
  );
};

export default Login;
