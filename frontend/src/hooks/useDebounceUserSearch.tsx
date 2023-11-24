import { useEffect, useState } from "react";
import { userData } from "../context/UserContext";

function useDebounceUserSearch(
  username: string,
  userId: number | undefined,
  delay: number = 250
): userData[] | undefined {
  const [debouncedSearch, setDebouncedSearch] = useState<
    userData[] | undefined
  >(undefined);

  useEffect(() => {
    const fetchSearchedUsers = async () => {
      const requestParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (username) {
        const response = await fetch(
          `/backend/users/like?username=${username}&page=${1}&per_page=${10}`,
          requestParams
        );
        if (response.ok) {
          const data = await response.json();
          setDebouncedSearch(data);
        } else {
          setDebouncedSearch(undefined);
        }
      }
    };
    const handler = setTimeout(() => {
      if (username) {
        fetchSearchedUsers();
      }
      else{
        setDebouncedSearch(undefined)
      }
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [username, delay]);

  if(userId && debouncedSearch){
    return debouncedSearch.filter((item) => item.id != userId);
  }
  else{
  return debouncedSearch;}
}

export default useDebounceUserSearch;
