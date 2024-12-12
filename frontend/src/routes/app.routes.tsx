import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Patients from "../pages/Patients/Patients";
import Patient from "@/pages/Patients/Patient";
import Schedules from "@/pages/Schedules";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/patient" element={<Patient />} />
      <Route path="/patient/:id" element={<Patient />} />
      <Route path="/schedules" element={<Schedules />} />
    </Routes>
  );
}
