// models/CocheTipo.js
const { DataTypes } = require("sequelize");
const bdDatos = require("../bdDatos");
const Coche = require("./Coche");
const TipoVehiculo = require("./TipoVehiculo");

const CocheTipo = bdDatos.define(
  "CocheTipo",
  {
    coche_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    tipo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "CocheTipo",
    timestamps: false,
  }
);

// Relaciones N:M
Coche.belongsToMany(TipoVehiculo, {
  through: CocheTipo,
  foreignKey: "coche_id",
});
TipoVehiculo.belongsToMany(Coche, {
  through: CocheTipo,
  foreignKey: "tipo_id",
});

module.exports = CocheTipo;
