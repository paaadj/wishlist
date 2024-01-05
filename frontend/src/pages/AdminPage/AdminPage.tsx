import classNames from "classnames";
import styles from "./adminPage.module.css";
import AdminHeader from "../../components/Admin/AdminHeader";
import AdminSideMenu from "../../components/Admin/AdminSideMenu";
import AdminMainView from "../../components/Admin/AdminMainView";
import React from "react";
import SideMenuItem from "../../components/Admin/SideMenuItem";
import AdminUserTable from "../../components/Admin/AdminUserTable";
import { FaUser } from "react-icons/fa";
import { BsCardChecklist } from "react-icons/bs";
export type UserData = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
};
export const usersData = [
  {
    id: 1,
    first_name: "Ivan",
    last_name: "Ivanov",
    username: "Ivvvaannn",
    email: "ivan@gmail.com",
  },
  {
    id: 2,
    first_name: "Vasya",
    last_name: "Vasyaov",
    username: "Vaee112s4ya",
    email: "Vasya@gmail.com",
  },
  {
    id: 3,
    first_name: "Kirill",
    last_name: "IvKirillanov",
    username: "Kirrrill1112342",
    email: "Kirill@gmail.com",
  },
  {
    id: 4,
    first_name: "Petya",
    last_name: "Petyaov",
    username: "Ppettyasadf",
    email: "Petya@gmail.com",
  },
  {
    id: 5,
    first_name: "Sasha",
    last_name: "Sashaov",
    username: "Ssaasshjan",
    email: "Sasha@gmail.com",
  },
];

function AdminPage() {
  const [isSideMenuActive, setIsSideMenuActive] =
    React.useState<boolean>(false);
  const handleSideMenuToggle = () => {
    setIsSideMenuActive((prev) => !prev);
  };
  return (
    <div className={classNames(styles.wrapper)}>
      <AdminHeader toggleSideMenu={handleSideMenuToggle} />
      <AdminSideMenu active={isSideMenuActive}>
        <SideMenuItem
          icon={FaUser}
          text="Users"
          onClick={() => {}}
        />
        <SideMenuItem
          icon={BsCardChecklist}
          text="Items"
          onClick={() => {}}
        />
      </AdminSideMenu>
      <AdminMainView>
          <AdminUserTable />
      </AdminMainView>
    </div>
  );
}

export default AdminPage;
