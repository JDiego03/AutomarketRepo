import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import img from "../assets/user.png"; // importa la imagen

function Register() {
  const [volver, setVolver] = useState(false);
  const [newUser, setNewUser] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [irLogin, setIrLogin] = useState(false);
  const [cargando, setCargando] = useState(false); // <-- estado cargando
  const navigate = useNavigate();

  if (volver) return navigate("/");
  if (irLogin) return navigate("/login");

  const handleUser = (e) => {
    const value = e.target.value;
    setNewUser({ ...newUser, [e.target.name]: value });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setCargando(true); // inicio carga
    try {
      const respuesta = await fetch(
        "https://localhost:3002/api/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: newUser.nombre,
            email: newUser.email,
            password: newUser.password,
          }),
        }
      );
      if (respuesta.ok) {
        navigate("/activarGmail");
      }
    } catch (error) {
      console.error("Error en el servidor", error);
    } finally {
      setCargando(false); // fin carga, siempre
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white">
      <header>
        <Header />
      </header>

      <main className="flex flex-1 h-screen">
        {/* Columna de imagen solo visible en pantallas grandes */}
        <div className="hidden lg:flex w-1/2 h-full rounded-l-2xl overflow-hidden">
          <img
            src={img}
            alt="Imagen de fondo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Columna del formulario */}
        <div className="w-full lg:w-1/2 flex justify-center items-center px-4 py-12">
          <form
            className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md space-y-6"
            onSubmit={handleForm}
          >
            <h2 className="text-3xl font-extrabold text-orange-600 text-center">
              Regístrate
            </h2>

            <div className="flex flex-col">
              <label
                htmlFor="nombre"
                className="mb-1 text-sm font-semibold text-gray-700"
              >
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={newUser.nombre}
                name="nombre"
                placeholder="Nombre"
                required
                onChange={handleUser}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-1 text-sm font-semibold text-gray-700"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={newUser.email}
                name="email"
                required
                placeholder="Correo"
                onChange={handleUser}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="mb-1 text-sm font-semibold text-gray-700"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={newUser.password}
                name="password"
                required
                placeholder="Contraseña"
                onChange={handleUser}
              />
            </div>

            <div className="text-sm text-center">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => setIrLogin(true)}
                className="text-orange-600 hover:underline font-medium"
              >
                Inicia sesión
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={cargando}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 rounded-lg shadow transition-all duration-300 disabled:opacity-50"
              >
                {cargando ? "Cargando..." : "Registrarse"}
              </button>
              <button
                type="button"
                onClick={() => setVolver(true)}
                className="flex-1 border border-orange-500 text-orange-600 font-semibold py-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Home
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Register;
