// import { createRoot } from "react-dom/client";
// import "./index.css";
// import { RouterProvider } from "react-router-dom";
// import { mainRouter } from "./router/mainRouter";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import store, { persistor } from "./redux/store";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { DarkModeProvider } from "./components/Context/DarkModeContext";
// import { I18nextProvider } from "react-i18next";
// import i18next from './utils/i18n';

// createRoot(document.getElementById("root")!).render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <I18nextProvider i18n={i18next}>
//         <ToastContainer position="bottom-right" autoClose={5000} />
//         <DarkModeProvider>
//           <RouterProvider router={mainRouter} />
//         </DarkModeProvider>
//       </I18nextProvider>
//     </PersistGate>
//   </Provider>
// );


// import { createRoot } from "react-dom/client";
// import { RouterProvider } from "react-router-dom";
// import { mainRouter } from "./router/mainRouter";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import store, { persistor } from "./redux/store";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { DarkModeProvider } from "./components/Context/DarkModeContext";
// import { I18nextProvider } from "react-i18next";
// import i18next from "./utils/i18n";
// import ErrorBoundary from "./components/Error/ErrorBoundary";
// import "./index.css";

// createRoot(document.getElementById("root")!).render(
  
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <I18nextProvider i18n={i18next}>
//         <ErrorBoundary
//           fallback={
//             <div className="p-4 text-center text-red-600">
//               <h1 className="text-xl font-bold">Something went wrong.</h1>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="px-4 py-2 mt-4 text-white bg-orange-500 rounded hover:bg-orange-600"
//               >
//                 Refresh Page
//               </button>
//             </div>
//           }
//         >
//           <ToastContainer position="bottom-right" autoClose={5000} />
//           <DarkModeProvider>
//             <RouterProvider router={mainRouter} />
//           </DarkModeProvider>
//         </ErrorBoundary>
//       </I18nextProvider>
//     </PersistGate>
//   </Provider>
// );


import React from "react";
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
import "./index.css";
import { useInitializeSettings } from "./hook/useInitializeSettings";

const Root: React.FC = () => {
  useInitializeSettings(); // Call hook in component

  return (
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
      <ToastContainer position="bottom-right" autoClose={5000} />
      <DarkModeProvider>
        <RouterProvider router={mainRouter} />
      </DarkModeProvider>
    </ErrorBoundary>
  );
};

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <I18nextProvider i18n={i18next}>
        <Root />
      </I18nextProvider>
    </PersistGate>
  </Provider>
);