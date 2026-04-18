import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordConfirm, clearResetState } from "../authSlice";
import { useNavigate } from "react-router";
import {Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { resetEmail, loading, error, resetSuccess, resetMessage } =useSelector((state) => state.auth);

  useEffect(() => {
    if (!resetEmail) {
      navigate("/forgot-password");
    }
  }, [resetEmail, navigate]);
  
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const res = await dispatch(
      resetPasswordConfirm({
        emailId: resetEmail,
        otp,
        newPassword,
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      setTimeout(() => {
        dispatch(clearResetState());
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <form
        onSubmit={handleResetPassword}
        className="bg-slate-900 p-8 rounded-xl w-100"
      >
        <h2 className="text-white text-2xl font-bold mb-4">
          Reset Password
        </h2>

        <p className="text-slate-400 text-sm mb-3">
          OTP sent to: <b>{resetEmail}</b>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 text-white mb-4"
          required
        />
        <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 pr-10 rounded bg-slate-800 text-white"
          required
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500 hover:text-white transition"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        </div>

        {error && <p className="text-red-400">{error}</p>}

        {resetSuccess && (
          <p className="text-green-400">{resetMessage}</p>
        )}

        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
