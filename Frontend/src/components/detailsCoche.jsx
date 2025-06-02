import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "800px",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  outline: "none",
  borderRadius: 8,
  overflow: "hidden",
};

function DetailsCoche() {
  const { id } = useParams();
  const [cargando, setCargando] = useState(false);
  const [coche, setCoche] = useState({});
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();

  const sendDetailsCoche = async () => {
    try {
      const response = await fetch(`https://localhost:3002/api/Car/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCoche(data);
        setImagenSeleccionada(data.imagenes?.[0]?.url || null);
        setCargando(true);
      } else {
        console.error("Error en su consulta");
      }
    } catch (error) {
      console.error("Ha ocurrido un error en el servidor", error);
    }
  };

  useEffect(() => {
    sendDetailsCoche();
  }, [id]);

  const cambiarImagen = (direccion) => {
    const indexActual = coche.imagenes.findIndex(
      (img) => img.url === imagenSeleccionada
    );
    const nuevoIndex =
      (indexActual + direccion + coche.imagenes.length) % coche.imagenes.length;
    setImagenSeleccionada(coche.imagenes[nuevoIndex].url);
  };

  const caracteristicas = coche.caracteristicas?.[0] || {};

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4] text-gray-800 font-sans">
      <Header />

      {!cargando ? (
        <div className="flex flex-1 justify-center items-center py-16">
          <p className="text-xl font-medium text-gray-500 animate-pulse">
            Cargando...
          </p>
        </div>
      ) : (
        <main className="flex-1 flex justify-center items-start py-12 px-4 md:px-8">
          <div className="bg-white shadow-md rounded-xl w-full max-w-6xl overflow-hidden">
            {/* Imagen principal */}
            <div
              className="relative w-full bg-black/5 flex items-center justify-center p-4 h-[300px] md:h-[400px] cursor-pointer"
              onClick={() => setModalAbierto(true)}
            >
              {imagenSeleccionada && (
                <img
                  src={imagenSeleccionada}
                  alt="Imagen coche ampliada"
                  className="max-h-full max-w-full object-contain rounded-lg shadow"
                />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cambiarImagen(-1);
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow"
              >
                <ion-icon
                  name="arrow-back-circle-outline"
                  size="large"
                ></ion-icon>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cambiarImagen(1);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow"
              >
                <ion-icon
                  name="arrow-forward-circle-outline"
                  size="large"
                ></ion-icon>
              </button>
            </div>

            {/* Miniaturas */}
            <div className="flex gap-2 p-4 overflow-x-auto bg-white border-b">
              {coche.imagenes?.map((img, index) => (
                <img
                  key={img.imagen_id}
                  src={img.url}
                  alt={`Imagen ${index + 1}`}
                  className={`h-20 w-32 object-cover cursor-pointer rounded-md border-2 transition-all duration-200 ${
                    imagenSeleccionada === img.url
                      ? "border-orange-500 scale-105"
                      : "border-gray-200"
                  }`}
                  onClick={() => setImagenSeleccionada(img.url)}
                />
              ))}
            </div>

            {/* Detalles */}
            <div className="p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {coche.Modelo?.modelo} {coche.Modelo?.Marca?.marca}
              </h1>
              <p className="text-2xl font-semibold text-orange-600 mb-4">
                {coche.precio} €
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm md:text-base mb-6">
                <p>
                  <strong>Año:</strong> {coche.anio_fabricacion}
                </p>
                <p>
                  <strong>Kilómetros:</strong> {coche.km} km
                </p>
                <p>
                  <strong>Ubicación:</strong> {coche.ubicacion}
                </p>
                <p>
                  <strong>Color:</strong> {caracteristicas.color}
                </p>
                <p>
                  <strong>Transmisión:</strong> {caracteristicas.transmision}
                </p>
                <p>
                  <strong>Combustible:</strong> {caracteristicas.combustible}
                </p>
                <p>
                  <strong>Motor:</strong> {caracteristicas.motor}
                </p>
                <p>
                  <strong>Potencia:</strong> {caracteristicas.potencia} CV
                </p>
                <p>
                  <strong>Cilindrada:</strong> {caracteristicas.cilindrada} cc
                </p>
                <p>
                  <strong>Consumo:</strong> {caracteristicas.consumo} L/100km
                </p>
                <p>
                  <strong>Puertas:</strong> {caracteristicas.puertas}
                </p>
                <p>
                  <strong>Plazas:</strong> {caracteristicas.plazas}
                </p>
                <p>
                  <strong>Tracción:</strong> {caracteristicas.traccion}
                </p>
                <p>
                  <strong>Garantía:</strong> {coche.garantia} meses
                </p>
              </div>

              {/* Descripción */}
              {coche.descripcion && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {coche.descripcion}
                  </p>
                </div>
              )}

              {/* Botones */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-md font-semibold text-sm sm:w-auto w-full cursor-pointer">
                  Contactar con el Vendedor
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium text-sm sm:w-auto w-full cursor-pointer"
                  onClick={() => navigate("/calcularFin")}
                >
                  Calcular Financiación
                </button>
                <button
                  className="bg-gray-100 border border-gray-300 hover:bg-white text-gray-700 px-6 py-3 rounded-md text-sm sm:w-auto w-full cursor-pointer"
                  onClick={() => navigate("/catalogo")}
                >
                  Volver al Catálogo
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      <Footer />

      {/* Modal de imagen ampliada */}
      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)}>
        <Box sx={modalStyle}>
          <div className="relative w-full h-full flex items-center justify-center bg-black/90 p-4">
            <img
              src={imagenSeleccionada}
              alt="Imagen ampliada"
              className="max-h-[80vh] max-w-full object-contain rounded-md"
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl hover:text-red-400"
              onClick={() => setModalAbierto(false)}
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full"
              onClick={() => cambiarImagen(-1)}
            >
              <ion-icon
                name="arrow-back-circle-outline"
                size="large"
              ></ion-icon>
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full"
              onClick={() => cambiarImagen(1)}
            >
              <ion-icon
                name="arrow-forward-circle-outline"
                size="large"
              ></ion-icon>
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default DetailsCoche;
