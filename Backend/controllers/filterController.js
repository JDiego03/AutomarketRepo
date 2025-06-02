const tipoVehiculo = require("../models/TipoVehiculo");
const cocheTipo = require("../models/CocheTipo");
const coche = require("../models/Coche");
const { where } = require("sequelize");

const getTipoCoches = async (req, res) => {
  try {
    const idTipoCoche = req.params.tipo;
    const tipoVehiculoObject = await tipoVehiculo.findByPk(idTipoCoche);
    if (!tipoVehiculoObject) {
      return res.status(404).json({ message: "Tipo de coche no encontrado" });
    }
    console.log(tipoVehiculoObject);
    const cochesPorTipoId = await cocheTipo.findAll({
      where: { tipo_id: idTipoCoche },
    });
    const coches = await coche.findAll({
      where: {
        coche_id: cochesPorTipoId.map((coche) => coche.dataValues.coche_id),
      },
    });
    const cocheTamaño = coches.length;
    return res.status(200).json({ tamaño: cocheTamaño, coches });
  } catch (error) {
    console.error("Error en su peticion", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { getTipoCoches };
