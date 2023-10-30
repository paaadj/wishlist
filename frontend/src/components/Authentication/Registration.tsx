import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./authentication.css";
import UserInput from "../UserInput/UserInput";

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
            console.log(username);
            const response = await fetch(`/backend/users/username/${username}`);
            const isUsernameAvalible = await response.json();
            console.log(isUsernameAvalible);
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
            console.log(email);
            const response = await fetch(`/backend/users/email/${email}`);
            const isEmailAvalible = await response.json();
            console.log(isEmailAvalible);
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

  const defaultValues = {
    username: username,
    email: email,
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegistrationInput>({
    defaultValues,
    resolver: yupResolver(registrationValidationSchema),
    mode: "onBlur",
  });
  const onSubmitHandler = async (values: IRegistrationInput) => {
    console.log(values);
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        username: username,
        email: email,
        password: password,
      }),
    };
    console.log(requestParams);
    const response = await fetch("/backend/register", requestParams);
    // const data = await response.json();

    if (!response.ok) {
      console.log("DB error");
    } else {
      // setToken(data.access_token);
      console.log("Registration successful");
    }
    console.table(values);
  };

  return (
    <div className="authentication-wrapper">
      <div className="authentication-window">
        <h3 className="authentication__title page-text page-title-text">
          Sign Up
        </h3>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="authentication-form"
        >
          
          <UserInput
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
          />
          <UserInput
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
          />
          <UserInput
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
          />

          <UserInput
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
          />

          <UserInput
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
          />

          <UserInput
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
          />
          
          <div className="submit-wrapper">
            <button className="submit-button" type="submit">
              <span>Sign Up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
