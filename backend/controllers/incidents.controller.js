const pool = require("../config/db.js");
const CommonResponse = require("../utils/commonResponse.js");

const getIncidents = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.incident_id, i.type, i.date, i.location, i.severity,
             a.name AS animal_name, h.name AS habitat_name
      FROM Incidents i
      LEFT JOIN Animals a ON i.animal_id = a.animal_id
      LEFT JOIN Habitats h ON i.habitat_id = h.habitat_id
      ORDER BY i.date DESC
    `);

    const response =
      rows.length === 0
        ? new CommonResponse(null, 200, "No incidents found")
        : new CommonResponse(rows, 200, "Incidents fetched successfully");

    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(null, 500, "Failed to fetch incidents");
    res.status(response.statusCode).json(response);
  }
};

const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT i.*, a.name AS animal_name, h.name AS habitat_name
      FROM Incidents i
      LEFT JOIN Animals a ON i.animal_id = a.animal_id
      LEFT JOIN Habitats h ON i.habitat_id = h.habitat_id
      WHERE i.incident_id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      const response = new CommonResponse(null, 404, "Incident not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      rows[0],
      200,
      "Incident fetched successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(null, 500, "Failed to fetch incident");
    res.status(response.statusCode).json(response);
  }
};

const createIncident = async (req, res) => {
  try {
    const {
      animal_id,
      habitat_id,
      type,
      date,
      location,
      description,
      severity,
    } = req.body;

    const [result] = await pool.query(
      "INSERT INTO Incidents (animal_id, habitat_id, type, date, location, description, severity, created_at) VALUES (?,?,?,?,?,?,?,NOW())",
      [
        animal_id,
        habitat_id,
        type,
        date,
        location,
        description,
        severity || "Medium",
      ]
    );

    const response = new CommonResponse(
      { incident_id: result.insertId },
      201,
      "Incident logged successfully"
    );

    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(err, 500, "Failed to log incident");
    res.status(response.statusCode).json(response);
  }
};

const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      animal_id,
      habitat_id,
      type,
      date,
      location,
      description,
      severity,
    } = req.body;

    const [result] = await pool.query(
      `
      UPDATE Incidents
      SET animal_id=?, habitat_id=?, type=?, date=?, location=?, description=?, severity=?
      WHERE incident_id=?
      `,
      [animal_id, habitat_id, type, date, location, description, severity, id]
    );

    if (result.affectedRows === 0) {
      const response = new CommonResponse(null, 404, "Incident not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      null,
      200,
      "Incident updated successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(err, 500, "Failed to update incident");
    res.status(response.statusCode).json(response);
  }
};

const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM Incidents WHERE incident_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      const response = new CommonResponse(null, 404, "Incident not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      null,
      200,
      "Incident deleted successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (err) {
    const response = new CommonResponse(err, 500, "Failed to delete incident");
    res.status(response.statusCode).json(response);
  }
};

module.exports = {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
};
