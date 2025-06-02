const express = require("express");
const router = express.Router();
const { getTipoVehiculos } = require("../controllers/tipoVehiculoController");

router.get("/tipoVehiculos", getTipoVehiculos);

module.exports = router;
