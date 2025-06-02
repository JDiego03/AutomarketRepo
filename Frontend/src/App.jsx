import React from "react";
import Home from "./Pages/Home";
import { Navigate, Routes, Route } from "react-router-dom";
import Catalogo from "./components/Catalogo";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import DetailsCoche from "./components/DetailsCoche";
import CalcularFinan from "./components/CalcularFinan";
import ActivarGmail from "./components/ActivarEmail";
import VenderCoche from "./components/VenderCoche";
import CochesFavoritos from "./components/CochesFavoritos";
import CochesUser from "./components/CochesUser";

function App() {
  return (
    <>
      <Routes>
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/detailsCar/:id" element={<DetailsCoche />} />
        <Route path="/calcularFin" element={<CalcularFinan />} />
        <Route path="/activarGmail" element={<ActivarGmail />} />
        <Route path="/venderCoche" element={<VenderCoche />} />
        <Route path="/favoritos" element={<CochesFavoritos />} />
        <Route path="/cochesUser" element={<CochesUser />} />
      </Routes>
    </>
  );
}

export default App;
