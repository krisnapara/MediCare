import db from "../config/db.js";
import bcrypt from "bcryptjs";

// GET USER BY ID
export const getUserById = (req, res) => {
  const userId = req.params.id;

  const sql =
    "SELECT user_id, name, email, created_at FROM users WHERE user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error getUserById:", err);
      return res.status(500).json({ message: "Gagal mengambil data user" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  });
};

// UPDATE USER (name, email, password)
export const updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  let fields = [];
  let values = [];

  if (name) {
    fields.push("name = ?");
    values.push(name);
  }

  if (email) {
    fields.push("email = ?");
    values.push(email);
  }

  if (password) {
    const hashed = bcrypt.hashSync(password, 10);
    fields.push("password = ?");
    values.push(hashed);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No data to update" });
  }

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`;
  values.push(userId);

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error updateUser:", err);
      return res.status(500).json({ message: "Gagal mengupdate user" });
    }
    res.json({ message: "User updated" });
  });
};

// DELETE USER
export const deleteUser = (req, res) => {
  const userId = req.params.id;

  const sql = "DELETE FROM users WHERE user_id = ?";
  db.query(sql, [userId], (err) => {
    if (err) {
      console.error("Error deleteUser:", err);
      return res.status(500).json({ message: "Gagal menghapus user" });
    }
    res.json({ message: "User deleted" });
  });
};
