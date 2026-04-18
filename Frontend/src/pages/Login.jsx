
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { Mail, Lock, LogIn, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { loginUser } from '../authSlice';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isAuthenticated, loading, error } = useSelector((state) => state.auth);
    const { register, handleSubmit,formState: { errors }, } = useForm( {defaultValues:{emailId: '', password: ''}});

    useEffect(() => {
        if (isAuthenticated) {
          navigate('/');
        }
      }, [isAuthenticated, navigate]);
    
      const onSubmit = (data) => {
        dispatch(loginUser(data));
      };
    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-slate-200 font-sans">
            <div className="max-w-md w-full bg-[#1e293b] rounded-3xl p-10 shadow-2xl border border-slate-700 relative overflow-hidden">
                
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>

                <header className="text-center mb-10 relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl mb-4 border border-blue-500/20">
                        <LogIn className="text-blue-500 size-8" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome Back Coders</h2>
                    <p className="text-slate-400 mt-2">Enter your credentials to access your account</p>
                </header>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-pulse">
                        <AlertCircle className="size-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
                    <div className="space-y-4">
                        {/* Email Field */}
                        <div className="group">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className={`flex items-center bg-slate-800/50 border ${errors.emailId ? 'border-red-50' : 'border-slate-700'} rounded-xl px-4 py-3 mt-1 focus-within:border-blue-500 transition-all`}>
                                <Mail className="size-5 text-slate-500 mr-3" />
                                <input 
                                    {...register("emailId", { 
                                        required: "Email is required",
                                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                                    })}
                                    type="email" 
                                    placeholder="name@example.com"
                                    className="bg-transparent border-none outline-none w-full text-slate-100 placeholder:text-slate-600"
                                />
                            </div>
                            {errors.emailId && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.emailId.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="group">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Password</label>
                                <Link to="/forgot-password" className="text-xs text-blue-500 hover:text-blue-400 font-medium transition">Forgot?</Link>
                            </div>
                            <div className={`flex items-center bg-slate-800/50 border ${errors.password ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 mt-1 focus-within:border-blue-500 transition-all`}>
                                <Lock className="size-5 text-slate-500 mr-3" />
                                <input 
                                    {...register("password", { 
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Min 6 characters" }
                                    })}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="bg-transparent border-none outline-none w-full text-slate-100 placeholder:text-slate-600"
                                />
                                <button
                                type="button"
                                className="absolute right-4 text-slate-500 hover:text-white transition"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            
                            {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.password.message}</p>}
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-900/20"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin size-5" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500 text-sm">
                    Don't have an account? <Link to="/signup" className="text-blue-500 font-bold hover:underline ml-1">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;