const pool = require("../config/db.js");
const CommonResponse = require("../utils/commonResponse.js");

const getHabitats = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Habitats ORDER BY name");

    const response =
      rows.length === 0
        ? new CommonResponse(null, 200, "No habitats found")
        : new CommonResponse(rows, 200, "Habitats fetched successfully");

    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(null, 500, "Failed to fetch habitats");
    res.status(response.statusCode).json(response);
  }
};

const getHabitatById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM Habitats WHERE habitat_id = ?",
      [id]
    );

    if (rows.length === 0) {
      const response = new CommonResponse(null, 404, "Habitat not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      rows[0],
      200,
      "Habitat fetched successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(null, 500, "Failed to fetch habitat");
    res.status(response.statusCode).json(response);
  }
};

const createHabitat = async (req, res) => {
  try {
    const { name, location, area_sq_km, ecosystem_type } = req.body;

    const [result] = await pool.query(
      "INSERT INTO Habitats (name, location, area_sq_km, ecosystem_type, created_at) VALUES (?, ?, ?, ?, NOW())",
      [name, location, area_sq_km, ecosystem_type]
    );

    const response = new CommonResponse(
      { habitat_id: result.insertId },
      201,
      "Habitat created successfully"
    );

    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(err, 500, "Failed to create habitat");
    res.status(response.statusCode).json(response);
  }
};

const updateHabitat = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, area_sq_km, ecosystem_type } = req.body;

    const [result] = await pool.query(
      "UPDATE Habitats SET name=?, location=?, area_sq_km=?, ecosystem_type=? WHERE habitat_id=?",
      [name, location, area_sq_km, ecosystem_type, id]
    );

    if (result.affectedRows === 0) {
      const response = new CommonResponse(null, 404, "Habitat not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      null,
      200,
      "Habitat updated successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(err, 500, "Failed to update habitat");
    res.status(response.statusCode).json(response);
  }
};

const deleteHabitat = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM Habitats WHERE habitat_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      const response = new CommonResponse(null, 404, "Habitat not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      null,
      200,
      "Habitat deleted successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(err, 500, "Failed to delete habitat");
    res.status(response.statusCode).json(response);
  }
};

module.exports = {
  getHabitats,
  getHabitatById,
  createHabitat,
  updateHabitat,
  deleteHabitat,
};
