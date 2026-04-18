import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordRequest } from "../authSlice";
import { useNavigate } from "react-router";

const ForgotPassword = () => {
  const [emailId, setEmailId] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, resetOtpSent } = useSelector(
    (state) => state.auth
  );

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const res = await dispatch(resetPasswordRequest(emailId));

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/reset-password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950">
      <form
        onSubmit={handleSendOtp}
        className="bg-slate-900 p-8 rounded-xl w-100"
      >
        <h2 className="text-white text-2xl font-bold mb-4">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 text-white mb-4"
          required
        />

        {error && <p className="text-red-400">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg"
        >
          {loading ? "Sending OTP..." : "Send Reset OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
