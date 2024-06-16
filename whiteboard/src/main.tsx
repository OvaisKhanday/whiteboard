// import { ReactKeycloakProvider } from "@react-keycloak/web";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
// import keycloak from "./keycloak.ts";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WhiteboardScreen from "./components/WhiteboardScreen.tsx";
import keycloak from "./keycloak.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    onEvent={console.log}
    LoadingComponent={
      <div>
        <h1>Authenticating...</h1>
        <p>we can't move forward if the authentication failed</p>
      </div>
    }
    initOptions={{ onLoad: "login-required" }}
  >
    {/* <React.StrictMode> */}
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<App />} />
          <Route path='/whiteboard' element={<WhiteboardScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </ReactKeycloakProvider>
);
