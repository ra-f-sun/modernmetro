import "./index.css";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      {/* Flex container for navigation and main content */}
      <div className="flex h-screen">
        {/* Navigation bar */}
        <Navigation />
        {/* Main content */}
        <main className="flex-grow bg-gray-900 p-6 overflow-y-auto ">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
