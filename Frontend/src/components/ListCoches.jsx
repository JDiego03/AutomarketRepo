import { useState, useEffect } from "react";
import InfinitoScroll from "react-infinite-scroll-component";
import { useFilterContext } from "../context/filterContext";
import { Link } from "react-router-dom";
import { Badge, Flex } from "@radix-ui/themes";
import { useUserContext } from "../context/userContext";

function ListCoches() {
  const { filter } = useFilterContext();
  const limit = 2;
  const [listCoches, setlistCoches] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { usuarioLogin } = useUserContext();

  const getCoches = async () => {
    let response;
    if (filter === 0) {
      response = await fetch(
        `https://localhost:3002/api/Cars/filtro?page=${page}&limit=${limit}`
      );
    } else {
      response = await fetch(
        `https://localhost:3002/api/Cars/filtro?page=${page}&limit=${limit}&filter=${filter}`
      );
    }
    if (response.ok) {
      const data = await response.json();
      setlistCoches((prev) => [...prev, ...data.coches]);
      if (data.hasMore) {
        setPage((prev) => prev + 1);
        setCargando(false);
      } else {
        setHasMore(false);
      }
      setResultado(data.tamaño);
    } else {
      console.log("Algo fue mal");
    }
  };

  const añadirFavoritos = async (coche_id) => {
    try {
      const respuesta = await fetch(
        `https://localhost:3002/api/user/car/favoritos/${coche_id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (respuesta.status === 201) {
        console.log("se añadio el coche a favoritos");
      } else {
        console.error("Algo salio mal");
      }
    } catch (error) {
      console.error("Error en el servidor", error);
    }
  };

  useEffect(() => {
    getCoches();
  }, [filter]);

  return (
    <>
      {cargando ? (
        <div className="flex justify-center items-center py-16">
          <p className="text-lg font-medium text-gray-500 animate-pulse">
            Cargando...
          </p>
        </div>
      ) : (
        <div className="px-4 md:px-10 py-6 flex justify-center">
          <InfinitoScroll
            dataLength={listCoches.length}
            next={getCoches}
            hasMore={hasMore}
            loader={
              <div className="text-center py-8">
                <p className="text-base text-gray-500 animate-pulse">
                  Cargando más coches...
                </p>
              </div>
            }
            endMessage={
              <p className="text-center font-semibold text-xl py-6 text-gray-700">
                ¡Ya no hay más coches!
              </p>
            }
          >
            <p className="text-xl font-semibold mb-8 text-gray-800 text-left">
              Resultados: <span className="text-orange-600">{resultado}</span>
            </p>

            <div className="grid gap-10 grid-cols-1 md:grid-cols-2 place-items-center">
              {listCoches.map((coche) => (
                <div
                  key={coche.coche_id}
                  className="relative bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden w-full max-w-[500px]"
                >
                  {usuarioLogin && (
                    <button
                      onClick={() => añadirFavoritos(coche.coche_id)}
                      className="cursor-pointer absolute top-3 right-3 z-10 bg-white text-orange-500 hover:bg-orange-100 hover:text-orange-600 shadow-md hover:shadow-lg rounded-full p-2 transition-all duration-200"
                      title="Añadir a favoritos"
                      aria-label="Añadir a favoritos"
                    >
                      <ion-icon
                        name="bookmark-outline"
                        class="text-xl"
                      ></ion-icon>
                    </button>
                  )}

                  <img
                    src={coche.imagen.url}
                    alt={`Coche ${coche.coche_id}`}
                    className="w-full h-64 object-cover"
                  />
                  {coche.km === 0 && (
                    <Flex className="mt-5 ml-5">
                      <Badge color="orange" size="3">
                        Nuevo
                      </Badge>
                    </Flex>
                  )}
                  <div className="p-6 flex flex-col justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {coche.Modelo.Marca.marca} {coche.Modelo.modelo}
                      </h2>
                      <p className="text-xl font-bold text-orange-600">
                        {coche.precio} €
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 mt-2">
                      <p>
                        <span className="font-medium">Año:</span>{" "}
                        {coche.anio_fabricacion}
                      </p>
                      <p>
                        <span className="font-medium">Km:</span> {coche.km} km
                      </p>
                      <p>
                        <span className="font-medium">Garantía:</span>{" "}
                        {coche.garantia}
                      </p>
                      <p className="col-span-2">
                        <span className="font-medium">Ubicación:</span>{" "}
                        {coche.ubicacion}
                      </p>
                    </div>

                    <Link
                      to={`/detailsCar/${coche.coche_id}`}
                      className="mt-4 block text-center bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-md text-sm font-medium transition"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </InfinitoScroll>
        </div>
      )}
    </>
  );
}

export default ListCoches;
