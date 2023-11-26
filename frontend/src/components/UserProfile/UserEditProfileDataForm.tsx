import { useForm } from "react-hook-form";
import UserInput from "../UserInput/UserInput";
import { useContext, useState } from "react";
import { UserContext, UserContextType } from "../../context/UserContext";

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
}

function UserEditProfileDataForm(props: IUserEditProfileDataForm) {
  const { prevFirstName, prevLastName,prevUsername, prevEmail } = props;
  const [firstName, setFirstName] = useState<string>(prevFirstName);
  const [lastName, setLastName] = useState<string>(prevLastName ?? "");
  const [username, setUsername] = useState<string>(prevUsername);
  const [email, setEmail] = useState<string>(prevEmail);
  const { user, getAccessCookie } = useContext(UserContext) as UserContextType;
  const { register, handleSubmit, reset } = useForm<IUserEditProfileData>({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
    },
  });
  const onSubmitHandler = async (values: IUserEditProfileData) => {
    const formData = new FormData();

    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("username", username);
    formData.append("email", email);

    const requestParams = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
      body: formData,
    };
    const response = await fetch("/backend/edit_info", requestParams);

    if (response.ok) {
    } else {
    }
  };

  return (
    <>
      <h3>Add Wish Item</h3>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <UserInput
          type="text"
          id="firstName"
          placeholder="First name"
          className="user-input"
          imgSource="/img/username.png"
          required={true}
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
          {...register("email", {
            onChange: (e) => {
              setEmail(e.target.value);
            },
          })}
        />
        <button>Submit</button>
      </form>
    </>
  );
}

export default UserEditProfileDataForm;
