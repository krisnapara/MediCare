CREATE DATABASE IF NOT EXISTS db_medicare;

USE db_medicare;

CREATE TABLE IF NOT EXISTS users (
  user_id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS doctor (
  doctor_id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  profession VARCHAR(100) DEFAULT NULL,
  quota INT(11) DEFAULT 0,
  available_start TIME DEFAULT NULL,
  available_end TIME DEFAULT NULL,
  consultation_link VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (doctor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS question (
  question_id INT(11) NOT NULL AUTO_INCREMENT,
  question_text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS reservation (
  reservation_id INT(11) NOT NULL AUTO_INCREMENT,
  users_id INT(11) DEFAULT NULL,
  doctor_id INT(11) DEFAULT NULL,
  nama_lengkap VARCHAR(150) NOT NULL,
  NIK_ktp VARCHAR(30) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin VARCHAR(20) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'approved',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (reservation_id),
  KEY fk_reservation_doctor (doctor_id),
  CONSTRAINT fk_reservation_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (doctor_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS answer (
  answer_id INT(11) NOT NULL AUTO_INCREMENT,
  reservation_id INT(11) DEFAULT NULL,
  question_id INT(11) DEFAULT NULL,
  answer_text TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (answer_id),
  KEY fk_answer_reservation (reservation_id),
  KEY fk_answer_question (question_id),
  CONSTRAINT fk_answer_reservation FOREIGN KEY (reservation_id) REFERENCES reservation (reservation_id) ON DELETE CASCADE,
  CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES question (question_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;