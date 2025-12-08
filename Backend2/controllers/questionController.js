import db from "../db.js";

export const getQuestions = (req, res) => {
  db.query("SELECT * FROM questions", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
