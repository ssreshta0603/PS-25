import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ShowProfile from "./pages/ShowProfile";
import GetStarted from "./pages/getstarted";
import Login from "./pages/Login";
import CreateAccount from "./pages/createaccount";
import Profile from "./pages/Profile";
import AdminDashboard from "./Admin/admin";
//import Profile from "./pages/Profile";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CreateAccount />} />

        {/* Dashboard with nested pages */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile/:name" element={<ShowProfile />} />
        </Route>
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
