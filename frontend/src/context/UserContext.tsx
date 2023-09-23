import { createContext, useEffect, useState } from "react";

export type UserContextType = {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = (props: any) => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  /*Check the token */
  useEffect(() => {
    const fetchUser = async () => {
      const requestParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch("/api/auth", requestParams);
      if (!response.ok) {
        setToken(null);
      } else localStorage.setItem("authToken", token ?? "null");
    };
    fetchUser();
  }, [token]);
  return (
    <UserContext.Provider value={{ token, setToken }}>
      {props.children}
    </UserContext.Provider>
  );
};
