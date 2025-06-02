import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import img from "../assets/user.png"; // Ruta correcta de la imagen

function Login() {
  const { usuarioLogin, setUsuarioLogin } = useUserContext();
  const [user, setUser] = useState({ email: "", password: "" });
  const [volver, setVolver] = useState(false);
  const [irRegister, setIrRegister] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  if (volver) return navigate("/");
  if (irRegister) return navigate("/register");

  const handleUser = (e) => {
    const value = e.target.value;
    setUser({ ...user, [e.target.name]: value });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const respuesta = await fetch("https://localhost:3002/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: "include",
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        setUsuarioLogin(data.usuario);
        navigate("/");
      } else {
        setCargando(false);
      }
    } catch (error) {
      console.error("Error al hacer login", error);
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-1 h-screen">
        {/* Columna imagen */}
        <div className="hidden lg:flex w-1/2 h-full rounded-l-2xl overflow-hidden">
          <img
            src={img}
            alt="Imagen de fondo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Columna formulario */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <form
            className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10 space-y-6"
            onSubmit={handleForm}
          >
            <h2 className="text-3xl font-extrabold text-orange-600 text-center">
              Iniciar sesión
            </h2>

            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700 mb-1"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleUser}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="email"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleUser}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="contraseña"
              />
            </div>

            <div className="text-sm text-center">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => setIrRegister(true)}
                className="text-orange-600 hover:underline font-medium"
              >
                Regístrate
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 rounded-lg shadow transition-all duration-300"
              >
                {cargando ? "Cargando..." : "Iniciar Sesion"}
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

      <Footer />
    </div>
  );
}

export default Login;
