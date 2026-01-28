import UserModel from "../models/UserModel.js";
import getToken from "../utils/token.js";
import bcrypt from "bcrypt";

// helper
const sendUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
});



/* ================= REGISTER ================= */
export const Register = async (req, res) => {
  try {
    const { name, email, password, repassword } = req.body;

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be 6 characters" });
    }

    if (password !== repassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hash,
      provider: "local",
    });

    const token = getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ user: sendUser(user) });
  } catch (err) {
    return res.status(500).json({ message: "Register failed" });
  }
};

/* ================= LOGIN ================= */
export const Login = async (req, res) => {

  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ user: sendUser(user) });
  } catch (err) {
     console.error("🔥 LOGIN ERROR:", err);
  return res.status(500).json({ message: "Login failed" });
  }
};

/* ================= GOOGLE LOGIN ================= */
export const GoogleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        provider: "google",
      });
    }

    const token = getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ user: sendUser(user) });
  } catch (err) {
    return res.status(500).json(err);
  }
};

/* ================= LOGOUT ================= */
export const Logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({ message: "Logged out" });
};

/* ================= ME ================= */
export const IsAuthenticated = async (req, res) => {
  return res.status(200).json({ user: req.user });
};





export const EditProfile=async(req,res)=>{
  try {
    const {fullname,email}=req.body
    const id=req.user._id
    const user=await UserModel.findByIdAndUpdate(id,{
      name:fullname,
      email
    },{new:true})
return res.status(200).json({message:"profile updated"})
  } catch (error) {
    console.log(error);
    
  }
}






export const changeProfilePicture=async(req,res)=>{
  try {
    const user=await UserModel.findById(req.user._id)
    if (!user) {
      return res.status(404).json({message:"user not found"})
    }
    user.ProfilePicture=req.file.path
    await user.save()
   return res.status(200).json({message:"Profile Image Updated",image: user.ProfilePicture})
  } catch (error) {
    console.log(error);
    
  }
}