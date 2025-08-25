import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { mainRouter } from "./router/mainRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store, { persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { DarkModeProvider } from "./components/Context/DarkModeContext";
import { I18nextProvider } from "react-i18next";
import i18next from "./utils/i18n";
import ErrorBoundary from "./components/Error/ErrorBoundary";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

// Replace with your Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "625711431090-8p1bbgs1hra8rg4mgjq6vrqr73gchds4.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <I18nextProvider i18n={i18next}>
        <ErrorBoundary
          fallback={
            <div className="p-4 text-center text-red-600">
              <h1 className="text-xl font-bold">Something went wrong.</h1>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 mt-4 text-white bg-orange-500 rounded hover:bg-orange-600"
              >
                Refresh Page
              </button>
            </div>
          }
        >
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <ToastContainer position="bottom-right" autoClose={5000} />
            <DarkModeProvider>
              <RouterProvider router={mainRouter} />
            </DarkModeProvider>
          </GoogleOAuthProvider>
        </ErrorBoundary>
      </I18nextProvider>
    </PersistGate>
  </Provider>
);