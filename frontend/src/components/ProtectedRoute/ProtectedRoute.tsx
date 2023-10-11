import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

interface IProtectedRoute {
  component: ReactElement;
  isAuthenticated: boolean;
  rest_props?: object;
}

function ProtectedRoute(props: IProtectedRoute) {
  const { component, isAuthenticated } = props;

  return <>{isAuthenticated ? <>{component}</> : <Navigate to="/" />}</>;
}
export default ProtectedRoute;
