const tipoVehiculo = require("../models/TipoVehiculo");
const Marca = require("../models/Marca");
const Coche = require("../models/Coche");
const { where, Model } = require("sequelize");
const Modelo = require("../models/Modelo");

const getTipoVehiculos = async (req, res) => {
  try {
    const tipoVehiculoAll = await tipoVehiculo.findAll();
    res.status(200).json(tipoVehiculoAll);
  } catch (error) {
    console.error("error en el servidor: ", error);
    res.status(500).json({ message: "error en el servidor" });
  }
};

const getMarcas = async (req, res) => {
  try {
    const Marcas = await Marca.findAll();
    res.status(200).json(Marcas);
  } catch (error) {
    console.error("error en el servidor", error);
    res.status(500).json({ message: "error en el servidor" });
  }
};

const getMarcasCoches = async (req, res) => {
  try {
    const sendMarca = req.params.marca;
    const MarcaSend = await Marca.findAll({ where: { marca: sendMarca } });

    const cochesMarca = await Coche.findAll({
      include: {
        model: Modelo,
        require: true,
        where: { marca_id: MarcaSend[0].dataValues.marca_id },
      },
    });

    res.status(200).json(cochesMarca);
  } catch (error) {
    console.error("error en el servidor", error);
    res.status(500).json({ message: "error en el servidor" });
  }
};

module.exports = { getTipoVehiculos, getMarcas, getMarcasCoches };
