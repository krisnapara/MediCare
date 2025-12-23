import db from "../config/db.js";

// CREATE RESERVATION
export const createReservation = (req, res) => {
  const users_id = req.user.id;
  const {
    doctor_id,
    nama_lengkap,
    NIK_ktp,
    tanggal_lahir,
    jenis_kelamin,
    reservation_date,
    reservation_time,
  } = req.body;

  // Validasi input wajib
  if (
    !doctor_id ||
    !nama_lengkap ||
    !NIK_ktp ||
    !tanggal_lahir ||
    !jenis_kelamin ||
    !reservation_date ||
    !reservation_time
  ) {
    return res.status(400).json({ message: "Data reservasi belum lengkap" });
  }

  // Cek quota dokter (kapasitas per hari)
  const quotaSql = `
    SELECT quota,
      (
        SELECT COUNT(*) 
        FROM reservation r
        WHERE doctor_id = ? AND reservation_date = ?
      ) AS used_quota
    FROM doctor d
    WHERE doctor_id = ?
  `;

  db.query(quotaSql, [doctor_id, reservation_date, doctor_id], (err, rows) => {
    if (err) {
      console.error("Error check quota:", err);
      return res.status(500).json({ message: "Gagal mengecek quota dokter" });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const quota = Number(rows[0].quota);
    const used_quota = Number(rows[0].used_quota);

    if (Number.isNaN(quota) || quota < 0) {
      return res.status(500).json({ message: "Data quota dokter tidak valid" });
    }

    if (used_quota >= quota) {
      return res.status(400).json({ message: "Doctor quota is full on this date" });
    }

    // Cek bentrok jam
    const timeSql = `
      SELECT reservation_id
      FROM reservation
      WHERE doctor_id = ? AND reservation_date = ? AND reservation_time = ?
      LIMIT 1
    `;

    db.query(timeSql, [doctor_id, reservation_date, reservation_time], (err2, rows2) => {
      if (err2) {
        console.error("Error check timeslot:", err2);
        return res.status(500).json({ message: "Gagal mengecek jadwal dokter" });
      }

      if (rows2 && rows2.length > 0) {
        return res.status(400).json({ message: "This timeslot is already taken" });
      }

      // Insert reservation
      const insertSql = `
        INSERT INTO reservation
        (users_id, doctor_id, nama_lengkap, NIK_ktp, tanggal_lahir, jenis_kelamin,
         reservation_date, reservation_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          users_id,
          doctor_id,
          nama_lengkap,
          NIK_ktp,
          tanggal_lahir,
          jenis_kelamin,
          reservation_date,
          reservation_time,
        ],
        (err3, result3) => {
          if (err3) {
            console.error("Error createReservation:", err3);
            return res.status(500).json({ message: "Gagal membuat reservasi" });
          }

          return res.status(201).json({
            message: "Reservation created",
            reservation_id: result3.insertId,
          });
        }
      );
    });
  });
};

// GET RESERVATIONS (BY LOGGED IN USER)
export const getReservationsByUser = (req, res) => {
  const sql = `
    SELECT r.*, d.name AS doctor_name, d.profession
    FROM reservation r
    JOIN doctor d ON r.doctor_id = d.doctor_id
    WHERE r.users_id = ?
    ORDER BY r.reservation_date DESC, r.reservation_time DESC
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error("Error getReservationsByUser:", err);
      return res.status(500).json({ message: "Gagal mengambil data reservasi user" });
    }
    res.json(results);
  });
};

// UPDATE RESERVATION STATUS (ONLY OWN RESERVATION)
export const updateReservationStatus = (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status wajib diisi" });
  }

  const sql = `
    UPDATE reservation
    SET status = ?
    WHERE reservation_id = ? AND users_id = ?
  `;

  db.query(sql, [status, req.params.id, req.user.id], (err, result) => {
    if (err) {
      console.error("Error updateReservationStatus:", err);
      return res.status(500).json({ message: "Gagal mengubah status reservasi" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan / bukan milik Anda" });
    }

    res.json({ message: "Reservation status updated" });
  });
};

// DELETE RESERVATION (ONLY OWN RESERVATION)
export const deleteReservation = (req, res) => {
  const sql = `
    DELETE FROM reservation
    WHERE reservation_id = ? AND users_id = ?
  `;

  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) {
      console.error("Error deleteReservation:", err);
      return res.status(500).json({ message: "Gagal menghapus reservasi" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservasi tidak ditemukan / bukan milik Anda" });
    }

    res.json({ message: "Reservation deleted" });
  });
};
