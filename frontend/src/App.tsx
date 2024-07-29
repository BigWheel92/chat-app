import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Login from "components/Login";
import Signup from "components/Signup";
import routes from "constants/routes";
import Verify from "components/Verify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.signup} element={<Signup />} />
        <Route path={routes.verify} element={<Verify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
