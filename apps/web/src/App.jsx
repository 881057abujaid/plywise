import { Navigate, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "./stores/auth.store";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Profile from "./pages/profile/Profile";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NewGame from "./pages/game/NewGame";
import Game from "./pages/game/Game";
import Home from "./pages/home/Home";

const App = () => {
  const initializeAuth = useAuthStore(s => s.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Routes>
      <Route path="/auth/login" element={
        <AuthLayout>
          <Login />
        </AuthLayout>}
      />

      <Route path="/auth/signup" element={
        <AuthLayout>
          <Signup />
        </AuthLayout>}
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/game/new" element={<NewGame />} />
        <Route path="/game/:gameId" element={<Game />} />
      </Route>

      <Route path="/" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;