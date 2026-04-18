import React, { useState } from "react";
import { User, Mail, ShieldCheck, ShieldAlert, LogOut, Camera, Loader2, Lock, Eye, EyeOff, Calendar } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, updateUserProfile, updatePassword } from "../authSlice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, profile, loading, error, passwordMessage } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    age: profile?.age || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const res = await dispatch(updateUserProfile(formData));
    if (res.meta.requestStatus === "fulfilled") {
      setSuccessMsg("Profile Updated Successfully");
      setEditMode(false);
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordUpdate = async () => {
    // Client-side validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }
    const res = await dispatch(updatePassword(passwordData));
    if (res.meta.requestStatus === "fulfilled") {
      alert("Password Updated Successfully, Please login again.");
      setPasswordModal(false);
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  // Format joined date
  const joinedDate = profile?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  // Get solved counts 
  const easySolved = profile?.counts?.easy || 0;
  const mediumSolved = profile?.counts?.medium || 0;
  const hardSolved = profile?.counts?.hard || 0;

  if (loading) {
    return (
      <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="animate-spin size-8 text-blue-500" />
        <p className="animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0f172a] text-slate-200 p-4 overflow-hidden">
      <div className="h-full max-w-6xl mx-auto flex flex-col">
        {/* Header – compact */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome {profile?.firstName}
          </h1>
          <p className="text-gray-400 text-sm">Manage your profile and track progress</p>
        </div>

        {/* Main content – two columns */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-0">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            {/* Row 1: Avatar + Actions + Member Since */}
            <div className="bg-[#1e293b] p-4 rounded-2xl shadow-lg border border-slate-800">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Avatar and name */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="size-20 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-md">
                      {profile?.firstName?.charAt(0) || "U"}
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition">
                      <Camera className="size-4 text-blue-400" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{profile?.firstName} {profile?.lastName}</h2>
                    {profile?.isVerified ? (
                      <p className="text-green-400 flex items-center gap-1 text-xs mt-1">
                        <ShieldCheck size={14} /> Verified
                      </p>
                    ) : (
                      <p className="text-yellow-400 flex items-center gap-1 text-xs mt-1">
                        <ShieldAlert size={14} /> Verification Pending
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPasswordModal(true)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Lock size={14} /> Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-1"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>

              {/* Member Since Card */}
              <div className="mt-4 bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 shadow-sm">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Calendar className="text-blue-400" size={16} />
                  Member Since
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {profile?.createdAt ? new Date(profile?.createdAt).getDate() : "—"}
                    </div>
                    <div className="text-purple-400 text-xs font-semibold">
                      {profile?.createdAt
                        ? new Date(profile?.createdAt).toLocaleString("default", { month: "short" })
                        : ""}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {profile?.createdAt ? new Date(profile?.createdAt).getFullYear() : ""}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p>Joined {joinedDate}</p>
                    <p className="mt-1">Thank you for being part of our community! </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Personal Info Card */}
            <div className="bg-[#1e293b] p-4 rounded-2xl shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-bold flex items-center gap-2">
                  <User size={16} className="text-blue-500" /> Personal Info
                </h3>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs"
                >
                  {editMode ? "Cancel" : "Edit"}
                </button>
              </div>

              {successMsg && <p className="text-green-400 text-xs mb-2">{successMsg}</p>}
              {error && <p className="text-red-400 text-xs mb-2">{error}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-slate-500 uppercase font-bold">First Name</p>
                  {editMode ? (
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full p-1.5 rounded-lg bg-slate-800 mt-1 text-sm"
                    />
                  ) : (
                    <p className="text-sm mt-1">{profile?.firstName}</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase font-bold">Last Name</p>
                  {editMode ? (
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full p-1.5 rounded-lg bg-slate-800 mt-1 text-sm"
                    />
                  ) : (
                    <p className="text-sm mt-1">{profile?.lastName || "Not Added"}</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase font-bold">Age</p>
                  {editMode ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full p-1.5 rounded-lg bg-slate-800 mt-1 text-sm"
                    />
                  ) : (
                    <p className="text-sm mt-1">{profile?.age || "Not Added"}</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase font-bold">Email</p>
                  <p className="text-sm mt-1 flex items-center gap-1">
                    <Mail size={14} /> {profile?.emailId}
                  </p>
                </div>
              </div>

              {editMode && (
                <button
                  onClick={handleUpdate}
                  className="w-full mt-4 bg-green-600 hover:bg-green-500 py-1.5 rounded-xl font-bold text-sm"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Right column: Coding Progress – dynamic difficulty counts */}
          <div className="bg-[#1e293b] rounded-xl p-3 shadow-xl border border-slate-800 flex flex-col justify-between h-60">
            <div>
              <h3 className="text-base font-semibold text-white mb-2"> Coding Progress</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                    <span>Mastery</span>
                    {/* <span>{Math.min(((profile?.problemsSolvedCount || 0) / 100) * 100, 100)}%</span> */}
                    <span>
                      {(profile?.totalProblems? Math.min((profile?.problemsSolvedCount / profile?.totalProblems) * 100, 100): 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-linear-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                      style={{width: `${ Math.min(profile?.totalProblems? (profile?.problemsSolvedCount / profile?.totalProblems) * 100: 0,100)}%`}}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-1.5 bg-gray-900/30 rounded">
                    <div className="text-green-400 font-bold text-lg">{easySolved}</div>
                    <div className="text-gray-400 text-[10px]">Easy</div>
                  </div>
                  <div className="p-1.5 bg-gray-900/30 rounded">
                    <div className="text-yellow-400 font-bold text-lg">{mediumSolved}</div>
                    <div className="text-gray-400 text-[10px]">Medium</div>
                  </div>
                  <div className="p-1.5 bg-gray-900/30 rounded">
                    <div className="text-red-400 font-bold text-lg">{hardSolved}</div>
                    <div className="text-gray-400 text-[10px]">Hard</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 pt-1.5 border-t border-slate-800 text-center text-xs text-gray-500">
               {profile?.problemsSolvedCount || 0} / {profile?.totalProblems || 0} problems solved
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[#1e293b] w-96 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-5 text-white">Update Password</h2>
            <div className="mb-4">
              <label className="block text-sm text-white mb-1 font-medium">Old Password</label>
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  placeholder="Enter old password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2.5 rounded bg-slate-800 pr-10 text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button onClick={() => setShowOld(!showOld)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-white mb-1 font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2.5 rounded bg-slate-800 pr-10 text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button onClick={() => setShowNew(!showNew)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm text-white mb-1 font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2.5 rounded bg-slate-800 pr-10 text-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button onClick={() => setShowConfirm(!showConfirm)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handlePasswordUpdate} className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl font-bold text-white text-sm">
                Update Password
              </button>
              <button onClick={() => setPasswordModal(false)} className="w-full bg-slate-700 hover:bg-slate-600 py-2.5 rounded-xl text-white text-sm">
                Cancel
              </button>
            </div>
            {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;