import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { userAuth } from "../../context/UserContext";

interface IProtectedRoute {
  component: ReactElement;
  isAuthenticated: boolean | userAuth;
  rest_props?: object;
}

function ProtectedRoute(props: IProtectedRoute) {
  const { component, isAuthenticated } = props;

  return <>{isAuthenticated ? <>{component}</> : <Navigate to="/" />}</>;
}
export default ProtectedRoute;
