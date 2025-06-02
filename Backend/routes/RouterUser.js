const express = require("express");
const router = express.Router();
const {
  login,
  register,
  cerraSesion,
  cambiarToken,
  getUser,
  quitarRolVendedor,
} = require("../controllers/userController");
const { verificarAutenticacion } = require("../middlewares/auth");

router.post("/login", login); // Endpoint para iniciar sesión
router.post("/register", register); // Endpoint para registro de usuario
// router.get("/userLogin", verificarAutenticacion, getUser);
router.post("/cerrarSesion", verificarAutenticacion, cerraSesion);
router.post("/actualizarToken", cambiarToken);
router.get("/loginUser", verificarAutenticacion, getUser);
router.get("/quitarRolVendedor", verificarAutenticacion, quitarRolVendedor);

module.exports = router;
