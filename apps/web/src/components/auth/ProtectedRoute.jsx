import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../stores/auth.store";

const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isInitializing = useAuthStore((state) => state.isInitializing);

    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-bg">
                <div className="text-text-secondary">
                    Loading...
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />
    }

    return <Outlet />
};

export default ProtectedRoute;