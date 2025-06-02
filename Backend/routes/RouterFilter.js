const express = require("express");
const router = express.Router();
const { getTipoCoches } = require("../controllers/filterController");
const {
  getMarcas,
  getMarcasCoches,
} = require("../controllers/tipoVehiculoController");

router.get("/cochesTipo/:tipo", getTipoCoches);
router.get("/marcas", getMarcas);
router.get("/coche/marca/:marca", getMarcasCoches);

module.exports = router;
