const sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const dbDatos = new sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

const testConnection = async () => {
  try {
    await dbDatos.authenticate();
    console.log("Conexión exitosa a la base de datos de los datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
  }
};

testConnection();

module.exports = dbDatos;
