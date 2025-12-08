import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const { name, email, password } = req.body;

  const hashed = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users(name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashed], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Register success" });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET);

    res.json({
      message: "Login success",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
      }
    });
  });
};
