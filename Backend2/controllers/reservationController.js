import db from "../db.js";

export const createReservation = (req, res) => {
  const { users_id, doctor_id, nama_lengkap, NIK_ktp, tanggal_lahir, jenis_kelamin, reservation_date, reservation_time } = req.body;

  if (!users_id || !doctor_id || !nama_lengkap || !NIK_ktp || !reservation_date || !reservation_time) {
    return res.status(400).json({ message: "Data reservasi belum lengkap" });
  }

  // Cek quota dokter
  const quotaSql = `
    SELECT quota,
      (
        SELECT COUNT(*) FROM reservation
        WHERE doctor_id = ? AND reservation_date = ?
      ) AS used_quota
    FROM doctor 
    WHERE doctor_id = ?
  `;

  db.query(quotaSql, [doctor_id, reservation_date, doctor_id], (err, result) => {
    if (err) {
      console.error("Error check quota:", err);
      return res.status(500).json({ message: "Gagal mengecek quota dokter" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { quota, used_quota } = result[0];

    if (used_quota >= quota) {
      return res.status(400).json({ message: "Doctor quota is full on this date" });
    }

    // Cek bentrok jam
    const timeSql = `
      SELECT * FROM reservation
      WHERE doctor_id = ? AND reservation_date = ? AND reservation_time = ?
    `;

    db.query(timeSql, [doctor_id, reservation_date, reservation_time], (err2, result2) => {
      if (err2) {
        console.error("Error check timeslot:", err2);
        return res.status(500).json({ message: "Gagal mengecek jadwal dokter" });
      }

      if (result2.length > 0) {
        return res.status(400).json({ message: "This timeslot is already taken" });
      }

      // Insert reservation
      const insertSql = `
        INSERT INTO reservation
        (users_id, doctor_id, nama_lengkap, NIK_ktp, tanggal_lahir, jenis_kelamin,
         reservation_date, reservation_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(insertSql, [users_id, doctor_id, nama_lengkap, NIK_ktp, tanggal_lahir, jenis_kelamin, reservation_date, reservation_time], (err3) => {
        if (err3) {
          console.error("Error createReservation:", err3);
          return res.status(500).json({ message: "Gagal membuat reservasi" });
        }

        // Update quota dokter
        const updateQuotaSql = `
          UPDATE doctor 
          SET quota = quota - 1 
          WHERE doctor_id = ?
        `;

        db.query(updateQuotaSql, [doctor_id], (err4) => {
          if (err4) {
            console.error("Error update doctor quota:", err4);
            return res.status(500).json({ message: "Gagal mengupdate kuota dokter" });
          }

          res.json({ message: "Reservation created and doctor quota updated" });
        });
      });
    });
  });
};

export const getReservationsByUser = (req, res) => {
  const sql = `
    SELECT r.*, d.name AS doctor_name, d.profession
    FROM reservation r
    JOIN doctor d ON r.doctor_id = d.doctor_id
    WHERE r.users_id = ?
    ORDER BY r.reservation_date DESC, r.reservation_time DESC
  `;

  db.query(sql, [req.params.userId], (err, results) => {
    if (err) {
      console.error("Error getReservationsByUser:", err);
      return res.status(500).json({ message: "Gagal mengambil data reservasi user" });
    }
    res.json(results);
  });
};


export const updateReservationStatus = (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status wajib diisi" });
  }

  const sql = "UPDATE reservation SET status = ? WHERE reservation_id = ?";
  db.query(sql, [status, req.params.id], (err) => {
    if (err) {
      console.error("Error updateReservationStatus:", err);
      return res.status(500).json({ message: "Gagal mengubah status reservasi" });
    }
    res.json({ message: "Reservation status updated" });
  });
};

export const deleteReservation = (req, res) => {
  const sql = "DELETE FROM reservation WHERE reservation_id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error("Error deleteReservation:", err);
      return res.status(500).json({ message: "Gagal menghapus reservasi" });
    }
    res.json({ message: "Reservation deleted" });
  });
};
