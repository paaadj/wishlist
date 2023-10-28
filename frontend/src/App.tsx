import { useContext } from "react";
import "./App.css";
import Registration from "./components/Registration/Registration";
import { UserContext, UserContextType } from "./context/UserContext";
import Login from "./components/Login/Login";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import User from "./components/User/User";
import MainPage from "./pages/MainPage/MainPage";
import Layout from "./components/Layout/Layout";
import AuthenticationPage from "./pages/AuthenticationPage/AuthenticationPage";

function App() {
  const { isAuthenticated } = useContext(UserContext) as UserContextType;

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="authentication" element={<AuthenticationPage />}>
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
        </Route>
        <Route
          path="user"
          element={
            <ProtectedRoute
              component={<User />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
