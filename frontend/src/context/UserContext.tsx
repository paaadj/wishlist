import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export type userAuth = {
  username: string;
  email: string;
};

export type UserContextType = {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  setAuthorizationTokens: (
    access_token: string | undefined,
    refresh_token: string | undefined
  ) => void;
  isAuthenticated: false | userAuth;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = (props: any) => {
  const [refreshToken, setRefreshToken] = useState(Cookies.get("refreshToken"));
  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken"));
  const [isAuthenticated, setIsAuthenticated] = useState<false | userAuth>(
    false
  );
  const fetchUser = async (
    access_token: string | undefined,
    refresh_token: string | undefined
  ) => {
    if (accessToken === undefined && refreshToken === undefined) {
      return false;
    }
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
    const response = await fetch(
      "http://localhost:8000/api/users/me",
      requestParams
    );
    if (!response.ok) {
      const refreshResponse = await fetch(
        "http://localhost:8000/api/refresh_token",
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
        const repeatResponse = await fetch(
          "http://localhost:8000/api/users/me",
          requestParams
        );
        const repeatAuthData = await repeatResponse.json();
        return {
          username: repeatAuthData.username,
          email: repeatAuthData.email,
        };
      }
    } else {
      const authData = await response.json();
      return { username: authData.username, email: authData.email };
    }
  };

  const setAuthorizationTokens = (
    access_token: string | undefined,
    refresh_token: string | undefined
  ) => {
    console.log("authSet1");
    if (access_token === undefined && refresh_token === undefined) {
      console.log("authSetFalse");
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      Cookies.remove("refreshToken", { path: "/" });
      Cookies.remove("accessToken", { path: "/" });
    } else {
      console.log("authSet2");
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      Cookies.set("accessToken", access_token ?? "undefined", { path: "/" });
      Cookies.set("refreshToken", refresh_token ?? "undefined", { path: "/" });
    }
  };
  const checkAuthentication = async () => {
    setIsAuthenticated(await fetchUser(accessToken, refreshToken));
  };

  /*Check the token */
  useEffect(() => {
    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);
  return (
    <UserContext.Provider
      value={{
        accessToken,
        refreshToken,
        setAuthorizationTokens,
        isAuthenticated,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
