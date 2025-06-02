import { FilterContextProvider } from "../context/filterContext";
import Filtros from "./Filtros";
import Footer from "./Footer";
import Header from "./Header";

import ListCoches from "./ListCoches";

function Catalogo() {
  return (
    <>
      <Header />
      <div className=" grid grid-cols-3 gap-10 p-6 max-w-7xl mx-auto">
        <div className="col-span-1">
          <Filtros />
        </div>
        <div className="col-span-2">
          <ListCoches />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Catalogo;
