import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../../utils/adminService";
import { toast } from "../../../utils/api";

function AdminLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await adminService.logout();
        toast.success("Logged out successfully");
        
        // Redirect to login page after logout
        setTimeout(() => {
          navigate("/admin/login");
        }, 1000);
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Failed to logout");
        
        // Redirect back to dashboard on error
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      }
    };

    // Execute logout when component mounts
    handleLogout();
  }, [navigate]);

  return (
    <div className="flex h-[calc(100vh-16rem)] flex-col items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="mt-4 text-muted-foreground">Logging out...</p>
    </div>
  );
}

export default AdminLogout;
