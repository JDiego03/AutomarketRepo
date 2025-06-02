// models/Imagen.js
const { DataTypes } = require("sequelize");
const bdDatos = require("../bdDatos");
const Coche = require("./Coche");

const Imagen = bdDatos.define(
  "Imagen",
  {
    imagen_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "Imagen",
    timestamps: false,
  }
);

// Relación entre Imagen y Coche
Imagen.belongsTo(Coche, { foreignKey: "coche_id" });

module.exports = Imagen;
