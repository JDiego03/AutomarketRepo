const jwt = require("jsonwebtoken");
const User = require("../models/modelsUsers/User");
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.DB_APIKEY_USER;

const activeEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, secretKey);
    console.log("me estoy ejecutando", token);
    const user = await User.findOne({ where: { user_id: decoded.user_id } });

    if (!user) {
      res.redirect("/errorVerificado.html");
      console.log("Usuario no encontrado");
    }

    // Activar la cuenta
    user.activada = true;
    await user.save();
    res.redirect("/verificado.html");
  } catch (error) {
    console.error("Error al activar la cuenta:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { activeEmail };
