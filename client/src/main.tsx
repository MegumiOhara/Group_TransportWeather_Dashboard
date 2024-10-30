import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GlobalLoadingProvider } from "./components/LoaderContext";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <GlobalLoadingProvider>
         <App />
      </GlobalLoadingProvider>
   </StrictMode>
);
