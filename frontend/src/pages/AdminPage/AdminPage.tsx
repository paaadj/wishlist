import classNames from "classnames";
import styles from "./adminPage.module.css";
import AdminHeader from "../../components/Admin/AdminHeader";
import AdminSideMenu from "../../components/Admin/AdminSideMenu";
import AdminMainView from "../../components/Admin/AdminMainView";
import React, { useEffect } from "react";
import SideMenuItem from "../../components/Admin/SideMenuItem";
import AdminUserTable from "../../components/Admin/AdminTable/AdminUserTable";
import { FaUser } from "react-icons/fa";
import { BsCardChecklist } from "react-icons/bs";
import AdminWishTable from "../../components/Admin/AdminTable/AdminWishTable";
import { UserContext, UserContextType } from "../../context/UserContext";
import { Flex, Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
export type UserData = {
  id: number;
  first_name: string;
  last_name: string;
  image_url?: string;
  username: string;
  email: string;
};

export type WishData = {
  id: number;
  title: string;
  description: string;
  link: string | null;
  image_url: string | null;
  reserved_user: UserData | null;
  owner: UserData;
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

const AMOUNT_AT_THE_PAGE = 20;

function AdminPage() {
  const { user, getAccessCookie, requestProvider } = React.useContext(
    UserContext
  ) as UserContextType;
  const navigate = useNavigate();
  const [isSideMenuActive, setIsSideMenuActive] =
    React.useState<boolean>(false);
  const [currentUsers, setCurrentUsers] = React.useState<
    UserData[] | undefined
  >(undefined);
  const [currentWishes, setCurrentWishes] = React.useState<
    WishData[] | undefined
  >(undefined);
  const [currentTable, setCurrentTable] = React.useState<string>("users");
  const [updateTableState, setUpdateTableState] =
    React.useState<boolean>(false);

  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState<number>(1);
  const handleSideMenuToggle = () => {
    setIsSideMenuActive((prev) => !prev);
  };

  React.useEffect(() => {
    const fetchCurrentData = async () => {
      try {
        let response: Response | undefined = undefined;
        if (currentTable === "users") {
          const requestParams = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: getAccessCookie()
                ? "Bearer " + getAccessCookie()
                : "",
            },
          };
          response = await requestProvider(
            fetch,
            `/backend/api/admin/users?page=${page}&per_page=${AMOUNT_AT_THE_PAGE}`,
            requestParams
          );
          if (response) {
            const data = await response.json();
            setCurrentUsers(data.users);
          }
        }
        if (currentTable === "wishes") {
          const requestParams = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: getAccessCookie()
                ? "Bearer " + getAccessCookie()
                : "",
            },
          };
          response = await requestProvider(
            fetch,
            `/backend/api/admin/wishlists?page=${page}&per_page=${AMOUNT_AT_THE_PAGE}`,
            requestParams
          );
          if (response) {
            const data = await response.json();
            console.log("object");
            console.log(data);
            data.forEach((item:WishData)=>{
              if (item.image_url) {
                item.image_url += "?alt=media" + `&t=${new Date().getTime()}`;
              }
            });
            console.log(data);
            setCurrentWishes(data);
          }
        }
      } catch (err) {
        setError(
          "Error users fetch by admin" +
            (err instanceof Error ? ": " + err.message : "")
        );
        setCurrentUsers(undefined);
        setCurrentWishes(undefined);
      } finally {
        setLoading(false);
      }
    };
    console.log(currentTable);
    fetchCurrentData();
  }, [currentTable, page, updateTableState]);

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
    console.log(lastName);
    const response = await fetch("/backend/register", requestParams);
    // const data = await response.json();

    if (!response.ok) {
      console.log("DB error");
    } else {
      // setToken(data.access_token);

      console.log("Registration successful");
      navigate("/admin");
    }
  };
  const deleteUser = async (username: string) => {
    const requestParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + getAccessCookie(),
      },
      body: new URLSearchParams({
        user_username: username,
      }),
    };
    try {
      const response = await requestProvider(
        fetch,
        "/backend/api/admin/users/delete",
        requestParams
      );
      if (response.ok) {
        setUpdateTableState((prev) => !prev);
      }
    } catch (err) {}
  };

  const editUser = async (
    prevFirstName: string,
    prevLastName: string | undefined,
    prevUsername: string,
    prevEmail: string,
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ) => {
    const formData = new FormData();
    let formDataIsEmpty = true;
    if (prevFirstName !== firstName) {
      formData.append("first_name", firstName);
      formDataIsEmpty = false;
    }
    if (prevLastName !== lastName) {
      formData.append("last_name", lastName);
      formDataIsEmpty = false;
    }
    if (prevUsername !== username) {
      formData.append("username", username);
      formDataIsEmpty = false;
    }
    if (prevEmail !== email) {
      formData.append("email", email);
      formDataIsEmpty = false;
    }
    if (password) {
      formData.append("new_password", password);
      formDataIsEmpty = false;
    }

    const requestParams = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
      body: formData,
    };
    try {
      if (!formDataIsEmpty) {
        const response = await requestProvider(
          fetch,
          `/backend/api/admin/users/${prevUsername}/edit`,
          requestParams
        );
        const data = await response.json();
        if (currentUsers) {
          const updatedUsers = currentUsers.map((item) => {
            if (item.username === prevUsername) {
              return data;
            } else {
              return item;
            }
          });
          setCurrentUsers(updatedUsers);
        }
      }
    } catch (err) {}
  };

  const editUserAvatar = async (
    deleteUserAvatar: boolean,
    imgBinary?: File,
    username?: string
  ) => {
    let response: Response;
    if (deleteUserAvatar) {
      const requestParams = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + getAccessCookie(),
        },
      };
      response = await fetch(
        `/backend/api/admin/users/${username}/remove_image`,
        requestParams
      );
    } else {
      if (!imgBinary) {
        return;
      }
      const formData = new FormData();
      if (imgBinary) {
        formData.append("image", imgBinary, imgBinary.name);
      }

      const requestParams = {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + getAccessCookie(),
        },
        body: formData,
      };
      response = await fetch(
        `/backend/api/admin/users/${username}/edit`,
        requestParams
      );
    }
    if (response.ok) {
      const data = await response.json();
      if (currentUsers) {
        const updatedUsers = currentUsers.map((item) => {
          if (item.username === username) {
            return data;
          } else {
            return item;
          }
        });
        setCurrentUsers(updatedUsers);
      }
    } else {
    }
  };

  const editWishItem = async (
    wishId: number,
    title?: string,
    description?: string,
    linkToSite?: string,
    imgBinary?: File,
    deleteImage?: boolean
  ) => {
    const formData = new FormData();
    let formIsEmpty = true;
    if (title) {
      formData.append("title", title);
      formIsEmpty = false;
    }
    if (description) {
      formData.append("description", description);
      formIsEmpty = false;
    }
    if (linkToSite) {
      formData.append("link", linkToSite);
      formIsEmpty = false;
    }
    if (imgBinary && !deleteImage) {
      formData.append("image", imgBinary, imgBinary.name);
      formIsEmpty = false;
    }

    const requestParams = {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + getAccessCookie(),
      },
      body: formData,
    };
    let response: Response | undefined = undefined;
    if (!formIsEmpty) {
      response = await fetch(
        `/backend/api/admin/wishlists/${wishId}/edit`,
        requestParams
      );
    }
    if (deleteImage) {
      const requestParams = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + getAccessCookie(),
        },
      };
      response = await fetch(`/backend/api/admin/wishlists/${wishId}/remove_image`, requestParams);
    }
    if (response && response.ok) {
      const data = await response.json();
      if (currentWishes) {
        const updatedWishes = currentWishes.map((item) => {
          if (item.id === wishId) {
            return {...data, image_url: data.image_url ? data.image_url  + "?alt=media" + `&t=${new Date().getTime()}` : data.image_url };
          } else {
            return item;
          }
        });
        setCurrentWishes(updatedWishes);
      }
      // setUpdateWishlist((prevState) => !prevState);
    } else {
      console.log("Don't edit item");
    }
  };

  const deleteWishItem = async (item_id: number) => {
    const requestParams = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAccessCookie(),
      },
    };
    try {
      const response = await requestProvider(
        fetch,
        `/backend/api/admin/wishlists/${item_id}/delete`,
        requestParams
      );
      if (response.ok) {
        setUpdateTableState((prev) => !prev);
      }
    } catch (err) {}
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
        {currentTable === "users" && currentUsers && (
          <AdminUserTable
            currentData={currentUsers}
            registerNewUserFunc={registerUser}
            deleteUserFunc={deleteUser}
            editUserFunc={editUser}
            editUserAvatarFunc={editUserAvatar}
          />
        )}
        {currentTable === "wishes" && currentWishes && (
          <AdminWishTable
            currentData={currentWishes}
            deleteWishItemFunc={deleteWishItem}
            editWishItemFunc={editWishItem}
          />
        )}
        {error && (
          <Flex align="center" justifyContent="center" w="100%" padding={50}>
            <WarningIcon color="red" />
            <Text className="page-text page-reg-text" ml={5}>
              {error}
            </Text>
          </Flex>
        )}
      </AdminMainView>
    </div>
  );
}

export default AdminPage;
