import { createContext, useContext, useState } from "react";

export const filterContext = createContext();

export function FilterContextProvider(props) {
  const [filter, setFilter] = useState(0);

  return (
    <filterContext.Provider value={{ filter, setFilter }}>
      {props.children}
    </filterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(filterContext);
  if (!context) {
    console.error("El provider no se ha encontrado tiene que envolverlo");
  } else {
    return context;
  }
}
