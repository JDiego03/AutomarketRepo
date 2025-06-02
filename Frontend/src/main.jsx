import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Theme } from "@radix-ui/themes";
import { BrowserRouter } from "react-router-dom";
import { FilterContextProvider } from "./context/filterContext";
import { UserContextProvider } from "./context/userContext";

createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <FilterContextProvider>
      <BrowserRouter>
        <Theme>
          <App />
        </Theme>
      </BrowserRouter>
    </FilterContextProvider>
  </UserContextProvider>
);
