import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router.ts";
import Loader from "./components/ui/loader.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      }>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </StrictMode>
);
