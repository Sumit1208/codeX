const express = require('express');
const authRouter = express.Router();

const {adminRegister, register, verifyOtp, resendOtp, login, logout,
    getProfile, deleteUser, updateUser, resetPasswordRequest,
    verifyResetOtpAndSetPassword,updatePassword} = require('../controllers/userAuthent');

const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


authRouter.post('/admin/register', adminMiddleware ,adminRegister);

authRouter.post("/register",register);
authRouter.post("/verifyOtp",verifyOtp);
authRouter.post("/resend-Otp",resendOtp)
authRouter.post("/login",login);
authRouter.post("/logout",userMiddleware,logout); 
authRouter.get("/getProfile",userMiddleware,getProfile);
authRouter.patch("/updateProfile",userMiddleware,updateUser);

authRouter.delete("/delete",userMiddleware,deleteUser);
authRouter.post("/reset-password-request", resetPasswordRequest);
authRouter.post("/reset-password-confirm", verifyResetOtpAndSetPassword);

authRouter.post("/update-password", userMiddleware, updatePassword);


module.exports = authRouter;

