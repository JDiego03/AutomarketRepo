import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function CalcularFinan() {
  const [fin, setFin] = useState({
    intereses: 0,
    precioTotal: 0,
    meses: 0,
    entrada: 0,
  });
  const [resultado, setResultado] = useState({
    interesesTotales: 0,
    cuotaMensual: 0,
    totalPagar: 0,
  });
  const navigate = useNavigate();

  const formatearMoneda = (valor) => {
    return valor.toFixed(2).toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFin({
      ...fin,
      [name]: parseFloat(value),
    });
  };

  useEffect(() => {
    if (fin.precioTotal && fin.intereses && fin.meses) {
      const iMensuales = fin.intereses / 12 / 100;
      const m = fin.meses;
      const T = fin.precioTotal - fin.entrada;

      const cMensual =
        (T * iMensuales * Math.pow(1 + iMensuales, m)) /
        (Math.pow(1 + iMensuales, m) - 1);

      const tPagar = cMensual * m;
      const interesesP = tPagar - T;
      const totalCoche = tPagar + fin.entrada;

      setResultado({
        interesesTotales: formatearMoneda(interesesP),
        cuotaMensual: formatearMoneda(cMensual),
        totalPagar: formatearMoneda(totalCoche),
      });
    }
  }, [fin]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header>
        <Header />
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-8">
        <div className="flex flex-col items-center gap-3 rounded-xl px-6 py-4 shadow-md bg-white w-full max-w-2xl">
          <div
            className="self-start"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ion-icon
              name="caret-back-outline"
              className="text-2xl text-amber-500 cursor-pointer border border-amber-400 rounded-lg p-2 hover:bg-orange-100"
            ></ion-icon>
          </div>

          <p className="text-center text-3xl font-semibold text-orange-500">
            Calcular Financiación
          </p>
        </div>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 w-full max-w-2xl bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="precioTotal"
              className="text-sm font-medium text-gray-700"
            >
              Precio Total
            </label>
            <input
              id="precioTotal"
              name="precioTotal"
              type="number"
              className="border border-amber-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={fin.precioTotal}
              onChange={handleChange}
              placeholder="Precio"
              step="0.01"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="intereses"
              className="text-sm font-medium text-gray-700"
            >
              Intereses
            </label>
            <input
              id="interes"
              name="intereses"
              type="number"
              className="border border-amber-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={fin.intereses}
              onChange={handleChange}
              placeholder="Intereses"
              step="0.01"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="entrada"
              className="text-sm font-medium text-gray-700"
            >
              Entrada
            </label>
            <input
              id="entradaPrecio"
              name="entrada"
              type="number"
              className="border border-amber-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={fin.entrada}
              onChange={handleChange}
              placeholder="Entrada"
              step="0.01"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="meses"
              className="text-sm font-medium text-gray-700"
            >
              Meses
            </label>
            <input
              id="meses"
              name="meses"
              type="number"
              className="border border-amber-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
              value={fin.meses}
              onChange={handleChange}
              placeholder="Meses"
            />
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 border border-orange-500 p-6 rounded-xl shadow-md bg-white w-full max-w-3xl">
          {[
            { label: "Cuota Mensual", value: resultado.cuotaMensual },
            { label: "Intereses Total", value: resultado.interesesTotales },
            { label: "Total a Pagar", value: resultado.totalPagar },
          ].map((item, index) => (
            <div className="flex flex-col items-center gap-2" key={index}>
              <p className="font-semibold text-lg">{item.label}</p>
              <p className="text-2xl text-orange-500 font-bold">
                {item.value} €
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default CalcularFinan;
