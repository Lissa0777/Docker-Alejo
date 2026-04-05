const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "testdb",
  port: process.env.DB_PORT || 3306
});

function connectWithRetry() {
  db.connect(err => {
    if (err) {
      console.log("MySQL no listo, reintentando en 3s...", err.message);
      setTimeout(connectWithRetry, 3000);
    } else {
      console.log("Conectado a MySQL");
      db.query(`CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL
      )`, () => {
        db.query(`INSERT INTO usuarios (nombre) SELECT 'Ana García' WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre='Ana García')`, () => {});
        db.query(`INSERT INTO usuarios (nombre) SELECT 'Carlos López' WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre='Carlos López')`, () => {});
        db.query(`INSERT INTO usuarios (nombre) SELECT 'Laura Martínez' WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE nombre='Laura Martínez')`, () => {});
      });
    }
  });
}
connectWithRetry();

app.get("/api/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(result);
  });
});

app.post("/api/usuarios", (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
  db.query("INSERT INTO usuarios (nombre) VALUES (?)", [nombre], (err, result) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ id: result.insertId, nombre });
  });
});

app.delete("/api/usuarios/:id", (req, res) => {
  db.query("DELETE FROM usuarios WHERE id = ?", [req.params.id], (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: "Usuario eliminado" });
  });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});