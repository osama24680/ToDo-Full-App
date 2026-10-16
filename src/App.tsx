import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#15152a",
            color: "#e2e8f0",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "14px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#22d3ee", secondary: "#0b0b1a" } },
          error: { iconTheme: { primary: "#f43f5e", secondary: "#0b0b1a" } },
        }}
      />
    </>
  );
};

export default App;
