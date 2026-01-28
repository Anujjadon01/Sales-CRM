import jwt from "jsonwebtoken";

const getToken = (userId) => {
  console.log("JWT KEY:", !!process.env.JWT_SECRET_KEY);
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

};

export default getToken;
