import React, { useEffect, useState } from "react";
import { useFilterContext } from "../context/filterContext";
import { useNavigate } from "react-router-dom";

function TipoVehiculos() {
  const { setFilter } = useFilterContext();
  const [loading, setLoading] = useState(false);
  const [irCatalogo, setIrCatalogo] = useState(false);
  const [listTiposVehiculos, setTiposVehiculos] = useState(null);
  const navigate = useNavigate();

  const sendTiposVehiculos = async () => {
    try {
      const respuesta = await fetch("https://localhost:3002/api/tipoVehiculos");
      if (respuesta.ok) {
        const data = await respuesta.json();
        setTiposVehiculos(data);
        setLoading(true);
      } else {
        console.log("Error en la respuesta");
      }
    } catch (error) {
      console.error("Error en la respuesta de la BD: ", error);
    }
  };

  useEffect(() => {
    if (irCatalogo) {
      return navigate("/catalogo");
    }
  }, [irCatalogo, navigate]);

  useEffect(() => {
    sendTiposVehiculos();
  }, []);

  return (
    <>
      {loading ? (
        <section className="py-12 px-6">
          <div className="max-w-screen-xl mx-auto">
            <h4 className="text-center text-4xl font-semibold text-orange-600 mb-10">
              ¿Qué tipo de vehículo estás buscando?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {listTiposVehiculos && listTiposVehiculos.length > 0 ? (
                listTiposVehiculos.map((tipo) => (
                  <div
                    key={tipo.tipo_id}
                    className="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
                  >
                    <img
                      src={`/SVGTiposVehiculos/${tipo.nombre}.webp`}
                      alt={tipo.nombre}
                      className="w-28 h-28 object-contain rounded-md mt-6 mb-4 transition-transform transform hover:scale-110 cursor-pointer"
                      onClick={() => {
                        setFilter(tipo.tipo_id);
                        setIrCatalogo(true);
                      }}
                    />
                    <p className="text-center text-xl font-medium text-gray-800 mb-4">
                      {tipo.nombre}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-700 text-lg">
                  No hay tipos de vehículos disponibles.
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <p className="text-center text-gray-700 text-lg">Cargando...</p>
      )}
    </>
  );
}

export default TipoVehiculos;
