import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import routes from "./constants/routes";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.signup} element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
