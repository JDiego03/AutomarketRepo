// models/TipoVehiculo.js
const { DataTypes } = require("sequelize");
const bdDatos = require("../bdDatos");

const TipoVehiculo = bdDatos.define(
  "TipoVehiculo",
  {
    tipo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    tableName: "TipoVehiculo",
    timestamps: false,
  }
);

module.exports = TipoVehiculo;
