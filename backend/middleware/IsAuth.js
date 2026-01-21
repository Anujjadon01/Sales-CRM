import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

export const IsAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      ProfilePicture:user.ProfilePicture,
      role:user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
