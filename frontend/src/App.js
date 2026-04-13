import { BrowserRouter, Routes, Route } from "react-router-dom";

// Login/Register
import Login from "./components/Login";
import Register from "./components/Register";
import "./style/admin.css";
// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Members from "./pages/admin/Members";
import Payments from "./pages/admin/Payments";
import Trainers from "./pages/admin/Trainers";
import Workouts from "./pages/admin/Workouts";
// User Pages
import UserLayout from "./pages/user/UserLayout";
import UserDashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import UserWorkouts from "./pages/user/Workouts";
// Protected
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="payments" element={<Payments />} />
            <Route path="trainers" element={<Trainers />} />
            <Route path="workouts" element={<Workouts />} />
          </Route>
        </Route>
        {/* Protected User */}
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="workouts" element={<UserWorkouts />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
