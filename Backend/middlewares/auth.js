const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const keyTokenRefresh = process.env.REFRESH_TOKEN_SECRETKEY;
dotenv.config();

const secretKey = process.env.DB_APIKEY_USER;

const verificarAutenticacion = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token", token);
  console.log("cookies", req.cookies);
  if (!token)
    return res
      .status(401)
      .json({ error: "Acceso denegado, token no proporcionado" });

  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ error: "Su token caduco" });
    }
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = { verificarAutenticacion };
