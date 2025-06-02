const { DataTypes } = require("sequelize");
const bdUser = require("../../bdUser");

const Rol = bdUser.define(
  "Rol",
  {
    rol_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "Rol",
    timestamps: false,
  }
);

module.exports = Rol;
