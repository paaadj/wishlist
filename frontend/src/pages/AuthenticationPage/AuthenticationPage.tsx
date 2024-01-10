import { useNavigate } from "react-router-dom";
import "./authenticationPage.css";
import LoginForm from "../../components/Authentication/LoginForm";
import RegistrationForm from "../../components/Authentication/RegistrationForm";
interface IAuthenticationPage{
  login: boolean;
  registraion: boolean;
}
function AuthenticationPage(props: IAuthenticationPage) {
  const {login, registraion} = props;
  const navigate = useNavigate();

  const registerUser = async (
    firstName: string,
    username: string,
    email: string,
    password: string,
    lastName?: string
  ) => {
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
    const response = await fetch("/backend/register", requestParams);


    if (!response.ok) {

    } else {
      navigate("/");
    }
  };

  return (
    <div className="auth-wrapper">
      {login && <LoginForm />}
      {registraion && <RegistrationForm registerUser={registerUser}/>}
    </div>
  );
}

export default AuthenticationPage;
