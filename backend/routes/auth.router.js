import express from "express";
import {
  Register,
  Login,
  GoogleLogin,
  Logout,
  IsAuthenticated,
  EditProfile,
  changeProfilePicture,
} from "../controllers/Auth.js";
import { IsAuth } from "../middleware/IsAuth.js";
import { upload } from "../utils/uploadImage.js";

const authRouter = express.Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.post("/google", GoogleLogin);
authRouter.post("/logout", Logout);
authRouter.put("/update-profile",IsAuth,EditProfile);
authRouter.put("/update-profile-picture",IsAuth,upload.single("image"),changeProfilePicture);

// check login
authRouter.get("/me", IsAuth, IsAuthenticated);

export default authRouter;
