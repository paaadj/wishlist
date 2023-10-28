import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserContextType } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

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
    formState: { errors },
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
    console.log(requestParams);
    const response = await fetch(
      "/api/token",
      requestParams
    );
    const data = await response.json();

    if (!response.ok) {
      console.log(response);
      console.log("DB error");
    } else {
      console.log("sssss");
      setAuthorizationTokens(data.access_token, data.refresh_token);
    }
    console.table(values);
    navigate("/");
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
            {...register("password")}
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        {errors && (
          <div>
            <p>{errors.username?.message}</p>
            <p>{errors.password?.message}</p>
          </div>
        )}
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
};

export default Login;
