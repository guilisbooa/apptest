import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AdminMain } from "./admin/AdminMain";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminMain />
  </StrictMode>
);
