import db from "../config/db.js";

export const getAllDoctors = (req, res) => {
  const sql = "SELECT * FROM doctor";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error getAllDoctors:", err);
      return res.status(500).json({ message: "Gagal mengambil data dokter" });
    }
    res.json(result);
  });
};

export const getDoctorById = (req, res) => {
  const sql = "SELECT * FROM doctor WHERE doctor_id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Error getDoctorById:", err);
      return res.status(500).json({ message: "Gagal mengambil data dokter" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(result[0]);
  });
};
