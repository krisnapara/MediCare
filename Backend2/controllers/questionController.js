import db from "../db.js";

export const getQuestions = (req, res) => {
  const sql = "SELECT * FROM question";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error getQuestions:", err);
      return res.status(500).json({ message: "Gagal mengambil pertanyaan" });
    }
    res.json(result);
  });
};
