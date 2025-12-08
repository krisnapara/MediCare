import db from "../db.js";

export const saveAnswers = (req, res) => {
  const { reservation_id, answers } = req.body;

  const sql = "INSERT INTO answers (reservation_id, question_id, answer_text) VALUES ?";

  const values = answers.map(a => [reservation_id, a.question_id, a.answer_text]);

  db.query(sql, [values], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Answers saved" });
  });
};

