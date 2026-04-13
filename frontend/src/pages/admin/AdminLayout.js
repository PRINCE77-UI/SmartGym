import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar left */}
      <Sidebar />

      {/* Right side content */}
      <div style={{ flex: 1 }}>
        <Navbar />

        {/* Yaha pages change honge */}
        <Outlet />
      </div>

    </div>
  );
}

export default AdminLayout;