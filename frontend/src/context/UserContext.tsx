import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

// export type userAuth = {
//   username: string;
//   email: string;
// };

export type userData = {
  firstName: string,
  lastName?: string,
  username: string,
  email: string
};

export type UserContextType = {
  setAuthorizationTokens: (
    access_token: string | undefined,
    refresh_token: string | undefined
  ) => void;
  isAuthenticated: boolean;
  getAccessCookie: () => string | undefined;
  tryRefreshToken: () => Promise<boolean>
  setAuthentication: (value: boolean) => void
  user: userData | undefined;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = (props: any) => {
  const [refreshToken, setRefreshToken] = useState(Cookies.get("refreshToken"));
  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<userData | undefined>(undefined);
  const tryRefreshToken = async () => {
    if (refreshToken === undefined) {
      return false;
    }
    console.log(refreshToken);
    const requestRefreshParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: `${refreshToken}`
      },
      // body: JSON.stringify({ token : refreshToken }),
      // body: `token=${refreshToken}`
    };
    const refreshResponse = await fetch(
      "http://127.0.0.1:8000/refresh_token",
      requestRefreshParams
    );
    if (!refreshResponse.ok) {
      await setAuthorizationTokens(undefined, undefined);
      return false;
    } else {
      const refreshData = await refreshResponse.json();
      await setAuthorizationTokens(
        refreshData.access_token ?? undefined,
        refreshData.refresh_token ?? undefined
      );
      return true;
    }
  };

  const fetchUser = async()=> {
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAccessCookie(),
      },
    };
    const response = await fetch("/backend/users/me", requestParams);
    const data = await response.json()
    setUser( {
      firstName: data.first_name,
      lastName: data?.first_name ?? "",
      username: data.username,
      email: data.email,
    });
  }

  // const fetchUser = async () => {
  //   if (accessToken === undefined && refreshToken === undefined) {
  //     return false;
  //   }
  //   const requestParams = {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + accessToken,
  //     },
  //   };

  //   const response = await fetch("/backend/users/me", requestParams);
  //   if (response.ok) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const setAuthorizationTokens = async(
    access_token: string | undefined,
    refresh_token: string | undefined
  ) => {


    if (access_token === undefined && refresh_token === undefined) {
      removeCookies();
    } else {
      setCookies(access_token, refresh_token);
    }
    await setAccessToken(access_token);
    await setRefreshToken(refresh_token);
    
    
  };

  const getAccessCookie = ()=>{
    return Cookies.get('accessToken')
  }

  const setCookies = (access_token: string | undefined,
    refresh_token: string | undefined) => {
    Cookies.set("accessToken", access_token ?? "undefined", { path: "/" });
    Cookies.set("refreshToken", refresh_token ?? "undefined", { path: "/" });
  };
  const removeCookies = () => {
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("accessToken", { path: "/" });
  };

  
  const setAuthentication = (value: boolean)=>{
    setIsAuthenticated(value);
  }


  /*Check the token */
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);
  return (
    <UserContext.Provider
      value={{
        setAuthorizationTokens,
        isAuthenticated,
        getAccessCookie,
        tryRefreshToken,
        setAuthentication,
        user
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
