import dns from "node:dns/promises";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import path from "path";

import noteRoutes from "./routes/noteRoutes.js";
import rateLimiter from "./middlewares/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5173/",
//     credentials: true, // allow cookies
//   }),
// );
// if (process.env.NODE_ENV === "development") {
//   console.log("Development mode");
//   app.use(
//     cors({
//       origin: "http://localhost:5173/",
//       credentials: true, // allow cookies
//     }),
//   );
// }

app.use(express.json());
// app.use(rateLimiter);

if (process.env.NODE_ENV === "development")
  dns.setServers(["1.1.1.1", "1.0.0.1"]); // Use Google DNS

app.use("/api/v1/notes", noteRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
