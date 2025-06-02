const express = require("express");
const router = express.Router();
const { activeEmail } = require("../controllers/emailActiveController");
const { verificarAutenticacion } = require("../middlewares/auth");

router.get("/active/:token", activeEmail);

module.exports = router;
