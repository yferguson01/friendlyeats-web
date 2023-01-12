import React from "react";
import ReactDOM from "react-dom/client";
import { FirebaseAppProvider } from "reactfire";

import App from "./App.js";
import "./index.css";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk-u6F9UAesAwj7NQh80Rlr-AHc69UtOY",
  authDomain: "rc-strawberry.firebaseapp.com",
  projectId: "rc-strawberry",
  storageBucket: "rc-strawberry.appspot.com",
  messagingSenderId: "105225960024",
  appId: "1:105225960024:web:a2c70ff84e835a7d22682d",
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>
);
