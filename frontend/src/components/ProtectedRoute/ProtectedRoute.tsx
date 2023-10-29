import { ReactElement, useContext, useEffect } from "react";
import { UserContext, UserContextType } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

interface IProtectedRoute {
  component: ReactElement;
  rest_props?: object;
}

function ProtectedRoute(props: IProtectedRoute) {
  const { component } = props;
  const navigate = useNavigate();
  const {
    getAccessCookie,
    tryRefreshToken,
    isAuthenticated,
    setAuthentication,
  } = useContext(UserContext) as UserContextType;
  useEffect(() => {
    setAuthentication(getAccessCookie());
    if (!getAccessCookie()) {
      tryRefreshToken()
        .then((res) => {
          setAuthentication(res);
          return res;
        })
        .then((res) => {
          if (!res) {
            navigate("/");
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isAuthenticated ? <>{component}</> : <h1>Loading</h1>}
    </>
  );
}
export default ProtectedRoute;
