const { DataTypes } = require("sequelize");
const bdUser = require("../../bdUser");

const Rol_User = bdUser.define(
  "Rol_User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    rol_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "Rol_User",
    timestamps: false,
  }
);

module.exports = Rol_User;
