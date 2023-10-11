import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface IRegistrationInput {
  username: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

// const emailRegex =
//   /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const registrationValidationSchema = yup.object().shape({
  username: yup
    .string()
    .matches(/^([^0-9]*)$/, "Username should not contain numbers")
    .required("Username is a required field"),
  email: yup
    .string()
    //.matches(emailRegex, "Email should have correct format")
    ,
  password: yup
    .string()
    .test("length", "More than or exactly 7 symbols", (value) =>
      value ? value.toString().length >= 7 : false
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password must be equal") //Equals password
    .required("Confirm password is required"),
});

const Registration = () => {
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
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    };
    console.log(requestParams);
    const response = await fetch("http://localhost:8000/api/register", requestParams);
    // const data = await response.json();

    if(!response.ok){
        console.log("DB error");
    }
    else{
        // setToken(data.access_token);
        console.log("Registration successful");
    }
    console.table(values);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div>
          <input
            {...register("username")}
            type="text"
            id="username"
            placeholder="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        
        <div>
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            {...register("password")}
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirm-Password"
            placeholder="Confirm Password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        {errors && (
          <div>
            <p>{errors.username?.message}</p>
            <p>{errors.email?.message}</p>
            <p>{errors.password?.message}</p>
            <p>{errors.confirmPassword?.message}</p>
          </div>
        )}
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
};

export default Registration;
