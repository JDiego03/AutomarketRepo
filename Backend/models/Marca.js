// models/Marca.js
const { DataTypes } = require("sequelize");
const bdDatos = require("../bdDatos");

const Marca = bdDatos.define(
  "Marca",
  {
    marca_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    marca: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    tableName: "Marca",
    timestamps: false, // No hay createdAt ni updatedAt en esta tabla
  }
);

module.exports = Marca;
