import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import defaultImage from "../../../Backend/imagen/seatLeon.jpg";

function CochesFavoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const obtenerFavoritos = async () => {
    try {
      const response = await fetch(
        "https://localhost:3002/api/user/car/favoritos",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();

        const cochesCompletos = await Promise.all(
          data.map((fav) =>
            fetch(`https://localhost:3002/api/car/${fav.coche_id}`, {
              credentials: "include",
            }).then((res) => res.json())
          )
        );

        setFavoritos(cochesCompletos);
      } else {
        console.error("Error al obtener los favoritos");
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
        `https://localhost:3002/api/user/car/favoritos/${coche_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Actualiza la lista quitando el coche eliminado
        setFavoritos((prev) =>
          prev.filter((coche) => coche.coche_id !== coche_id)
        );
      } else {
        console.error("No se pudo borrar el coche de favoritos");
      }
    } catch (error) {
      console.error("Error al borrar favorito:", error);
    }
  };

  useEffect(() => {
    obtenerFavoritos();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4] text-gray-800 font-sans">
      <Header />

      <main className="flex-1 px-4 md:px-8 py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Mis Coches Favoritos
        </h1>

        {cargando ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500 animate-pulse">Cargando...</p>
          </div>
        ) : favoritos.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No tienes coches en favoritos.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritos.map((coche) => (
              <div
                key={coche.coche_id}
                className="bg-white rounded-xl shadow-md overflow-hidden relative group transition"
              >
                <button
                  onClick={() => borrarCoche(coche.coche_id)}
                  className="cursor-pointer  absolute top-3 right-3 z-10 bg-white text-red-500 hover:bg-red-100 hover:text-red-700 shadow-md hover:shadow-lg rounded-full p-2 transition-all duration-200"
                  title="Eliminar de favoritos"
                  aria-label="Eliminar de favoritos"
                >
                  <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                </button>

                <div className="h-48 bg-black/5">
                  <img
                    src={coche.imagenes[0].url}
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

export default CochesFavoritos;
