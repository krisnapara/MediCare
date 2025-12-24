import db from "../config/db.js";

export const getAllDoctors = (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Query date wajib" });

  const sql = `
    SELECT 
      d.doctor_id, d.name, d.profession, d.quota, d.available_start, d.available_end, d.consultation_link,
      COALESCE(r.used_quota, 0) AS used_quota,
      GREATEST(d.quota - COALESCE(r.used_quota, 0), 0) AS remaining_quota
    FROM doctor d
    LEFT JOIN (
      SELECT doctor_id, COUNT(*) AS used_quota
      FROM reservation
      WHERE reservation_date = ?
      GROUP BY doctor_id
    ) r ON r.doctor_id = d.doctor_id
    ORDER BY d.doctor_id ASC
  `;

  db.query(sql, [date], (err, rows) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data dokter" });
    return res.json(rows);
  });
};

export const getDoctorById = (req, res) => {
  const { id } = req.params;
  const date = req.query.date;

  if (!date) {
    return res.status(400).json({ message: "Query date wajib, contoh: ?date=2025-12-24" });
  }

  const sql = `
    SELECT 
      d.doctor_id,
      d.name,
      d.profession,
      d.quota,
      d.available_start,
      d.available_end,
      d.consultation_link,
      COALESCE(r.used_quota, 0) AS used_quota,
      (d.quota - COALESCE(r.used_quota, 0)) AS remaining_quota
    FROM doctor d
    LEFT JOIN (
      SELECT doctor_id, COUNT(*) AS used_quota
      FROM reservation
      WHERE reservation_date = ? AND doctor_id = ?
      GROUP BY doctor_id
    ) r ON r.doctor_id = d.doctor_id
    WHERE d.doctor_id = ?
    LIMIT 1
  `;

  db.query(sql, [date, id, id], (err, rows) => {
    if (err) {
      console.error("Error getDoctorById:", err);
      return res.status(500).json({ message: "Gagal mengambil data dokter" });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    return res.json(rows[0]);
  });
};