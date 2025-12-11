import db from "../db.js";

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

export const createDoctor = (req, res) => {
  const { name, profession, quota, available_start, available_end, consultation_link } = req.body;

  if (!name || !profession || !quota) {
    return res.status(400).json({ message: "Name, profession, dan quota wajib diisi" });
  }

  const sql = `
    INSERT INTO doctor
    (name, profession, quota, available_start, available_end, consultation_link) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, profession, quota, available_start, available_end, consultation_link], (err) => {
    if (err) {
      console.error("Error createDoctor:", err);
      return res.status(500).json({ message: "Gagal menambah dokter" });
    }
    res.json({ message: "Doctor added" });
  });
};

export const updateDoctor = (req, res) => {
  const { name, profession, quota, available_start, available_end, consultation_link } = req.body;

  const sqlCheck = "SELECT doctor_id FROM doctor WHERE doctor_id = ?";
  db.query(sqlCheck, [req.params.id], (err, rows) => {
    if (err) {
      console.error("Error check doctor:", err);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const sql = `
      UPDATE doctor SET 
      name=?, profession=?, quota=?, available_start=?, available_end=?, consultation_link=?
      WHERE doctor_id = ?
    `;

    db.query(sql, [name, profession, quota, available_start, available_end, consultation_link, req.params.id], (err2) => {
      if (err2) {
        console.error("Error updateDoctor:", err2);
        return res.status(500).json({ message: "Gagal update data dokter" });
      }
      res.json({ message: "Doctor updated" });
    });
  });
};

export const deleteDoctor = (req, res) => {
  const sql = "DELETE FROM doctor WHERE doctor_id=?";
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error("Error deleteDoctor:", err);
      return res.status(500).json({ message: "Gagal menghapus dokter" });
    }
    res.json({ message: "Doctor deleted" });
  });
};
