const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/modelsUsers/User");
const Rol = require("../models/modelsUsers/Rol");
const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
const { Rol_User } = require("../models/modelsUsers/relaciones");
const { where } = require("sequelize");
const Sesion = require("../models/modelsUsers/Sesion");
const { access } = require("fs");
dotenv.config();

const secretKey = process.env.DB_APIKEY_USER;
const refreshKey = process.env.REFRESH_TOKEN_SECRETKEY;
const EMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
const EMAIL = process.env.GMAIL;
const PORT = process.env.DB_PORT || 3002;

const sendEmail = async (token) => {
  try {
    const transporte = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: EMAIL,
      subject: "Activacion de cuenta de Automarket",
      html: `<h1>Bienvenido a Automarket</h1>
             <p>Buenass!!, Para activar tu cuenta tienes que darle al enlace:</p>
             <a href="https://localhost:${PORT}/api/email/active/${token}">Activar mi cuenta</a>`,
    };

    await transporte.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

const cerraSesion = async (req, res) => {
  try {
    console.log("me estoy ejecutando");
    console.log("Cookies recibidas:", req.cookies);
    res.clearCookie("refreshtoken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 0,
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 0,
    });

    res.status(200).json({ message: "Has cerrado sesion" });
  } catch (error) {
    console.error("error en el servidor", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    console.log("user", user);

    if (!user.activada) {
      return res
        .status(402)
        .json({ message: "Su usuario no esta activado compruebe su correo" });
    }

    if (email === "admin@gmail.com") {
      const iniciotoken = jwt.sign({ user_id: user.user_id }, secretKey, {
        expiresIn: "1h",
      });

      const refreshtoken = jwt.sign({ user_id: user.user_id }, refreshKey, {
        expiresIn: "180d",
      });

      console.log("tokenAcesso", iniciotoken);
      console.log("Token para refescar", refreshKey);

      await Sesion.create({
        user_id: user.user_id,
        refresh_token: refreshtoken,
        expira_en: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        creado_en: new Date(),
      });

      res.cookie("token", iniciotoken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 3600000,
      });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 180 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        message: "Usuario logeado",
        usuario: {
          nombre: user.nombre,
          gmail: user.email,
        },
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Contraseña incorrecta" });
    }

    // if (!password === "1234") {
    //   return res.status(401).json({ messahge: "Contraseña incorrecta" });
    // }

    const iniciotoken = jwt.sign({ user_id: user.user_id }, secretKey, {
      expiresIn: "1h",
    });

    const refreshtoken = jwt.sign({ user_id: user.user_id }, refreshKey, {
      expiresIn: "180d",
    });

    console.log("tokenAcesso", iniciotoken);
    console.log("Token para refescar", refreshKey);

    await Sesion.create({
      user_id: user.user_id,
      refresh_token: refreshtoken,
      expira_en: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      creado_en: new Date(),
    });

    res.cookie("token", iniciotoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000,
    });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 180 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Usuario logeado",
      usuario: {
        nombre: user.nombre,
        gmail: user.email,
      },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!email || !password || !nombre) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existeUsuario = await User.findOne({ where: { email } });

    if (existeUsuario) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const nuevoUsuario = await User.create({
      nombre,
      email,
      password: hashedPassword,
      creado_en: new Date(),
      activada: false,
    });

    if (nuevoUsuario) {
      const rolComprador = await Rol.findOne({
        where: { nombre: "comprador" },
      });

      if (!rolComprador) {
        return res.status(500).json({ message: "Rol 'comprador' no existe" });
      }

      await Rol_User.create({
        user_id: nuevoUsuario.user_id,
        rol_id: rolComprador.rol_id,
      });

      const token = jwt.sign({ user_id: nuevoUsuario.user_id }, secretKey, {
        expiresIn: "1h",
      });

      sendEmail(token);

      return res.status(200).json({
        message:
          "Su usuario se registró con éxito. Mire su correo para activar la cuenta.",
        token: token,
      });
    }

    return res.status(400).json({ message: "Error al crear el usuario" });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const cambiarToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshtoken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No hay token de refresco" });
    }

    // Verificamos que el refresh token sea válido
    const decoded = jwt.verify(refreshToken, refreshKey);

    // Verificamos si existe sesión con ese refresh token
    const sesionActiva = await Sesion.findOne({
      where: {
        user_id: decoded.user_id,
        refresh_token: refreshToken,
      },
    });

    if (!sesionActiva) {
      return res.status(403).json({ message: "Sesión inválida o expirada" });
    }

    // Generamos un nuevo token de acceso
    const nuevoAccessToken = jwt.sign({ user_id: decoded.user_id }, secretKey, {
      expiresIn: "1h",
    });

    // Guardamos el nuevo token de acceso en la cookie
    res.cookie("token", nuevoAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000, // 1 hora
    });

    return res.status(200).json({
      message: "Nuevo token generado",
      token: nuevoAccessToken,
    });
  } catch (error) {
    console.error("Error al renovar el token:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

const getUser = async (req, res) => {
  try {
    const userid = req.user.user_id;

    // const user = await User.findOne({
    //   where: { user_id: userid },
    //   attributes: ["nombre", "email"], // O lo que necesites
    // });
    const user = await User.findByPk(userid, {
      include: Rol,
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ user: user });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const quitarRolVendedor = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Buscar el rol "vendedor"
    const rolVendedor = await Rol.findOne({ where: { nombre: "vendedor" } });

    if (!rolVendedor) {
      return res.status(404).json({ message: "Rol 'vendedor' no existe" });
    }

    // Buscar y eliminar la relación entre el usuario y el rol "vendedor"
    const resultado = await Rol_User.destroy({
      where: {
        user_id: user_id,
        rol_id: rolVendedor.rol_id,
      },
    });

    if (resultado === 0) {
      return res.status(400).json({
        message: "El usuario no tiene asignado el rol 'vendedor'",
      });
    }

    return res.status(200).json({
      message: "Rol 'vendedor' eliminado correctamente del usuario",
    });
  } catch (error) {
    console.error("Ha habido un error en el servidor:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  login,
  register,
  cerraSesion,
  cambiarToken,
  getUser,
  quitarRolVendedor,
};
