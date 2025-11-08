const express = require("express");
const {
  getSpecies,
  getSpeciesById,
  createSpecies,
  updateSpecies,
  deleteSpecies,
} = require("../controllers/species.controller.js");

const router = express.Router();

router.get("/", getSpecies);
router.get("/:id", getSpeciesById);
router.post("/", createSpecies);
router.put("/:id", updateSpecies);
router.delete("/:id", deleteSpecies);

module.exports = router;
