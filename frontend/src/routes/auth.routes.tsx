import { Routes, Route } from "react-router-dom";

import SignUp from "../pages/SignUp";
import Login from "../pages/Login";

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
