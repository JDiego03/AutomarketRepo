// models/Modelo.js
const { DataTypes } = require("sequelize");
const bdDatos = require("../bdDatos");
const Marca = require("./Marca");

const Modelo = bdDatos.define(
  "Modelo",
  {
    modelo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "Modelo",
    timestamps: false,
  }
);

// Relación entre Modelo y Marca
Modelo.belongsTo(Marca, { foreignKey: "marca_id" });

module.exports = Modelo;
