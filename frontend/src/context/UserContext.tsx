import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

// export type userAuth = {
//   username: string;
//   email: string;
// };

export type userData = {
  id: number;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  imgUrl?: string;
};

export type UserContextType = {
  setAuthorizationTokens: (
    access_token: string | undefined,
    refresh_token: string | undefined
  ) => void;
  isAuthenticated: boolean;
  getAccessCookie: () => string | undefined;
  tryRefreshToken: () => Promise<boolean>;
  setAuthentication: (value: boolean) => void;
  user: userData | undefined;
  setUser: React.Dispatch<React.SetStateAction<userData | undefined>>;
  requestProvider: (
    func: (
      input: RequestInfo | URL,
      init?: RequestInit | undefined
    ) => Promise<Response>,
    path: string,
    requestParams: object
  ) => Promise<Response>;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = (props: any) => {
  const [refreshToken, setRefreshToken] = useState(Cookies.get("refreshToken"));
  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<userData | undefined>(undefined);
  const baseImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/wishlist-f1b1e.appspot.com/o/";
  const fixImageUrl = (url: string | undefined) => {
    return url ? url.replace("/", "%2F") : url;
  };

  const requestProvider = async (
    func: (
      input: RequestInfo | URL,
      init?: RequestInit | undefined
    ) => Promise<Response>,
    path: string,
    requestParams: object
  ) => {
    try {
      const response = await func(path, requestParams);
      if (response.status == 403) {
        const refreshState = await tryRefreshToken();
        if (refreshState === true) {
          try {
            const response = await func(path, requestParams);
            if (response.ok) {
              return response;
            } else {
              throw new Error("Cannot refresh user");
            }
          } catch (err) {
            throw new Error("Cannot fetch request");
          }
        }
      }
      if (response.ok) {
        return response;
      } else {
        throw new Error("Cannot fetch request");
      }
    } catch (err) {
      throw new Error("Cannot fetch request");
    }
  };

  const tryRefreshToken = async () => {
    if (refreshToken === undefined) {
      return false;
    }
    const requestRefreshParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: `${refreshToken}`,
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

  const fetchUser = async () => {
    if (!getAccessCookie()) {
      setUser(undefined);
      return;
    }
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getAccessCookie(),
      },
    };
    try {
      const response = await fetch("/backend/users/me", requestParams);
      if (!response.ok) {
        throw new Error("Cannot fetch user");
      }
      const data = await response.json();
      console.log(data.image_url);
      setUser({
        id: data.id,
        firstName: data.first_name,
        lastName: data?.last_name ?? "",
        username: data.username,
        email: data.email,
        imgUrl: baseImageUrl + fixImageUrl(data?.image_url) + "?alt=media",
      });
    } catch (err) {
      try {
        const refreshResponse = await tryRefreshToken();
        if (!refreshResponse) {
          throw new Error("Cannot refresh user");
        }
      } catch (err) {
        return;
      }
    }
  };

  const setAuthorizationTokens = async (
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

  const getAccessCookie = () => {
    return Cookies.get("accessToken");
  };

  const setCookies = (
    access_token: string | undefined,
    refresh_token: string | undefined
  ) => {
    Cookies.set("accessToken", access_token ?? "undefined", { path: "/" });
    Cookies.set("refreshToken", refresh_token ?? "undefined", { path: "/" });
  };
  const removeCookies = () => {
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("accessToken", { path: "/" });
  };

  const setAuthentication = (value: boolean) => {
    setIsAuthenticated(value);
  };

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
        user,
        setUser,
        requestProvider,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
