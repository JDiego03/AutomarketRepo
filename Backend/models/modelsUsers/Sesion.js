const { DataTypes } = require("sequelize");
const bdUser = require("../../bdUser");

const Sesion = bdUser.define(
  "Sesion",
  {
    sesion_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expira_en: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Sesion", // <- Aquí le dices a Sequelize el nombre exacto de la tabla
    timestamps: false,
  }
);

module.exports = Sesion;
