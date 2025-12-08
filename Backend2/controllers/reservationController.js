import db from "../db.js";

export const createReservation = (req, res) => {
  const {
    users_id, doctor_id, nama_lengkap, NIK_ktp, tanggal_lahir,
    jenis_kelamin, reservation_date, reservation_time
  } = req.body;

  // 1. Cek apakah sudah full quota
  const quotaSql = `
    SELECT quota,
    (SELECT COUNT(*) FROM reservations 
     WHERE doctor_id=? AND reservation_date=?) AS used_quota
    FROM doctors WHERE doctor_id=?`;

  db.query(quotaSql, [doctor_id, reservation_date, doctor_id], (err, result) => {
    if (err) return res.status(500).json(err);

    const { quota, used_quota } = result[0];

    if (used_quota >= quota) {
      return res.status(400).json({ message: "Doctor quota is full on this date" });
    }

    // 2. Cek apakah jam bentrok
    const timeSql = `
      SELECT * FROM reservations 
      WHERE doctor_id=? AND reservation_date=? AND reservation_time=?`;

    db.query(timeSql, [doctor_id, reservation_date, reservation_time], (err, result2) => {
      if (err) return res.status(500).json(err);

      if (result2.length > 0) {
        return res.status(400).json({ message: "This timeslot is already taken" });
      }

      // 3. Insert reservation
      const insertSql = `
        INSERT INTO reservations 
        (users_id, doctor_id, nama_lengkap, NIK_ktp, tanggal_lahir, jenis_kelamin,
        reservation_date, reservation_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(insertSql, [
        users_id, doctor_id, nama_lengkap, NIK_ktp, tanggal_lahir,
        jenis_kelamin, reservation_date, reservation_time
      ], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Reservation created" });
      });

    });
  });
};

export const getReservationsByUser = (req, res) => {
  const sql = `
    SELECT r.*, d.name AS doctor_name, d.profession
    FROM reservations r
    JOIN doctors d ON r.doctor_id = d.doctor_id
    WHERE r.users_id = ?
  `;

  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

export const updateReservationStatus = (req, res) => {
  const { status } = req.body;

  const sql = "UPDATE reservations SET status=? WHERE reservation_id=?";
  db.query(sql, [status, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Reservation status updated" });
  });
};

export const deleteReservation = (req, res) => {
  const sql = "DELETE FROM reservations WHERE reservation_id=?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Reservation deleted" });
  });
};
