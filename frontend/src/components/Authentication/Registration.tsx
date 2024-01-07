import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./authentication.css";
import UserInput from "../UserInput/UserInput";
import { useNavigate } from "react-router-dom";
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

interface IRegistrationInput {
  username: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const emailRegex =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const registrationValidationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string(),
  username: yup
    .string()
    .matches(/^([^0-9]*)$/, "Username should not contain numbers")
    .required("Username is a required field")
    .test("length", "More than or exactly 8 symbols", (username) =>
      username ? username.length >= 8 : false
    )
    .test(
      "checkUsernameAvailability",
      "This username is already registered",
      async (username) => {
        try {
          if (username && username.length >= 8) {
            const response = await fetch(`/backend/users/username/${username}`);
            const isUsernameAvalible = await response.json();
            return isUsernameAvalible;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
    ),
  email: yup
    .string()
    .required("Email is a required field")
    //.matches(emailRegex, "Email should have correct format")
    .test(
      "checkEmailAvailability",
      "This email is incorrect or already registered",
      async (email) => {
        try {
          if (email && emailRegex.test(email)) {
            const response = await fetch(`/backend/users/email/${email}`);
            const isEmailAvalible = await response.json();
            return isEmailAvalible;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
    ),
  password: yup
    .string()
    .test("length", "More than or exactly 8 symbols", (value) =>
      value ? value.toString().length >= 8 : false
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password must be equal") //Equals password
    .required("Confirm password is required"),
});

const Registration = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [, setConfirmPassword] = useState<string>("");

  const navigate = useNavigate();

  const defaultValues = {
    username: username,
    email: email,
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IRegistrationInput>({
    defaultValues,
    resolver: yupResolver(registrationValidationSchema),
    mode: "onBlur",
  });
  const onSubmitHandler = async (values: IRegistrationInput) => {
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
      }),
    };
    console.log(lastName);
    const response = await fetch("/backend/register", requestParams);
    // const data = await response.json();

    if (!response.ok) {
      console.log("DB error");
    } else {
      // setToken(data.access_token);

      console.log("Registration successful");
      navigate("/");
    }
    console.table(values);
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
          Sign Up
        </Heading>
      </Flex>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="authentication-form"
        id="signUpForm"
      >
        <FormControl isInvalid={!!errors.firstName}>
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
          <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
        </FormControl>

        {/* <UserInput
          type="text"
          id="firstName"
          placeholder="First name"
          className="user-input"
          imgSource="/img/username.png"
          required={true}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          {...register("firstName", {
            onChange: (e) => {
              setFirstName(e.target.value);
            },
          })}
        /> */}
        <FormControl isInvalid={!!errors.lastName}>
          <FormLabel htmlFor="firstName">Last name</FormLabel>
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
          <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
        </FormControl>
        {/* <UserInput
          type="text"
          id="lastName"
          placeholder="Last name"
          className="user-input"
          imgSource="/img/username.png"
          required={false}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          {...register("lastName", {
            onChange: (e) => {
              setLastName(e.target.value);
            },
          })}
        /> */}
        <FormControl isInvalid={!!errors.username}>
          <FormLabel htmlFor="firstName">Username</FormLabel>
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
          required={true}
          error={!!errors.username}
          helperText={errors.username?.message}
          {...register("username", {
            onChange: (e) => {
              setUsername(e.target.value);
            },
          })}
        /> */}
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="firstName">Email</FormLabel>
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
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        {/* <UserInput
          type="email"
          id="email"
          placeholder="Email"
          className="user-input"
          imgSource="/img/email.png"
          required={true}
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email", {
            onChange: (e) => {
              setEmail(e.target.value);
            },
          })}
        /> */}
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="firstName">Password</FormLabel>
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
          required={true}
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password", {
            onChange: (e) => {
              setPassword(e.target.value);
            },
          })}
        /> */}
        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel htmlFor="firstName">Confirm password</FormLabel>
          <Input
            type="password"
            id="confirm-Password"
            placeholder="Confirm password"
            {...register("confirmPassword", {
              onChange: (e) => {
                setConfirmPassword(e.target.value);
              },
            })}
          />
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>
        {/* <UserInput
          type="password"
          id="confirm-Password"
          placeholder="Confirm password"
          className="user-input"
          imgSource="/img/password.png"
          required={true}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            onChange: (e) => {
              setConfirmPassword(e.target.value);
            },
          })}
        /> */}

        {/* <div className="submit-wrapper">
          <button className="submit-button" type="submit">
            <span>Sign Up</span>
          </button>
        </div> */}
      </form>
      <Button
        mt={5}
        colorScheme="teal"
        isLoading={isSubmitting}
        type="submit"
        form="signUpForm"
      >
        Sign Up
      </Button>
    </Flex>
  );
};

export default Registration;
