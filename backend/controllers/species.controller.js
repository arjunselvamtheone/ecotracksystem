const pool = require("../config/db.js");
const CommonResponse = require("../utils/commonResponse.js");

const getSpecies = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.species_id, s.name, s.threat_level, s.population, s.trend, h.name AS habitat_name
      FROM Species s
      LEFT JOIN Habitats h ON s.habitat_id = h.habitat_id
      ORDER BY s.name
    `);

    const response =
      rows.length === 0
        ? new CommonResponse(null, 200, "No species found")
        : new CommonResponse(rows, 200, "Species fetched successfully");

    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(null, 500, "Failed to fetch species");
    res.status(response.statusCode).json(response);
  }
};

const getSpeciesById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT * FROM Species WHERE species_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      const response = new CommonResponse(null, 404, "Species not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      rows[0],
      200,
      "Species fetched successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(null, 500, "Failed to fetch species");
    res.status(response.statusCode).json(response);
  }
};

const createSpecies = async (req, res) => {
  try {
    const {
      name,
      threat_level,
      population = 0,
      trend = "Stable",
      habitat_id = null,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO Species (name, threat_level, population, trend, habitat_id, created_at) VALUES (?,?,?,?,?,NOW())`,
      [name, threat_level, population, trend, habitat_id]
    );

    const response = new CommonResponse(
      { species_id: result.insertId },
      201,
      "Species created successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(err, 500, "Failed to create species");
    res.status(response.statusCode).json(response);
  }
};

const updateSpecies = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, threat_level, population, trend, habitat_id } = req.body;

    const [result] = await pool.query(
      `UPDATE Species SET name=?, threat_level=?, population=?, trend=?, habitat_id=? WHERE species_id=?`,
      [name, threat_level, population, trend, habitat_id, id]
    );

    if (result.affectedRows === 0) {
      const response = new CommonResponse(null, 404, "Species not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      null,
      200,
      "Species updated successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(err, 500, "Failed to update species");
    res.status(response.statusCode).json(response);
  }
};

const deleteSpecies = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM Species WHERE species_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      const response = new CommonResponse(null, 404, "Species not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      null,
      200,
      "Species deleted successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(err, 500, "Failed to delete species");
    res.status(response.statusCode).json(response);
  }
};

module.exports = {
  getSpecies,
  getSpeciesById,
  createSpecies,
  updateSpecies,
  deleteSpecies,
};
