import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import {
  useFirebaseApp,
  AuthProvider,
  FirestoreProvider,
  StorageProvider,
} from "reactfire";

import Home from "./components/Home";
import Restaurant from "./components/Restaurant";
import "./App.scss";

function App() {
  const app = useFirebaseApp();

  const authInstance = getAuth(app);
  const firestoreInstance = getFirestore(app);
  const storageInstance = getStorage(app);

  if (process.env.NODE_ENV !== "production") {
    // Set up emulators
    connectAuthEmulator(authInstance, "http://localhost:9099");
    connectFirestoreEmulator(firestoreInstance, "localhost", 8080);
    connectStorageEmulator(storageInstance, "localhost", 9199);
  }

  return (
    <div className="App">
      <AuthProvider sdk={authInstance}>
        <FirestoreProvider sdk={firestoreInstance}>
          <StorageProvider sdk={storageInstance}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/setup" element={null} />
                <Route path="/restaurants/:id" element={<Restaurant />} />
              </Routes>
            </BrowserRouter>
          </StorageProvider>
        </FirestoreProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
