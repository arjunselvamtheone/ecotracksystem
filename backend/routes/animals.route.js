const express = require("express");
const pool = require("../config/db.js");
const {
  getAllAnimals,
  addAnimal,
  updateAnimal,
  deleteAnimal,
  getAnimalById,
} = require("../controllers/animals.controller.js");
const router = express.Router();

router.get("/", getAllAnimals);

router.get("/:id", getAnimalById);

router.post("/", addAnimal);

router.put("/:id", updateAnimal);

router.delete("/:id", deleteAnimal);

module.exports = router;
