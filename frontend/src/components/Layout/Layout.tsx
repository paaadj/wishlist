import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

function Layout() {
  return (
    <>
      <main className="container">
        <Header />

        <Outlet />

        <Footer />
      </main>
    </>
  );
}

export default Layout;
