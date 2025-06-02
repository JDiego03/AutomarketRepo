const express = require("express");
const router = express.Router();
const {
  GetUserCars,
  getUserFavoritos,
  añadirFavorito,
  borrarFavorito,
} = require("../controllers/UserCarController");
const { verificarAutenticacion } = require("../middlewares/auth");

router.get("/", verificarAutenticacion, GetUserCars);
router.get("/favoritos", verificarAutenticacion, getUserFavoritos);
router.post("/favoritos/:coche_id", verificarAutenticacion, añadirFavorito);
router.delete("/favoritos/:coche_id", verificarAutenticacion, borrarFavorito);

module.exports = router;
