import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MainPage from "./pages/MainPage/MainPage";
import Layout from "./components/Layout/Layout";
import AuthenticationPage from "./pages/AuthenticationPage/AuthenticationPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import AdminPage from "./pages/AdminPage/AdminPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="admin" element={<AdminPage />} />

        <Route
          path="login"
          element={<AuthenticationPage login={true} registraion={false} />}
        />
        <Route
          path="registration"
          element={<AuthenticationPage login={false} registraion={true} />}
        />

        <Route
          path="user/me"
          element={
            <ProtectedRoute component={<UserProfilePage self={true} />} />
          }
        />
        <Route
          path="user/:username"
          element={<UserProfilePage self={false} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
