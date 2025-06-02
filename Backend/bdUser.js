const sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const dbUser = new sequelize(
  process.env.DB_NAME_USER,
  process.env.DB_USER_USER,
  process.env.DB_PASSWORD_USER,
  {
    host: process.env.DB_HOST_USER,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT_USER,
    logging: false,
  }
);

const testConnection = async () => {
  try {
    await dbUser.authenticate();
    console.log("Conexión exitosa a la base de datos de los usuarios");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
  }
};

testConnection();

module.exports = dbUser;
