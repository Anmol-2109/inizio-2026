import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/apiClient";
import useAuthStore from "../store/useAuthStore";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [params] = useSearchParams();
  const email = params.get("email");
  const navigate = useNavigate();

  const verify = async () => {
    if (!email) {
      alert("Email is required. Please register again.");
      navigate("/register");
      return;
    }
    
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      // Backend expects 'code' not 'otp'
      const res = await api.post("/auth/verify-otp/", { email, code: otp });
      
      // If verification successful, the backend returns tokens
      if (res.data.access) {
        const { setAuth } = useAuthStore.getState();
        setAuth({
          access: res.data.access,
          refresh: res.data.refresh,
          profileComplete: res.data.profile_complete,
          isStaff: res.data.is_staff || false
        });
        navigate(res.data.profile_complete ? "/" : "/complete-profile");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert(error.response?.data?.detail || error.response?.data?.error || "Invalid OTP. Please try again.");
    }
  };

  const resend = async () => {
    if (!email) {
      alert("Email is required. Please register again.");
      navigate("/register");
      return;
    }

    try {
      await api.post("/auth/resend-otp/", { email });
      alert("OTP resent to your email");
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert(error.response?.data?.error || "Failed to resend OTP. Please try again.");
    }
  };

  return (
    <>
      <h2>Verify OTP</h2>
      {email && <p>Verifying email: {email}</p>}
      <input 
        placeholder="Enter 6-digit OTP" 
        value={otp}
        onChange={e=>setOtp(e.target.value)}
        maxLength={6}
      />
      <button onClick={verify}>Verify</button>
      <button onClick={resend}>Resend OTP</button>
    </>
  );
}
