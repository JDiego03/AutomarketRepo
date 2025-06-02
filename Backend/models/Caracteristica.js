// models/Caracteristica.js
const { DataTypes } = require("sequelize");
const bdDatos = require("../bdDatos");
const Coche = require("./Coche");

const Caracteristica = bdDatos.define(
  "Caracteristica",
  {
    caracteristica_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    motor: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    puertas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transmision: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    combustible: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    traccion: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    cilindrada: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    potencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    plazas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    consumo: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
  },
  {
    tableName: "Caracteristica",
    timestamps: false,
  }
);

// Relación entre Caracteristica y Coche
Caracteristica.belongsTo(Coche, { foreignKey: "coche_id" });

module.exports = Caracteristica;
