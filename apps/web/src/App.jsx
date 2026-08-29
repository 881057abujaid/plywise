import { Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthLayout from "./components/layout/AuthLayout";

const App = () => {
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

      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default App;