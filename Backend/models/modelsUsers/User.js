const { DataTypes } = require("sequelize");
const bdUser = require("../../bdUser");

const User = bdUser.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    activada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "User",
    timestamps: false,
  }
);

module.exports = User;
