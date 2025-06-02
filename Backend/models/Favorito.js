// models/Favorito.js
const { DataTypes } = require("sequelize");
const bdDatos = require("../bdDatos");
const Coche = require("./Coche");

const Favorito = bdDatos.define(
  "Favorito",
  {
    favorito_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Favorito",
    timestamps: false,
  }
);

// Relación entre Favorito y Coche
Favorito.belongsTo(Coche, { foreignKey: "coche_id" });

module.exports = Favorito;
