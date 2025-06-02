const express = require("express");
const router = express.Router();
const { verificarAutenticacion } = require("../middlewares/auth");
const upload = require("../middlewares/multer"); // <-- import multer
const {
  getAllCoches,
  getCocheById,
  createCoche,
  updateCoche,
  deleteCoche,
  getPageCoches,
  countCars,
  getModelos,
  createCaracteristica,
  uploadImage,
} = require("../controllers/carController");

router.get("/Cars", getAllCoches);
router.get("/Car/:id", getCocheById);
router.post("/Cars", verificarAutenticacion, createCoche);
router.put("/Cars/:id", verificarAutenticacion, updateCoche);
router.delete("/Cars/:id", verificarAutenticacion, deleteCoche);
router.get("/Cars/filtro", getPageCoches);
router.get("/CountCars", countCars);
router.get("/modelos/:marca_id", getModelos);
router.post("/Caracteristicas", verificarAutenticacion, createCaracteristica);
// Nueva ruta para subir imagen
router.post(
  "/upload-image",
  verificarAutenticacion,
  upload.array("imagenes", 5),
  uploadImage
);

module.exports = router;
