// models/Coche.js
const { DataTypes } = require("sequelize");
const bdDatos = require("../bdDatos");
const Modelo = require("./Modelo");

const Coche = bdDatos.define(
  "Coche",
  {
    coche_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    anio_fabricacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    km: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    garantia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Coche",
    timestamps: false,
  }
);

// Relación entre Coche y Modelo
Coche.belongsTo(Modelo, { foreignKey: "modelo_id" });

module.exports = Coche;
