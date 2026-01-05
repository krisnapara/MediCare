import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const password = req.body.password;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, dan password wajib diisi" });
  }

  // Cek email exist
  const checkSql = "SELECT user_id FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error("Error check email:", err);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }

    if (results && results.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashed = bcrypt.hashSync(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashed], (err2) => {
      if (err2) {
        console.error("Error register:", err2);
        return res.status(500).json({ message: "Gagal registrasi user" });
      }
      return res.status(201).json({ message: "Register success" });
    });
  });
};

export const login = (req, res) => {
  const email = (req.body.email || "").trim();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not set in environment variables");
    return res.status(500).json({ message: "Konfigurasi server belum lengkap" });
  }

  const sql = "SELECT user_id, name, email, password FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error login:", err);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = results[0];
    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    return res.json({
      message: "Login success",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  });
};
