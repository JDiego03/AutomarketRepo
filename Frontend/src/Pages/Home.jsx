import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import TipoVehiculos from "../components/TipoVehiculos";
import { useFilterContext } from "../context/filterContext";
import urlAnuncio from "../assets/anuncio.jpeg";

function Home() {
  const { setFilter } = useFilterContext();
  const [ir, setIr] = useState(false);
  const [cocheTamaño, setCocheTamaño] = useState(null);
  const navigate = useNavigate();

  const sendCochesTamaño = async () => {
    try {
      const respuesta = await fetch("https://localhost:3002/api/CountCars");
      if (respuesta.ok) {
        const data = await respuesta.json();
        setCocheTamaño(data.tamaño);
      } else {
        console.error("Error al obtener el tamaño de coches de la BD");
      }
    } catch (error) {
      console.error("Error en la respuesta del servidor: ", error);
    }
  };

  useEffect(() => {
    sendCochesTamaño();
  }, []);

  useEffect(() => {
    if (ir) {
      return navigate("/catalogo");
    }
  });
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="z-10 relative">
          <Header />
        </header>

        <main className="flex flex-col justify-center items-center px-4 md:px-0">
          <div
            className="relative w-full bg-cover bg-center min-h-[200px] sm:min-h-[300px] md:min-h-[550px] bg-no-repeat"
            style={{ backgroundImage: `url(${urlAnuncio})` }}
          ></div>
          <section className="mt-10">
            <button
              type="button"
              aria-label="Ver Catalogo"
              onClick={() => {
                setIr(true);
                setFilter(0);
              }}
              className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-lg font-semibold cursor-pointer"
            >
              Ver Disponibles ({cocheTamaño ? cocheTamaño : "Cargando..."})
            </button>
          </section>
          <section>
            <TipoVehiculos />
          </section>
        </main>

        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default Home;
