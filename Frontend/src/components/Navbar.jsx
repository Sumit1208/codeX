import React, { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, Settings, Code2,  ShieldCheck } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../authSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Redux State
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logoutUser());
      setIsOpen(false);
      setIsProfileOpen(false);
      navigate("/login");
  };

  return (
    <nav className="bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 shrink-0">
          <div className="p-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            codeX
          </span>
        </NavLink>

          {/* Centered Navigation (desktop only) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-8 mx-8 flex-1 justify-center">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-400' 
                    : 'text-gray-300 hover:text-blue-400'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/problems" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-400' 
                    : 'text-gray-300 hover:text-blue-400'
                }`
              }
            >
              Problems
            </NavLink>
            <NavLink 
              to="/challenges" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-400' 
                    : 'text-gray-300 hover:text-blue-400'
                }`
              }
            >
              Challenges
            </NavLink>
            <NavLink 
              to="/community" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-400' 
                    : 'text-gray-300 hover:text-blue-400'
                }`
              }
            >
              Community
            </NavLink>
          </nav>
        )}

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            
            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                {/* Profile Button */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 py-1.5 px-3 rounded-full border border-slate-700 transition-all"
                >
                  <div className="size-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm text-slate-200">
                    {user?.firstName}
                  </span>
                </button>

                {/* Dropdown */}
                {isProfileOpen && (
                  <>
                    {/* Overlay */}
                    <div
                      className="fixed inset-0"
                      onClick={() => setIsProfileOpen(false)}
                    ></div>

                    <div className="absolute right-0 mt-3 w-48 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                      <NavLink
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <LayoutDashboard className="size-4" /> Profile
                      </NavLink>

                      {user?.role === "admin" && (
                        <NavLink
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          <ShieldCheck className="size-4" /> Admin Dashboard
                        </NavLink>
                      )}


                      <NavLink
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Settings className="size-4" /> Settings
                      </NavLink>

                      <div className="border-t border-slate-700 my-1"></div>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        <LogOut className="size-4" />
                        {loading ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/login"
                  className="text-slate-300 hover:text-white text-sm font-medium"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white p-2"
            >
              {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-white"
          >
            Home
          </NavLink>

          <NavLink
            to="/problems"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-white"
          >
            Problems
          </NavLink>

          <NavLink
            to="/challenges"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-white"
          >
            Challenges
          </NavLink>
          <NavLink
            to="/community"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:text-white"
          >
            Community
          </NavLink>

          <div className="border-t border-slate-800 my-2 pt-2">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-blue-400"
                >
                  Profile
                </NavLink>
                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-blue-400"
                  >
                    Admin Dashboard
                  </NavLink>
                )}

                <button
                  onClick={handleLogout}
                  className="block px-3 py-2 text-red-400 text-left w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2 text-slate-300 border border-slate-700 rounded-lg"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2 bg-blue-600 text-white rounded-lg"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
