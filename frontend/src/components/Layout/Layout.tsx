import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

function Layout() {
  return (
    <>
      <div className="container">
        <Outlet />

        <Footer />
      </div>
    </>
  );
}

export default Layout;
