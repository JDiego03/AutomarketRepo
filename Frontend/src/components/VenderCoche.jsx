import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useUserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

function CrearCocheForm() {
  const { usuarioLogin, refrescarUsuario } = useUserContext();

  const navigate = useNavigate();

  const [creando, setCreando] = useState(false);

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("0");

  const [imagenes, setImagenes] = useState([]);

  const [cocheData, setCocheData] = useState({
    modelo_id: "",
    anio_fabricacion: "",
    precio: "",
    descripcion: "",
    km: "",
    ubicacion: "",
    garantia: "",
  });

  const [caracteristicas, setCaracteristicas] = useState({
    motor: "",
    puertas: "",
    transmision: "",
    combustible: "",
    color: "",
    traccion: "",
    cilindrada: "",
    potencia: "",
    plazas: "",
    consumo: "",
  });

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const res = await fetch("https://localhost:3002/api/filter/marcas");
        if (res.ok) {
          const data = await res.json();
          setMarcas(data);
        } else {
          console.error("Error al cargar marcas");
        }
      } catch (err) {
        console.error("Error al cargar marcas:", err);
      }
    };

    fetchMarcas();
  }, []);

  const handleMarcaChange = async (e) => {
    const id = e.target.value;
    setMarcaSeleccionada(id);
    setModelos([]);
    setCocheData({ ...cocheData, modelo_id: "" });

    if (id === "0") return;

    try {
      const res = await fetch(`https://localhost:3002/api/modelos/${id}`);
      if (res.ok) {
        const data = await res.json();
        setModelos(data);
      } else {
        console.error("Error al cargar modelos");
      }
    } catch (err) {
      console.error("Error en la solicitud de modelos:", err);
    }
  };

  const handleCocheChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "modelo_id",
      "anio_fabricacion",
      "precio",
      "km",
      "garantia",
    ];

    const parsedValue =
      numericFields.includes(name) && value !== "" ? parseInt(value) : value;

    setCocheData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleCaracteristicaChange = (e) => {
    const { name, value } = e.target;
    setCaracteristicas((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value),
    }));
  };

  const handleImagenesChange = (e) => {
    setImagenes(Array.from(e.target.files));
  };

  const subirImagenes = async (imagenes, coche_id) => {
    const formData = new FormData();

    imagenes.forEach((img) => {
      formData.append("imagenes", img);
    });

    formData.append("coche_id", coche_id);

    try {
      const res = await fetch("https://localhost:3002/api/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      return res.ok;
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreando(true);

    try {
      const resCoche = await fetch("https://localhost:3002/api/Cars/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...cocheData,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      });

      const cocheResData = await resCoche.json();
      const coche_id = cocheResData.CreateCarNew?.coche_id;

      if (!resCoche.ok || !coche_id) {
        console.error("Error al crear el coche");
        return;
      }

      const resCaract = await fetch(
        "https://localhost:3002/api/Caracteristicas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...caracteristicas, coche_id }),
        }
      );

      if (!resCaract.ok) {
        const errRes = await resCaract.json();
        console.error("Error características:", errRes);
      }

      if (imagenes.length > 0) {
        const imagenesSubidas = await subirImagenes(imagenes, coche_id);
        if (!imagenesSubidas) {
          console.error(
            "Coche creado pero ocurrió un error al subir las imágenes."
          );
        }
      }
      await refrescarUsuario();

      navigate("/");
    } catch (err) {
      console.error("Error general:", err);
    } finally {
      setCreando(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        {creando ? (
          <div className="text-center text-orange-600 text-xl font-semibold animate-pulse">
            Creando coche, por favor espera...
          </div>
        ) : !usuarioLogin ? (
          <div className="w-full max-w-xl bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3">
              ¿Quieres vender tu coche?
            </h2>
            <p className="mb-6 leading-relaxed">
              Necesitas una cuenta para publicar tus vehículos en nuestra
              plataforma.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="inline-block bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 text-white font-semibold py-2 px-6 rounded-xl transition duration-300"
            >
              Crear cuenta
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white p-8 shadow-lg rounded-2xl">
            <h2 className="text-3xl font-extrabold mb-8 text-orange-600 tracking-wide">
              Vende tu coche
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  value={marcaSeleccionada}
                  onChange={handleMarcaChange}
                  className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                >
                  <option value="0" disabled>
                    Seleccione una Marca
                  </option>
                  {marcas.map((marca) => (
                    <option key={marca.marca_id} value={marca.marca_id}>
                      {marca.marca}
                    </option>
                  ))}
                </select>

                <select
                  name="modelo_id"
                  value={cocheData.modelo_id || ""}
                  onChange={handleCocheChange}
                  required
                  className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                >
                  <option value="" disabled>
                    Seleccione un Modelo
                  </option>
                  {modelos.map((modelo) => (
                    <option key={modelo.modelo_id} value={modelo.modelo_id}>
                      {modelo.modelo}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="anio_fabricacion"
                  placeholder="Año de fabricación"
                  required
                  className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  onChange={handleCocheChange}
                />

                <input
                  type="number"
                  name="precio"
                  placeholder="Precio (€)"
                  required
                  className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  onChange={handleCocheChange}
                />

                <input
                  type="number"
                  name="km"
                  placeholder="Kilometraje"
                  required
                  className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  onChange={handleCocheChange}
                />

                <input
                  type="text"
                  name="ubicacion"
                  placeholder="Ubicación"
                  required
                  className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  onChange={handleCocheChange}
                />

                <input
                  type="number"
                  name="garantia"
                  placeholder="Garantía (meses)"
                  required
                  className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  onChange={handleCocheChange}
                />
              </div>

              <textarea
                name="descripcion"
                placeholder="Descripción detallada del vehículo"
                required
                rows="4"
                className="w-full p-4 border border-orange-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                onChange={handleCocheChange}
              />

              <div className="mt-6">
                <label className="block mb-2 font-medium text-gray-700">
                  Subir Imágenes del Coche
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagenesChange}
                  className="w-full cursor-pointer rounded-md border border-orange-300 p-2 text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-800 tracking-wide">
                Características Técnicas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries({
                  motor: "text",
                  puertas: "number",
                  transmision: "text",
                  combustible: "text",
                  color: "text",
                  traccion: "text",
                  cilindrada: "number",
                  potencia: "number",
                  plazas: "number",
                  consumo: "number",
                }).map(([name, type]) => (
                  <input
                    key={name}
                    name={name}
                    type={type}
                    step={type === "number" ? "0.01" : undefined}
                    placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                    className="w-full p-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    onChange={handleCaracteristicaChange}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="mt-8 w-full bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 text-white font-extrabold py-4 rounded-xl transition duration-300"
              >
                Crear Coche
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CrearCocheForm;
