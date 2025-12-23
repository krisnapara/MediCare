import db from "../config/db.js";

export const saveAnswers = (req, res) => {
  const { reservation_id, answers } = req.body;

  const values = answers.map(a => [
    reservation_id,
    a.question_id,
    a.answer_text
  ]);

  const sql =
    "INSERT INTO answer (reservation_id, question_id, answer_text) VALUES ?";

  db.query(sql, [values], () =>
    res.status(201).json({ message: "Answers saved" })
  );
};
