import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";

function CochesUser() {
  const [misCoches, setMisCoches] = useState([]);
  const { refrescarUsuario } = useUserContext();
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const obtenerMisCoches = async () => {
    try {
      const response = await fetch("https://localhost:3002/api/user/car", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMisCoches(data);
      } else {
        console.error("Error al obtener tus coches");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
    } finally {
      setCargando(false);
    }
  };

  const borrarCoche = async (coche_id) => {
    try {
      const response = await fetch(
        `https://localhost:3002/api/Cars/${coche_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        const nuevosCoches = misCoches.filter(
          (coche) => coche.coche_id !== coche_id
        );

        setMisCoches(nuevosCoches);

        // Si ya no quedan coches, redirigir al home
        if (nuevosCoches.length === 0) {
          await quitarRolVendedor();
        }
      } else {
        console.error("No se pudo borrar el coche");
      }
    } catch (error) {
      console.error("Error al borrar el coche:", error);
    }
  };

  const quitarRolVendedor = async () => {
    try {
      const respuesta = await fetch(
        "https://localhost:3002/api/user/quitarRolVendedor",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (respuesta.ok) {
        console.log("se quito el rol de vendedor al usuario");
        await refrescarUsuario();
        navigate("/");
      }
    } catch (error) {
      console.error("error en el servidor", error);
    }
  };

  useEffect(() => {
    obtenerMisCoches();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4] text-gray-800 font-sans">
      <Header />

      <main className="flex-1 px-4 md:px-8 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">
          Mis Coches Publicados
        </h1>

        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500 animate-pulse">Cargando...</p>
          </div>
        ) : misCoches.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Aún no has publicado ningún coche.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {misCoches.map((coche) => (
              <div
                key={coche.coche_id}
                className="bg-white rounded-xl shadow-md overflow-hidden relative group transition"
              >
                <button
                  onClick={() => borrarCoche(coche.coche_id)}
                  className="cursor-pointer absolute top-3 right-3 z-10 bg-white text-red-500 hover:bg-red-100 hover:text-red-700 shadow-md hover:shadow-lg rounded-full p-2 transition-all duration-200"
                  title="Eliminar coche"
                  aria-label="Eliminar coche"
                >
                  <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                </button>

                <div className="h-48 bg-black/5">
                  <img
                    src={coche.imagen?.url}
                    alt={`${coche.Modelo?.modelo} ${coche.Modelo?.Marca?.marca}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 space-y-1">
                  <h2 className="text-xl font-semibold">
                    {coche.Modelo?.Marca?.marca} {coche.Modelo?.modelo}
                  </h2>
                  <p className="text-orange-600 font-bold text-lg">
                    {coche.precio} €
                  </p>
                  <p className="text-sm text-gray-600">
                    {coche.anio_fabricacion} - {coche.km} km
                  </p>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => navigate(`/detailsCar/${coche.coche_id}`)}
                    className="mt-2 w-full bg-orange-600 hover:bg-orange-500 text-white text-sm py-2 px-4 rounded-md transition"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CochesUser;
