//en desarrollo
const { where } = require("sequelize");
const Coche = require("../models/Coche");
const Imagen = require("../models/Imagen");
const Favorito = require("../models/Favorito");
// const User = require("../models/modelsUsers/User");

const GetUserCars = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const coches = await Coche.findAll({
      where: { user_id },
    });

    if (!coches || coches.length === 0) {
      return res.status(404).json({ message: "No tienes anuncios de coches" });
    }

    const cochesFinal = [];

    for (const coche of coches) {
      const coche_id = coche.coche_id;

      const imagen = await Imagen.findOne({
        where: { coche_id },
        order: [["imagen_id", "ASC"]],
      });

      cochesFinal.push({
        ...coche.toJSON(),
        imagen,
      });
    }

    return res.status(200).json(cochesFinal);
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getUserFavoritos = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    console.log(user_id);
    const Coches = await Favorito.findAll({ where: { user_id: user_id } });
    if (Coches) {
      console.log(Coches);
      return res.status(200).json(Coches);
    }
    return res.status(400).json({ message: "No tienes anuncio de coches" });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const añadirFavorito = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const coche_id = req.params.coche_id;

    if (!user_id) {
      return res.status(401).json({ message: "No estás logueado" });
    }

    const coche = await Coche.findByPk(coche_id);
    if (!coche) {
      return res.status(404).json({ message: "No se ha encontrado el coche" });
    }

    const yaExiste = await Favorito.findOne({
      where: { user_id, coche_id },
    });

    if (yaExiste) {
      return res
        .status(409)
        .json({ message: "Este coche ya está en tus favoritos" });
    }

    const nuevoFavorito = await Favorito.create({ user_id, coche_id });

    return res.status(201).json({
      message: "Coche añadido a favoritos",
      favorito: nuevoFavorito,
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const borrarFavorito = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const coche_id = req.params.coche_id;

    if (!coche_id) {
      return res.status(400).json({ message: "Falta el ID del coche" });
    }

    const eliminado = await Favorito.destroy({
      where: {
        user_id,
        coche_id,
      },
    });

    if (eliminado === 0) {
      return res.status(404).json({ message: "No se encontró el favorito" });
    }

    return res.status(200).json({ message: "Favorito eliminado con éxito" });
  } catch (error) {
    console.error("Error al borrar favorito:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  GetUserCars,
  getUserFavoritos,
  añadirFavorito,
  borrarFavorito,
};
