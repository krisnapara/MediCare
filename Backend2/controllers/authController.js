import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, dan password wajib diisi" });
  }

  // Cek email exist
  const checkSql = "SELECT user_id FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error("Error check email:", err);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashed = bcrypt.hashSync(password, 10);

    const sql = "INSERT INTO users(name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashed], (err2) => {
      if (err2) {
        console.error("Error register:", err2);
        return res.status(500).json({ message: "Gagal registrasi user" });
      }
      res.json({ message: "Register success" });
    });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error login:", err);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "3d" } 
    );

    res.json({
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
