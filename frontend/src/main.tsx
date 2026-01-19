import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router.ts";
import Loader from "./components/ui/loader.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    }>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
