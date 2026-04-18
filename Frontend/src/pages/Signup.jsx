import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Lock, ArrowRight, KeyRound, AlertCircle, Loader2, Eye, EyeOff} from "lucide-react";
import { Link, useNavigate } from "react-router";

import {registerUser,verifyOtp,resendOtp,clearError,resetOtpStep,} from "../authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const { isAuthenticated, loading, error, isOtpSent } = useSelector(
    (state) => state.auth
  );

  // Local States
  const [showPassword, setShowPassword] = useState(false);

  // Resend OTP Timer
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);

  // React Hook Form
  const { register, handleSubmit, watch, formState: { errors },} = useForm({
    defaultValues: {
      firstName: "",
      emailId: "",
      password: "",
      otp: "",
    },
  });

  // Watch Email Value
  const emailValue = watch("emailId");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // OTP Timer Countdown
  useEffect(() => {
    if (isOtpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    if (timer === 0) {
      setCanResend(true);
    }
  }, [isOtpSent, timer]);

  // Register Submit
  const onRegisterSubmit = (data) => {
    dispatch(clearError());

    dispatch(
      registerUser({
        firstName: data.firstName,
        emailId: data.emailId,
        password: data.password,
      })
    );

    // Reset timer when OTP screen opens
    setTimer(59);
    setCanResend(false);
  };

  // OTP Verify Submit
  const onVerifySubmit = (data) => {
    dispatch(clearError());

    dispatch(verifyOtp({ emailId: data.emailId, otp: data.otp })).then(
      (res) => {
        if (res.meta.requestStatus === "fulfilled") {
          alert("Email verified successfully ");
          navigate("/");
        }
      }
    );
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    dispatch(clearError());

    const res = await dispatch(resendOtp(emailValue));

    if (res.meta.requestStatus === "fulfilled") {
      setTimer(59);
      setCanResend(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-slate-200">
      <div className="max-w-md w-full bg-[#1e293b] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 relative">
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {/* ================= REGISTER FORM ================= */}
          {!isOtpSent ? (
            <form
              onSubmit={handleSubmit(onRegisterSubmit)}
              className="space-y-6"
            >
              <header className="mb-8 text-center">
                <h2 className="text-3xl font-bold">Create Account</h2>
                <p className="text-slate-400 text-sm mt-2">
                  Join us to get started
                </p>
              </header>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                  <AlertCircle className="size-4" />
                  {error}
                </div>
              )}

              {/* First Name */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">
                  First Name
                </label>
                <div
                  className={`flex items-center border-b ${
                    errors.firstName ? "border-red-500" : "border-slate-600"
                  } py-2`}
                >
                  <User className="size-5 text-slate-500 mr-3" />
                  <input
                    {...register("firstName", {
                      required: "Name is required",
                    })}
                    className="bg-transparent outline-none w-full placeholder:text-slate-700"
                    placeholder="Enter your name"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-[10px] text-red-500 ml-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div
                  className={`flex items-center border-b ${
                    errors.emailId ? "border-red-500" : "border-slate-600"
                  } py-2`}
                >
                  <Mail className="size-5 text-slate-500 mr-3" />
                  <input
                    {...register("emailId", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email",
                      },
                    })}
                    className="bg-transparent outline-none w-full placeholder:text-slate-700"
                    placeholder="name@company.com"
                  />
                </div>
                {errors.emailId && (
                  <p className="text-[10px] text-red-500 ml-1">
                    {errors.emailId.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">
                  Password
                </label>

                <div
                  className={`relative flex items-center border-b ${
                    errors.password ? "border-red-500" : "border-slate-600"
                  } py-2`}
                >
                  <Lock className="size-5 text-slate-500 mr-3" />

                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Min 6 characters",
                      },
                    })}
                    className="bg-transparent outline-none w-full pr-10 placeholder:text-slate-700"
                    placeholder="••••••••"
                  />

                  {/* Eye Icon */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 text-slate-500 hover:text-white transition"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-[10px] text-red-500 ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin size-5" />
                ) : (
                  <>
                    Get Started <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= OTP VERIFICATION ================= */
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <div className="inline-flex p-4 bg-blue-500/10 rounded-full mb-6 text-blue-500">
                <KeyRound className="size-10" />
              </div>

              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-slate-400 mb-8 text-sm">
                We've sent a code to <br />
                <span className="text-blue-400 font-medium">
                  {emailValue}
                </span>
              </p>

              {/* OTP Form */}
              <form onSubmit={handleSubmit(onVerifySubmit)}>
                <input
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: 6,
                  })}
                  maxLength="6"
                  className="w-full bg-slate-800/50 border border-slate-700 text-center text-4xl font-mono py-4 rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-blue-500 tracking-[0.2em]"
                  placeholder="000000"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold shadow-lg flex justify-center"
                >
                  {loading ? (
                    <Loader2 className="animate-spin size-6" />
                  ) : (
                    "Verify Account"
                  )}
                </button>
              </form>

              {/* Resend OTP */}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  disabled={!canResend || loading}
                  onClick={handleResendOtp}
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300 disabled:text-slate-500 disabled:cursor-not-allowed transition"
                >
                  {canResend
                    ? "Resend OTP"
                    : `Resend OTP in ${timer}s`}
                </button>

                {/* Back Button */}
                <button
                  onClick={() => dispatch(resetOtpStep())}
                  className="block mx-auto text-slate-500 text-sm hover:text-slate-300 transition underline underline-offset-4"
                >
                  Did we get the email wrong? Go back
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?
              <Link
                to="/login"
                className="text-blue-500 font-bold hover:text-blue-400 ml-2 transition"
              >
                Log In
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Signup;
