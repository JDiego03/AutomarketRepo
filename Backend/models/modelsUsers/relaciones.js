const User = require("./User");
const Rol = require("./Rol");
const Rol_User = require("./Rol_User");
const Sesion = require("./Sesion");

User.hasMany(Sesion, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Sesion.belongsTo(User, {
  foreignKey: "user_id",
});

User.belongsToMany(Rol, {
  through: Rol_User,
  foreignKey: "user_id",
  otherKey: "rol_id",
});

Rol.belongsToMany(User, {
  through: Rol_User,
  foreignKey: "rol_id",
  otherKey: "user_id",
});

// 🔧 ASOCIACIONES FALTANTES:
Rol_User.belongsTo(Rol, { foreignKey: "rol_id" }); // <--- NECESARIA
Rol.hasMany(Rol_User, { foreignKey: "rol_id" }); // <--- opcional pero útil

module.exports = { User, Rol, Rol_User, Sesion };
