import db from "../db.js";

export const saveAnswers = (req, res) => {
  const { reservation_id, answers } = req.body;

  if (!reservation_id || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: "reservation_id dan answers wajib diisi" });
  }

  const values = answers
    .filter((a) => a.question_id && typeof a.answer_text === "string")
    .map((a) => [reservation_id, a.question_id, a.answer_text]);

  if (values.length === 0) {
    return res.status(400).json({ message: "Data answers tidak valid" });
  }

  const sql =
    "INSERT INTO answers (reservation_id, question_id, answer_text) VALUES ?";

  db.query(sql, [values], (err) => {
    if (err) {
      console.error("Error saveAnswers:", err);
      return res.status(500).json({ message: "Gagal menyimpan jawaban" });
    }
    res.json({ message: "Answers saved" });
  });
};
