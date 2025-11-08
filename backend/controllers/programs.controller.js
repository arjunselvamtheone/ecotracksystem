const pool = require("../config/db.js");
const CommonResponse = require("../utils/commonResponse.js");

/************** GET ALL PROGRAMS **************/
const getPrograms = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.program_id, p.name, p.start_date, p.status, p.funding_utilization,
             p.habitat_id, h.name AS habitat_name
      FROM Programs p
      LEFT JOIN Habitats h ON p.habitat_id = h.habitat_id
      ORDER BY p.start_date DESC
    `);

    res.status(200).json(new CommonResponse(rows, 200, "Programs fetched"));
  } catch (err) {
    console.error("GET PROGRAMS ERROR:", err);
    res
      .status(500)
      .json(new CommonResponse(null, 500, "Failed to fetch programs"));
  }
};

/************** GET PROGRAM BY ID **************/
const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT * FROM Programs WHERE program_id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res
        .status(404)
        .json(new CommonResponse(null, 404, "Program not found"));

    res.status(200).json(new CommonResponse(rows[0], 200, "Program fetched"));
  } catch (err) {
    res
      .status(500)
      .json(new CommonResponse(null, 500, "Failed to fetch program"));
  }
};

/************** CREATE PROGRAM **************/
const createProgram = async (req, res) => {
  try {
    const { name, habitat_id, start_date, status, funding_utilization } =
      req.body;

    const [result] = await pool.query(
      `INSERT INTO Programs (name, habitat_id, start_date, status, funding_utilization, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        name,
        habitat_id,
        start_date,
        status || "Active",
        funding_utilization || 0,
      ]
    );

    res
      .status(201)
      .json(
        new CommonResponse(
          { program_id: result.insertId },
          201,
          "Program created"
        )
      );
  } catch (err) {
    console.error("CREATE PROGRAM ERROR:", err);
    res
      .status(500)
      .json(new CommonResponse(null, 500, "Failed to create program"));
  }
};

/************** UPDATE PROGRAM **************/
const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, habitat_id, start_date, status, funding_utilization } =
      req.body;

    const [result] = await pool.query(
      `UPDATE Programs
       SET name=?, habitat_id=?, start_date=?, status=?, funding_utilization=?
       WHERE program_id=?`,
      [name, habitat_id, start_date, status, funding_utilization, id]
    );

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json(new CommonResponse(null, 404, "Program not found"));

    res.status(200).json(new CommonResponse(null, 200, "Program updated"));
  } catch (err) {
    console.error("UPDATE PROGRAM ERROR:", err);
    res
      .status(500)
      .json(new CommonResponse(null, 500, "Failed to update program"));
  }
};

/************** DELETE PROGRAM **************/
const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM Programs WHERE program_id = ?`,
      [id]
    );

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json(new CommonResponse(null, 404, "Program not found"));

    res.status(200).json(new CommonResponse(null, 200, "Program deleted"));
  } catch (err) {
    res
      .status(500)
      .json(new CommonResponse(null, 500, "Failed to delete program"));
  }
};

module.exports = {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
};
