import "./App.css";
import Login from "./components/Authentication/Login";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import User from "./components/User/User";
import MainPage from "./pages/MainPage/MainPage";
import Layout from "./components/Layout/Layout";
import AuthenticationPage from "./pages/AuthenticationPage/AuthenticationPage";
import Registration from "./components/Authentication/Registration";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="authentication" element={<AuthenticationPage />}>
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
        </Route>
        <Route path="user" element={<ProtectedRoute component={<User />} />} />
      </Route>
    </Routes>
  );
}

export default App;
