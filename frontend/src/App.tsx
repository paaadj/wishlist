import "./App.css";
import Login from "./components/Authentication/Login";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MainPage from "./pages/MainPage/MainPage";
import Layout from "./components/Layout/Layout";
import AuthenticationPage from "./pages/AuthenticationPage/AuthenticationPage";
import Registration from "./components/Authentication/Registration";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="authentication" element={<AuthenticationPage />}>
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
        </Route>
        <Route path="user/me" element={<ProtectedRoute component={<UserProfilePage self={true}/>} />} />
        <Route path="user/:username" element={<UserProfilePage self={false}/>}/>
      </Route>
    </Routes>
  );
}

export default App;
