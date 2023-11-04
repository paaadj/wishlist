import { userData } from "../../context/UserContext";
import "./user.css";



interface IUser{
  user: userData ;
}

function User(props: IUser) {
  const {user} = props;

  return (
    <>
      <section className="personal-data">
        <h1 className="page-text page-title-text">
          {user ? user.firstName + " " + user.lastName : "Loading"}
        </h1>
        <h3 className="page-text page-title-text">
          {user ? "@" + user.username : "Loading"}
        </h3>
        <h6 className="page-text page-reg-text">
          {user ? user.email : "Loading"}
        </h6>
        <img
          src="/img/username.png"
          alt="avarar"
          className="personal-data-avatar"
        />
      </section>

      
    </>
  );
}

export default User;
