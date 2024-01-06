import classNames from "classnames";
import styles from "./adminPage.module.css";
import AdminHeader from "../../components/Admin/AdminHeader";
import AdminSideMenu from "../../components/Admin/AdminSideMenu";
import AdminMainView from "../../components/Admin/AdminMainView";
import React from "react";
import SideMenuItem from "../../components/Admin/SideMenuItem";
import AdminUserTable from "../../components/Admin/AdminTable/AdminUserTable";
import { FaUser } from "react-icons/fa";
import { BsCardChecklist } from "react-icons/bs";
import AdminWishTable from "../../components/Admin/AdminTable/AdminWishTable";
export type UserData = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
};

export type WishData = {
  id: number;
  title: string;
  description: string;
  link: string | null;
  image_url: string | null;
  reserved_user: number | null;
};

export const wishesData = [
  {
    id: 1,
    title: "Ball",
    description: "Big ball",
    link: "#",
    image_url: null,
    reserved_user: 0,
  },
  {
    id: 2,
    title: "Pen",
    description: "Big Pen",
    link: "#",
    image_url: null,
    reserved_user: 0,
  },
  {
    id: 3,
    title: "Block",
    description: "Big Block",
    link: "#",
    image_url: null,
    reserved_user: 0,
  },
  {
    id: 4,
    title: "Sword",
    description: "Big Sword",
    link: "#",
    image_url: null,
    reserved_user: 0,
  },
  {
    id: 5,
    title: "Bottle",
    description: "Big Bottle",
    link: "#",
    image_url: null,
    reserved_user: 0,
  },
];

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
  {
    id: 6,
    first_name: "Ivan",
    last_name: "Ivanov",
    username: "Ivvvaannn",
    email: "ivan@gmail.com",
  },
  {
    id: 7,
    first_name: "Vasya",
    last_name: "Vasyaov",
    username: "Vaee112s4ya",
    email: "Vasya@gmail.com",
  },
  {
    id: 8,
    first_name: "Kirill",
    last_name: "IvKirillanov",
    username: "Kirrrill1112342",
    email: "Kirill@gmail.com",
  },
  {
    id: 9,
    first_name: "Petya",
    last_name: "Petyaov",
    username: "Ppettyasadf",
    email: "Petya@gmail.com",
  },
  {
    id: 10,
    first_name: "Sasha",
    last_name: "Sashaov",
    username: "Ssaasshjan",
    email: "Sasha@gmail.com",
  },
  {
    id: 11,
    first_name: "Ivan",
    last_name: "Ivanov",
    username: "Ivvvaannn",
    email: "ivan@gmail.com",
  },
  {
    id: 12,
    first_name: "Vasya",
    last_name: "Vasyaov",
    username: "Vaee112s4ya",
    email: "Vasya@gmail.com",
  },
  {
    id: 13,
    first_name: "Kirill",
    last_name: "IvKirillanov",
    username: "Kirrrill1112342",
    email: "Kirill@gmail.com",
  },
  {
    id: 14,
    first_name: "Petya",
    last_name: "Petyaov",
    username: "Ppettyasadf",
    email: "Petya@gmail.com",
  },
  {
    id: 15,
    first_name: "Sasha",
    last_name: "Sashaov",
    username: "Ssaasshjan",
    email: "Sasha@gmail.com",
  },
];

function AdminPage() {
  const [isSideMenuActive, setIsSideMenuActive] =
    React.useState<boolean>(false);
  const [currentTable, setCurrentTable] = React.useState<string>("users");
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
          onClick={() => {
            setCurrentTable("users");
          }}
        />
        <SideMenuItem
          icon={BsCardChecklist}
          text="Items"
          onClick={() => {
            setCurrentTable("wishes");
          }}
        />
      </AdminSideMenu>
      <AdminMainView>
        {currentTable === "users" && <AdminUserTable />}
        {currentTable === "wishes" && <AdminWishTable />}
      </AdminMainView>
    </div>
  );
}

export default AdminPage;
