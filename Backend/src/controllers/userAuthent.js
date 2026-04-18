const User = require('../models/user');
const Problem = require('../models/problem');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validate = require('../utils/validator');
const sendEmail = require("../utils/sendEmail")

const register = async (req,res)=>{

   try{
    ///validate the data
    validate(req.body);

    const {firstName, emailId, password} = req.body;
    // check if user already registered and verified    
    const existingVerifiedUser = await User.findOne({
        emailId,
        isVerified:true
    })

    if (existingVerifiedUser) {
      return res.status(400).json({ 
        success: false,
        message: "User already registered with this email" 
      });
    }

    // Check if unverified user exists
    const existingUnverifiedUser = await User.findOne({ 
      emailId, 
      isVerified: false 
    });

    const otp = Math.floor(100000 + Math.random()* 900000).toString();
    const otpExpires = Date.now()+5*60*1000;

    if (existingUnverifiedUser) {
      existingUnverifiedUser.otp = otp;
      existingUnverifiedUser.otpExpires = otpExpires;
      existingUnverifiedUser.password = await bcrypt.hash(password, 10);
      existingUnverifiedUser.firstName = firstName;
      await existingUnverifiedUser.save();
    } else {
      // Create new unverified user
      await User.create({
        firstName,
        emailId,
        password: await bcrypt.hash(password, 10),
        otp,
        otpExpires,
        isVerified: false
      });
    }

    await sendEmail({
        to: emailId,
        subject: "Your OTP for Registration",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.status(200).json({ 
      success: true,
      message: "OTP sent to your email", 
      emailId 
    });

   }
   catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error sending OTP", 
      error: err.message 
    });
   }
}

const verifyOtp = async (req,res)=>{
    try{
        const{emailId, otp} = req.body;

        const user = await User.findOne({
            emailId,
            isVerified:false
        })
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found or already verified"
            })
        }
        if(user.otp !== otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }
        if(Date.now()>user.otpExpires){
            return res.status(400).json({
                success:false,
                message:"OTP has expired"
            })
        }
        // Mark user is verifies
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign({_id: user._id,emailId: user.emailId},process.env.JWT_KEY,{expiresIn:60*60});

        res.cookie('token',token,{maxAge:60*60*1000})

        res.status(200).json({
            success:true,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                _id: user._id,
                age: user.age,
                createdAt : user.createdAt,
                isVerified: user.isVerified
            },
            message:"User Registered Successfully"
        })
    }
    catch(err){
        console.error("OTP Verification error:",err);
        res.status(500).json({
            success:false,
            message: "Error verifying OTP",
            error: err.message
        })
    }
}

const resendOtp = async (req,res)=>{
    try{
        const{emailId} = req.body;

        const user = await User.findOne({
            emailId,
            isVerified:false
        })

        if(!user){
            return res.status(404).json({
                success:false,
                message: "User not found or already verified"
            })
        }

        const otp = Math.floor(100000 + Math.random()* 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 5*60*1000;
        await user.save();

        await sendEmail({
            to: emailId,
            subject: "Resend OTP for Registration",
            text: `Your new OTP is ${otp}. It Expites in 5 minutes`,
        });

        res.status(200).json({
            success:true,
            message: "OTP resent Successfully"
        })
    }
    catch(err){
        console.log("Resend OTP error: ",err);
        res.status(500).json({
            success:false,
            message: "Error resending OTP",
            error: err.message
        })
    }
}
 

const login = async (req,res)=>{

    try{
        const {emailId,password} = req.body;

        if (!emailId || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Email and password are required" 
            });
        }

        const user = await User.findOne({emailId})

        if(!user)
            throw new Error("Invalid Credentials");

        // Check if user is verified
        if (!user.isVerified) {
        return res.status(401).json({ 
            success: false,
            message: "Please verify your email first. Check your inbox for OTP." 
        });
        }
        const match = await bcrypt.compare(password,user.password)

        if(!match)
            throw new Error("Invalid Credentials");

        const token = jwt.sign({_id:user._id,emailId:user.emailId,role: user.role },process.env.JWT_KEY,{expiresIn:60*60});

        res.cookie('token',token,{maxAge:60*60*1000});

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                role: user.role,
                
            },
        
            message: "Login successfully"
        });
    }
    catch(err){
        // console.error("Login error:", err);
        res.status(500).json({
            success:false,
            message: "Invalid Credentials", 
            error: err.message 
        })
    }
}

const logout = async (req,res)=>{
    try{
        // console.log("Logout Successfully");
        // res.cookie('token',"abkdjfdjjlkdjjsljjdkl");
        res.cookie('token',null,{expires: new Date(Date.now())});
        res.send("Logout Successfully");
    }
    catch(err){
        res.status(503).send("Error: "+err);
    }
}

// const getProfile = async (req,res)=>{
//     try{
//         // console.log(req.result._id);

//         const problemsSolvedCount = req.user.problemSolved ? req.user.problemSolved.length : 0;
//         const problemSolved = req.user.problemSolved || [];
        
//         const allProblems = await Problem.find().select("_id difficulty");

//         const solvedIds = new Set(problemSolved.map(id => id.toString()));

//         const counts = allProblems.reduce((acc, problem) => {
//             if (solvedIds.has(problem._id.toString())) {
//                 acc[problem.difficulty]++;
//             }
//             return acc;
//             }, { easy: 0, medium: 0, hard: 0 });


//         const reply = {
//         _id: req.user._id,
//         firstName: req.user.firstName,
//         lastName: req.user.lastName,
//         emailId: req.user.emailId,
//         age: req.user.age,
//         role: req.user.role,
//         problemsSolvedCount,
//         counts,
//         createdAt : req.user.createdAt,
//         isVerified: req.user.isVerified
//         };
//         res.status(200).json({
//             success: true,
//             user: reply
//         });
//         console.log(req.user);
//     }
//     catch(err){
//         console.error("Error fetching profile:", err);
//         res.status(500).json({ success: false, message: "Internal server error:", error: err.message });
//     }
// }
const getProfile = async (req, res) => {
  try {
    const problemSolved = req.user.problemSolved || [];
    const totalProblems = await Problem.countDocuments();

    const problemsSolvedCount = problemSolved.length;

    const solvedProblems = await Problem.find({
      _id: { $in: problemSolved }
    }).select("difficulty");

    const counts = solvedProblems.reduce((acc, problem) => {
      acc[problem.difficulty]++;
      return acc;
    }, { easy: 0, medium: 0, hard: 0 });

    const reply = {
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      emailId: req.user.emailId,
      age: req.user.age,
      role: req.user.role,
      problemsSolvedCount,
      counts,
      totalProblems,
      createdAt: req.user.createdAt,
      isVerified: req.user.isVerified
    };

    res.status(200).json({
      success: true,
      user: reply
    });

  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};

const deleteUser = async (req,res)=>{
    try{
        const userId = req.user._id;

        await User.findByIdAndDelete(userId);

        res.cookie('token',null,{expires: new Date(Date.now())});

        // console.log("hello");
        res.send("Deleted Successfully");
    }
    catch(err){
        res.send("Error: "+err);
    }
}

const updateUser = async (req,res)=>{
    try{
        const ALLOWED_UPDATES = ["firstName", "lastName", "age"];
        const userId = req.user._id;
        
        const updates = Object.keys(req.body);
        const validUpdates = updates.filter(field => ALLOWED_UPDATES.includes(field));
         if (validUpdates.length === 0) {
            return res.status(400).send("No valid fields to update");
        }
        const updateData = {};

        for (let field of validUpdates) {
            updateData[field] = req.body[field];
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });

        // console.log("User Updated Successfully");
    }
    catch(err){
        res.send("Error: "+err);
    }
}

const resetPasswordRequest = async(req,res)=>{
    try{
        const {emailId} = req.body;

        const user = await User.findOne({emailId});

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        //if User find then generate 6 digit otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now()+5*60*1000;

        await user.save();
        
        await sendEmail({
            to: emailId,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It expires in 5 minutes.`,
        });

        res.status(200).json({ 
        success: true,
        message: "Reset OTP sent to your email", 
        emailId 
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Failed to process password reset request",
            error: err.message
        })
    }
}

const verifyResetOtpAndSetPassword = async (req,res)=>{
    try{
        const {emailId,otp, newPassword} = req.body;

        const user = await User.findOne({emailId});
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        if(user.otp!==otp){
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (Date.now() > user.otpExpires) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully. You can now login."
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "Error resetting password",
            error: err.message
        });
    }
}

const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;

    const { oldPassword, newPassword, confirmPassword } = req.body;

    //  Validate Input Fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password, new password and confirm password are required",
      });
    }

    //  Check Password Length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    //  Confirm Password Match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    //  Prevent Same Password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as old password",
      });
    }

    //  Find User in Database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //  Compare Old Password
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    //  Hash New Password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    //  Update Password
    user.password = hashedNewPassword;

    // Optional: invalidate OTP/reset fields
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. Please login again.",
    });

  } catch (error) {
    console.error("Update Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating password",
      error: error.message,
    });
  }
};

const adminRegister = async(req,res)=>{
    try{
        // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");  
      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}



module.exports = {register,verifyOtp,resendOtp, login, logout,
     getProfile, deleteUser, updateUser, resetPasswordRequest, 
     verifyResetOtpAndSetPassword, updatePassword,adminRegister};

