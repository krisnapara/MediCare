import db from "../db.js";

export const getAllDoctors = (req, res) => {
  const sql = "SELECT * FROM doctor";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

export const getDoctorById = (req, res) => {
  const sql = "SELECT * FROM doctor WHERE doctor_id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(404).json({ message: "Doctor not found" });
    res.json(result[0]);
  });
};

export const createDoctor = (req, res) => {
  const { name, profession, quota, available_start, available_end, consultation_link } = req.body;

  const sql = `
    INSERT INTO doctor
    (name, profession, quota, available_start, available_end, consultation_link) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, profession, quota, available_start, available_end, consultation_link], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Doctor added" });
  });
};

export const updateDoctor = (req, res) => {
  const { name, profession, quota, available_start, available_end, consultation_link } = req.body;

  const sql = `
    UPDATE doctor SET 
    name=?, profession=?, quota=?, available_start=?, available_end=?, consultation_link=?
    WHERE doctor_id = ?
  `;

  db.query(sql, [
    name, profession, quota, available_start, available_end, consultation_link, req.params.id
  ], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Doctor updated" });
  });
};

export const deleteDoctor = (req, res) => {
  const sql = "DELETE FROM doctor WHERE doctor_id=?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Doctor deleted" });
  });
};
