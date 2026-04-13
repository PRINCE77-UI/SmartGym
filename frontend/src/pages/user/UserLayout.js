import UserSidebar from "../../components/UserSidebar";
import UserNavbar from "../../components/UserNavbar";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <UserSidebar />

      {/* Main content */}
      <div style={{ flex: 1 }}>
        <UserNavbar />

        {/* Pages yaha change honge */}
        <Outlet />
      </div>

    </div>
  );
}

export default UserLayout;