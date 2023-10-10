import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';

export type UserContextType = {
  accessToken: string | undefined;
  setAccessToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  refreshToken: string | undefined;
  setRefreshToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  fetchUser: (access_token: string | undefined, refresh_token: string | undefined) => Promise<void>
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = (props: any) => {
  const [refreshToken, setRefreshToken] = useState(
    Cookies.get("refreshToken")
  );
  const [accessToken, setAccessToken] = useState(
    Cookies.get("accessToken")
  );
  
  const fetchUser = async (access_token: string | undefined, refresh_token: string | undefined) => {
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    };
    const requestRefreshParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refresh_token }),
    };
    const response = await fetch("http://localhost:8000/api/users/me", requestParams);
    if (!response.ok) {
      const refreshResponse = await fetch(
        "http://localhost:8000/api/refresh_token",
        requestRefreshParams
      );
      if (!refreshResponse.ok) {
        setRefreshToken(undefined);
        setAccessToken(undefined);
      } else {
        const refreshData = await refreshResponse.json();
        Cookies.set("accessToken", refreshData.access_token ?? undefined)
        Cookies.set("refreshToken", refreshData.refresh_token ?? undefined)
        // localStorage.setItem(
        //   "accessToken",
        //   refreshData.access_token ?? "null"
        // );
        // localStorage.setItem(
        //   "refreshToken",
        //   refreshData.refresh_token ?? "null"
        // );
      }
    } else {
      Cookies.set("accessToken", access_token ?? "undefined")
      Cookies.set("refreshToken", refresh_token ?? "undefined")
      // localStorage.setItem("accessToken", access_token ?? "null");
      // localStorage.setItem("refreshToken", refresh_token ?? "null");
    }
  };

  /*Check the token */
  // useEffect(() => {
  //   fetchUser(accessToken, refreshToken);
  // }, [accessToken, refreshToken]);
  return (
    <UserContext.Provider
      value={{ accessToken, setAccessToken, refreshToken, setRefreshToken, fetchUser }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
