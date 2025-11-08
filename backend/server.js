const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const animalsRoutes = require("./routes/animals.route.js");
const habitatsRoutes = require("./routes/habitats.route.js");
const incidentsRoutes = require("./routes/incidents.route.js");
const speciesRoutes = require("./routes/species.route.js");
const programRoutes = require("./routes/programs.route.js");
const pool = require("./config/db.js");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || "dev" })
);

app.use("/api/animals", animalsRoutes);
app.use("/api/habitats", habitatsRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/species", speciesRoutes);
app.use("/api/incidents", incidentsRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL database connected successfully!");
    connection.release();

    app.listen(PORT, () => {
      console.log(`EcoTrack API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MySQL:", error.message);
    process.exit(1);
  }
};

startServer();
