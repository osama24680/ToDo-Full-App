import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  const userDataString = localStorage.getItem("loggedInUser");
  const isLoggedIn = Boolean(userDataString);

  // guests only ever see the full-screen auth pages
  if (!isLoggedIn) return <Outlet />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
