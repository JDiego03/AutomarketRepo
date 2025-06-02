const Coche = require("./Coche");
const Imagen = require("./Imagen");
const Modelo = require("./Modelo");
const Marca = require("./Marca");

// Relaciones
Coche.belongsTo(Modelo, { foreignKey: "modelo_id" });
Modelo.belongsTo(Marca, { foreignKey: "marca_id" });

Coche.hasMany(Imagen, { foreignKey: "coche_id", as: "imagenes" });
Imagen.belongsTo(Coche, { foreignKey: "coche_id", as: "coche" });

module.exports = {
  Coche,
  Imagen,
  Modelo,
  Marca,
};
