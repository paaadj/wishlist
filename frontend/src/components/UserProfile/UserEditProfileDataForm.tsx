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
  const { prevFirstName, prevLastName, prevUsername, prevEmail } = props;
  const [firstName, setFirstName] = useState<string>(prevFirstName);
  const [lastName, setLastName] = useState<string>(prevLastName ?? "");
  const [username, setUsername] = useState<string>(prevUsername);
  const [email, setEmail] = useState<string>(prevEmail);
  const { user, setUser, getAccessCookie, requestProvider } = useContext(
    UserContext
  ) as UserContextType;
  const { register, handleSubmit, reset } = useForm<IUserEditProfileData>({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
    },
  });
  const onSubmitHandler = async (values: IUserEditProfileData) => {
    const formData = new FormData();

    formData.append("first_name", firstName);
    formData.append("last_name", lastName);

    const requestParams = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
      body: formData,
    };
    try {
      const response = await requestProvider(
        fetch,
        "/backend/edit_info",
        requestParams
      );
      if (user) {
        setUser({
          id: user.id,
          firstName: firstName,
          lastName: lastName,
          username: user.username,
          email: user.email,
          imgUrl: user.imgUrl,
        });
      }
      reset();
    } catch (err) {

    }
  };

  return (
    <div className="modal-user-form-wrapper">
      <h3 className="page-text page-title-text modal-user-form-title">
        Edit profile data
      </h3>
      <form
        className="modal-user-form"
        id="profileDataEditForm"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <UserInput
          type="text"
          id="firstName"
          placeholder="First name"
          className="user-input edit-form-input"
          imgSource="/img/username.png"
          required={false}
          fieldClassName="edit-form-field"
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
          className="user-input edit-form-input"
          imgSource="/img/username.png"
          required={false}
          fieldClassName="edit-form-field"
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
          className="user-input edit-form-input"
          imgSource="/img/username.png"
          required={false}
          fieldClassName="edit-form-field"
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
          className="user-input edit-form-input"
          imgSource="/img/email.png"
          required={false}
          fieldClassName="edit-form-field"
          {...register("email", {
            onChange: (e) => {
              setEmail(e.target.value);
            },
          })}
        />
      </form>
      <button
        type="submit"
        form="profileDataEditForm"
        className="modal-user-form-button"
      >
        Submit
      </button>
    </div>
  );
}

export default UserEditProfileDataForm;
