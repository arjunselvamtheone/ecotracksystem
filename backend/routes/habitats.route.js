// backend/routes/habitatRoutes.js
const express = require("express");
const {
  getHabitats,
  getHabitatById,
  createHabitat,
  updateHabitat,
  deleteHabitat,
} = require("../controllers/habitats.controller.js");

const router = express.Router();

router.get("/", getHabitats);
router.get("/:id", getHabitatById);
router.post("/", createHabitat);
router.put("/:id", updateHabitat);
router.delete("/:id", deleteHabitat);

module.exports = router;
