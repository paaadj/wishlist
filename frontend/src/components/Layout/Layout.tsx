import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";

function Layout() {
  return (
    <>
      <main className="container">
        <Outlet />

        <Footer />
      </main>
    </>
  );
}

export default Layout;
