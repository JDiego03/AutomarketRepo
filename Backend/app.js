const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rutaCoches = require("./routes/RouteCar");
const rutaUser = require("./routes/RouterUser");
const rutaEmail = require("./routes/RouterEmailActive");
const rutaCarCoche = require("./routes/RouterUserCar");
const rutaTipoVehiculo = require("./routes/RouteTipoVehiculos");
const rutaFiltros = require("./routes/RouterFilter");
const path = require("path");
const cookieParse = require("cookie-parser");

require("./models/modelsUsers/relaciones"); // Importar el archivo de relaciones

const app = express();
app.use(cookieParse());
dotenv.config();

app.use(express.json());

const port = process.env.PORT || 3002;

app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
  })
);

const httpsOptions = {
  key: fs.readFileSync("CertificadoSSL/localhost-key.pem"),
  cert: fs.readFileSync("CertificadoSSL/localhost.pem"),
};

// Todas las rutas de las api
app.use("/api", rutaCoches);
app.use("/api/user", rutaUser);
app.use("/api/email", rutaEmail);
app.use("/api/user/car", rutaCarCoche);
app.use("/api/", rutaTipoVehiculo);
app.use("/api/filter", rutaFiltros);
app.use(express.static("public"));

app.use("/imagenes", express.static(path.join(__dirname, "imagenes")));

app.get("/", (req, res) => {
  res.send("Bienvenido a la API de Automarket");
});

https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Servidor HTTPS escuchando en https://localhost:${port}`);
});
