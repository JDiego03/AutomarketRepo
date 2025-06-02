import React, { useEffect, useState } from "react";

function Filtros() {
  const [marcas, setMarcas] = useState(null);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");

  const sendMarcas = async () => {
    try {
      const response = await fetch("https://localhost:3002/api/filter/marcas");
      if (response.ok) {
        const data = await response.json();
        setMarcas(data);
      }
    } catch (error) {
      console.error("error en el codigo o consulta", error);
    }
  };

  const handleMarca = (e) => {
    setMarcaSeleccionada(e.target.value);
  };

  useEffect(() => {
    sendMarcas();
  }, []);

  return (
    <aside className="flex flex-col gap-6 p-6 bg-amber-50 shadow rounded-xl">
      <h4 className="text-2xl font-semibold text-orange-500">Filtros</h4>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo
          </label>
          <input
            type="text"
            className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          {!marcas ? (
            <p>Cargando...</p>
          ) : (
            <select
              value={marcaSeleccionada}
              onChange={handleMarca}
              className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Seleccione una Marca</option>
              {console.log(marcas)}
              {marcas.map((marca) => {
                return (
                  <option key={marca.marca} value={marca.marca}>
                    {marca.marca}
                  </option>
                );
              })}
            </select>
            // {marcaSeleccionada && ()}
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kilometraje máximo
          </label>
          <input
            type="range"
            className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div>
          <h4 className="text-xl font-semibold text-orange-500">Precios</h4>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max.
          </label>
          <input
            type="range"
            className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min.
          </label>
          <input
            type="range"
            className="w-full p-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>
    </aside>
  );
}

export default Filtros;
