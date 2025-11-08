const pool = require("../config/db.js");
const CommonResponse = require("../utils/commonResponse.js");

const getAllAnimals = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Animals");

    if (rows.length === 0) {
      const response = new CommonResponse(null, 200, "No animals found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      rows,
      200,
      "Animals fetched successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new CommonResponse(null, 500, "Internal Server Error");
    res.status(response.statusCode).json(response);
  }
};

const getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM Animals WHERE animal_id = ?",
      [id]
    );

    if (rows.length === 0) {
      const response = new CommonResponse(null, 404, "Animal not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      rows[0],
      200,
      "Animal fetched successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new CommonResponse(null, 500, "Internal Server Error");
    res.status(response.statusCode).json(response);
  }
};

const addAnimal = async (req, res) => {
  try {
    const { species_id, habitat_id, name, sex, date_of_birth, health_status } =
      req.body;

    const sql = `
      INSERT INTO Animals (species_id, habitat_id, name, sex, date_of_birth, health_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.query(sql, [
      species_id,
      habitat_id,
      name,
      sex,
      date_of_birth,
      health_status || "Good",
    ]);

    const response = new CommonResponse(
      { animal_id: result.insertId },
      201,
      "Animal added successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new CommonResponse(error, 500, "Failed to add animal");
    res.status(response.statusCode).json(response);
  }
};

const updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { species_id, habitat_id, name, sex, date_of_birth, health_status } =
      req.body;

    const sql = `
      UPDATE Animals SET species_id=?, habitat_id=?, name=?, sex=?, date_of_birth=?, health_status=?
      WHERE animal_id=?
    `;

    const [result] = await pool.query(sql, [
      species_id,
      habitat_id,
      name,
      sex,
      date_of_birth,
      health_status,
      id,
    ]);

    if (result.affectedRows === 0) {
      const response = new CommonResponse(null, 404, "Animal not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      null,
      200,
      "Animal updated successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new CommonResponse(error, 500, "Failed to update animal");
    res.status(response.statusCode).json(response);
  }
};

const deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM Animals WHERE animal_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      const response = new CommonResponse(null, 404, "Animal not found");
      return res.status(response.statusCode).json(response);
    }

    const response = new CommonResponse(
      null,
      200,
      "Animal deleted successfully"
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    const response = new CommonResponse(error, 500, "Failed to delete animal");
    res.status(response.statusCode).json(response);
  }
};

module.exports = {
  getAllAnimals,
  getAnimalById,
  addAnimal,
  updateAnimal,
  deleteAnimal,
};
