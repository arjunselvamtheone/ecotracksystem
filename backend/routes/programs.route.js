// backend/routes/programRoutes.js
const express = require("express");
const {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} = require("../controllers/programs.controller.js");

const router = express.Router();

router.get("/", getPrograms);
router.get("/:id", getProgramById);
router.post("/", createProgram);
router.put("/:id", updateProgram);
router.delete("/:id", deleteProgram);

module.exports = router;
