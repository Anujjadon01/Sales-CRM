import express from "express";
import "dotenv/config"; 
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import ConDb from "./config/db.js";
import authRouter from "./routes/auth.router.js";
import taskRouter from "./routes/task.router.js";

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5174', 'http://localhost:5173'],
    credentials: true,
  })
);

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(400).json({
    message: err.message || "Something went wrong",
  });
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

(async () => {
  try {
    await ConDb();
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
})();


