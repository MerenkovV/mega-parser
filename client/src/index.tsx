/* eslint-disable react/jsx-pascal-case */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store, { StoreContext } from "./store/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <StoreContext.Provider value={new store()}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>
);
