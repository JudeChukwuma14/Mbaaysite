import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { mainRouter } from "./router/mainRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store, { persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { DarkModeProvider } from "./components/Context/DarkModeContext";
import { I18nextProvider } from "react-i18next";
import i18next from './utils/i18n';

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <I18nextProvider i18n={i18next}>
        <ToastContainer position="bottom-right" autoClose={5000} />
        <DarkModeProvider>
          <RouterProvider router={mainRouter} />
        </DarkModeProvider>
      </I18nextProvider>
    </PersistGate>
  </Provider>
);
