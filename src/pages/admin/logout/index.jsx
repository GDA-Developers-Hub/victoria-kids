import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../utils/authService";

const AdminLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = () => {
      // Logout the user
      authService.logout();
      
      // Redirect to admin login page
      navigate("/admin/login");
    };

    performLogout();
  }, [navigate]);

  // Return a loading state while logout and redirect is happening
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-[#e91e63] border-t-transparent"></div>
        <p className="text-lg font-medium">Logging out...</p>
      </div>
    </div>
  );
};

export default AdminLogout;
