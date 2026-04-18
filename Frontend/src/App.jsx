import {React, useEffect} from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux'; 
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css';
import { getProfile } from './authSlice';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete"
import AdminVideo from "./components/AdminVideo"
import AdminUpload from "./components/AdminUpload"
import AdminUpdate from "./components/AdminUpdate"
import AdminUpdateForm from "./components/AdminUpdateForm"
import Problems from "./pages/Problems"
import Challenges from "./pages/Challenges"
import Community from "./pages/Community"
import WorkInProgress from "./components/WorkInProgress"



function App() {
  const dispatch = useDispatch();
  const {isAuthenticated, user, loading} = useSelector((state)=>state.auth);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);


  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/signup' element={isAuthenticated?<Navigate to="/"/>: <Signup />} />
        <Route path='/login' element={isAuthenticated?<Navigate to="/"/>:<Login />} />
        <Route path='/profile' element={isAuthenticated ? <Profile /> : <Navigate to="/login" /> } />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/problems" element={isAuthenticated ?<Problems/>:<Navigate to="/" />}></Route>
        <Route path="/problem/:problemId" element={isAuthenticated ?<ProblemPage/>:<Navigate to="/" />}></Route>

        <Route path="/challenges" element={<Challenges></Challenges>} ></Route>
        <Route path="/community" element={<Community></Community>} ></Route>
        <Route path="/WorkInProgress" element={<WorkInProgress></WorkInProgress>} ></Route>

        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
        <Route path="/admin/update/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdateForm /> : <Navigate to="/" />} />

        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />      

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;