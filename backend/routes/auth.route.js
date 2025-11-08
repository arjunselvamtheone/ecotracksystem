// import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import pool from "../config/db.js";
// import dotenv from "dotenv";
// dotenv.config();

// const router = express.Router();
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

// router.post("/signup", async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     password,
//     role = "researcher",
//   } = req.body;
//   if (!email || !password)
//     return res.status(400).json({ error: "Email and password required" });

//   try {
//     const [existing] = await pool.query(
//       "SELECT user_id FROM Users WHERE email = ?",
//       [email]
//     );
//     if (existing.length)
//       return res.status(409).json({ error: "User already exists" });

//     const hash = await bcrypt.hash(password, 10);
//     const [result] = await pool.query(
//       "INSERT INTO Users (first_name,last_name,email,password_hash,role,created_at) VALUES (?,?,?,?,?,NOW())",
//       [firstName || null, lastName || null, email, hash, role]
//     );

//     const token = jwt.sign(
//       { userId: result.insertId, email, role },
//       process.env.JWT_SECRET,
//       { expiresIn: JWT_EXPIRES_IN }
//     );
//     res.status(201).json({ userId: result.insertId, email, token });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ error: "Signup failed" });
//   }
// });

// // POST /api/auth/login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return res.status(400).json({ error: "Email and password required" });

//   try {
//     const [rows] = await pool.query(
//       "SELECT user_id, email, password_hash, role FROM Users WHERE email = ?",
//       [email]
//     );
//     if (!rows.length)
//       return res.status(401).json({ error: "Invalid credentials" });

//     const user = rows[0];
//     const ok = await bcrypt.compare(password, user.password_hash);
//     if (!ok) return res.status(401).json({ error: "Invalid credentials" });

//     const token = jwt.sign(
//       { userId: user.user_id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: JWT_EXPIRES_IN }
//     );
//     res.json({
//       token,
//       userId: user.user_id,
//       email: user.email,
//       role: user.role,
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// export default router;
