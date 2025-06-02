// controllers/cochesController.js
const Coche = require("../models/Coche");
const Caracteristica = require("../models/Caracteristica");
const Imagen = require("../models/Imagen");
const Favorito = require("../models/Favorito");
const CocheTipo = require("../models/CocheTipo");
const Modelo = require("../models/Modelo");
const Marca = require("../models/Marca");
const { Rol_User, Rol } = require("../models/modelsUsers/relaciones");

const { where } = require("sequelize");

const getModelos = async (req, res) => {
  try {
    const marca_id = req.params.marca_id;
    const modelos = await Modelo.findAll({
      where: { marca_id: marca_id },
    });
    res.status(200).json(modelos);
  } catch (error) {
    console.error("Error al obtener modelos:", error.message);
    res.status(500).json({ message: "Error al obtener los modelos" });
  }
};

const getAllCoches = async (req, res) => {
  try {
    const coches = await Coche.findAll();
    res.status(200).json(coches);
  } catch (error) {
    console.error("Error al obtener coches:", error.message);
    res.status(500).json({ message: "Error al obtener los coches" });
  }
};

const countCars = async (req, res) => {
  try {
    const cochesTamaño = await Coche.count();
    res.status(200).json({ tamaño: cochesTamaño });
  } catch (error) {
    console.error("Ocurrio un error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const getPageCoches = async (req, res) => {
  try {
    let coches;
    let hasMore = false;
    const totalCochesBD = await Coche.count();
    const { page, limit, filter } = req.query;

    if (!page || !limit) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const pageNumber = parseInt(page);
    const limitCars = parseInt(limit);
    const skip = (pageNumber - 1) * limitCars;

    if (filter) {
      const filterId = parseInt(filter);
      const tipoVehiculo = await CocheTipo.findByPk(filterId);

      if (!tipoVehiculo) {
        return res
          .status(404)
          .json({ message: "Tipo de vehículo no encontrado" });
      }

      const cochesFiltrados = await CocheTipo.findAll({
        where: { tipo_id: filterId },
      });

      const cocheIds = cochesFiltrados.map((c) => c.coche_id);

      coches = await Coche.findAll({
        where: { coche_id: cocheIds },
        limit: limitCars,
        offset: skip,
        include: {
          model: Modelo,
          include: { model: Marca },
        },
      });

      const cochesFinal = [];

      for (const coche of coches) {
        const coche_id = coche.coche_id;

        const imagen = await Imagen.findOne({
          where: { coche_id },
          order: [["imagen_id", "ASC"]],
        });

        const caracteristicas = await Caracteristica.findAll({
          where: { coche_id },
        });

        cochesFinal.push({
          ...coche.toJSON(),
          imagen,
          caracteristicas,
        });
      }

      const tamañoCochesFiltrados = cocheIds.length;
      hasMore = tamañoCochesFiltrados > skip + limitCars;

      return res.status(200).json({
        tamaño: tamañoCochesFiltrados,
        hasMore,
        coches: cochesFinal,
      });
    } else {
      coches = await Coche.findAll({
        limit: limitCars,
        offset: skip,
        include: {
          model: Modelo,
          include: { model: Marca },
        },
      });

      const cochesFinal = [];

      for (const coche of coches) {
        const coche_id = coche.coche_id;

        const imagen = await Imagen.findOne({
          where: { coche_id },
          order: [["imagen_id", "ASC"]],
        });

        const caracteristicas = await Caracteristica.findAll({
          where: { coche_id },
        });

        cochesFinal.push({
          ...coche.toJSON(),
          imagen,
          caracteristicas,
        });
      }

      hasMore = totalCochesBD > skip + limitCars;

      return res.status(200).json({
        tamaño: totalCochesBD,
        hasMore,
        coches: cochesFinal,
      });
    }
  } catch (error) {
    console.error("Error al obtener coches:", error.message);
    res.status(500).json({ message: "Error al obtener los coches" });
  }
};

const getCocheById = async (req, res) => {
  try {
    console.log(req.params);
    const coche_id = req.params.id;
    const coche = await Coche.findByPk(coche_id, {
      include: { model: Modelo, include: { model: Marca } },
    });
    if (!coche) {
      return res.status(404).json({ message: "Coche no encontrado" });
    }

    const imagenes = await Imagen.findAll({ where: { coche_id: coche_id } });

    // const urlimg = imagenObject.url;

    const caracteristicas = await Caracteristica.findAll({
      where: { coche_id: coche_id },
    });
    res.status(200).json({ ...coche.toJSON(), caracteristicas, imagenes });
  } catch (error) {
    console.error("Error al obtener el coche:", error.message);
    res.status(500).json({ message: "Error al obtener el coche" });
  }
};

const createCoche = async (req, res) => {
  try {
    const cocheNew = req.body;
    const user_id = req.user.user_id;
    cocheNew.user_id = user_id;

    console.log("Json de lo que llega: ", cocheNew);

    // Obtener todos los roles del usuario
    const rolesUsuario = await Rol_User.findAll({
      where: { user_id },
      include: { model: Rol },
    });

    // Extraer nombres de roles
    const nombresRoles = rolesUsuario.map((r) => r.Rol.nombre);

    const tieneSoloComprador =
      nombresRoles.length === 1 && nombresRoles.includes("comprador");

    if (tieneSoloComprador) {
      // Buscar rol "vendedor"
      const rolVendedor = await Rol.findOne({ where: { nombre: "vendedor" } });

      if (!rolVendedor) {
        return res.status(500).json({ message: "Rol 'vendedor' no existe" });
      }

      // Asignar rol "vendedor" al usuario
      await Rol_User.create({
        user_id,
        rol_id: rolVendedor.rol_id,
      });

      console.log(`Rol 'vendedor' asignado al usuario ${user_id}`);
    }

    const CreateCarNew = await Coche.create(cocheNew);

    res.status(200).json({
      message: "Su coche se creó correctamente",
      CreateCarNew,
    });
  } catch (error) {
    console.error("Error al crear el coche:", error.message);
    res.status(400).json({ message: "Error al crear el coche" });
  }
};

const createCaracteristica = async (req, res) => {
  try {
    const createCaracteristica = req.body;
    const user_id = req.user.user_id;
    createCaracteristica.user_id = user_id;
    console.log("Json de lo que llega: ", createCaracteristica);
    const result = await Caracteristica.create(createCaracteristica);
    res
      .status(200)
      .json({ message: "Su result se creo correctamente", result });
  } catch (error) {
    console.error("Error al crear el Caracteristicas:", error.message);
    res.status(400).json({ message: "Error al crear el Caracteristicas" });
  }
};

const updateCoche = async (req, res) => {
  try {
    const coche_id = req.params.id;
    const coche = await Coche.findByPk(coche_id);
    if (!coche) {
      res.status(404).json({ message: "Coche no encontrado" });
    }
    const cocheUpdate = req.body;
    await Coche.update(cocheUpdate, {
      where: { coche_id: coche_id },
    });
    res.status(200).json({
      message: "Su coche se actualizo correctamente",
      cocheUpdate,
    });
  } catch (error) {
    console.error("Error al actualizar el coche:", error.message);
    res.status(400).json({ message: "Error al actualizar el coche" });
  }
};

const deleteCoche = async (req, res) => {
  try {
    const coche_id = req.params.id;
    const coche = await Coche.findByPk(coche_id);
    if (!coche) {
      return res.status(404).json({ message: "coche no encontrado" });
    }
    console.log("coche encontrado:", coche);
    await CocheTipo.destroy({
      where: { coche_id: coche_id },
    });
    await Favorito.destroy({
      where: { coche_id: coche_id },
    });
    await Imagen.destroy({
      where: { coche_id: coche_id },
    });
    await Caracteristica.destroy({
      where: { coche_id: coche_id },
    });
    await Coche.destroy({
      where: { coche_id: coche_id },
    });
    res.status(200).json({
      message: "Su coche y sus relaciones se eliminaron correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar el coche:", error.message);
    res.status(400).json({ message: "Error al eliminar el coche" });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No se subieron imágenes" });
    }

    const { coche_id } = req.body;
    if (!coche_id) {
      return res.status(400).json({ message: "Falta el coche_id" });
    }

    const imagenesCreadas = [];

    // Obtener la base de la URL con protocolo y host
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    for (const file of req.files) {
      const urlImagen = `${baseUrl}/imagenes/imagenes_coches/NewCoches/${file.filename}`;

      const nuevaImagen = await Imagen.create({
        coche_id,
        url: urlImagen,
      });

      imagenesCreadas.push(nuevaImagen);
    }

    res.status(201).json({
      message: "Imágenes subidas correctamente",
      imagenes: imagenesCreadas,
    });
  } catch (error) {
    console.error("Error al subir las imágenes:", error);
    res.status(500).json({ message: "Error al subir las imágenes" });
  }
};

module.exports = {
  getAllCoches,
  getCocheById,
  createCoche,
  updateCoche,
  deleteCoche,
  getPageCoches,
  countCars,
  getModelos,
  createCaracteristica,
  uploadImage,
};
