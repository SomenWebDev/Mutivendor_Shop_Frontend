// pages/customer/SocialSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SocialSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const user = jwtDecode(token);
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div className="text-center mt-10">Signing you in...</div>;
};

export default SocialSuccess;
