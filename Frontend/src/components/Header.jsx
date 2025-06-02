import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Box, Paper, Popper, Typography } from "@mui/material";
import { useUserContext } from "../context/userContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Header() {
  const { usuarioLogin, setUsuarioLogin, cargandoUsuario } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();

  const homeBtnRef = useRef(null);
  const menuRef = useRef(null);

  const [showPopper, setShowPopper] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === "/";

  const cerrarSesion = async () => {
    try {
      const res = await fetch("https://localhost:3002/api/user/cerrarSesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        setUsuarioLogin(null);
        navigate("/");
      } else {
        console.error("Error al cerrar sesión:", res.status);
      }
    } catch (err) {
      console.error("Error en el front al cerrar sesión:", err);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (cargandoUsuario) {
    return (
      <header className="bg-amber-50 p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">Verificando sesión...</p>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-amber-50 p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo y bienvenida */}
        <div className="flex items-center gap-6 flex-wrap md:flex-nowrap">
          <h1
            className="text-3xl font-bold text-orange-600 tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            Automarket
          </h1>

          {!isHome && (
            <div
              ref={homeBtnRef}
              className="p-1 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 hover:text-orange-800 cursor-pointer shadow-sm transition"
              onClick={() => navigate("/")}
              onMouseEnter={() => setShowPopper(true)}
              onMouseLeave={() => setShowPopper(false)}
            >
              <ion-icon name="home-sharp" size="large"></ion-icon>
              <Popper
                open={showPopper}
                anchorEl={homeBtnRef.current}
                placement="bottom"
                disablePortal
              >
                <Paper sx={{ padding: 1 }}>
                  <Typography variant="body2">Inicio</Typography>
                </Paper>
              </Popper>
            </div>
          )}

          {usuarioLogin ? (
            <p className="text-gray-700 font-medium cursor-default hidden sm:block">
              Bienvenido, {usuarioLogin.nombre}
            </p>
          ) : (
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setOpenModal(true)}
            >
              <ion-icon
                name="person-circle-outline"
                className="text-orange-500 text-4xl hover:text-orange-700 transition"
              ></ion-icon>
              <p className="text-gray-800 font-medium hidden sm:block">
                ¿Tienes cuenta?
              </p>
            </div>
          )}
        </div>

        {/* Modal de Login/Register */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box sx={modalStyle}>
            <div className="flex justify-end">
              <button
                className="text-gray-400 hover:text-red-600 text-2xl cursor-pointer"
                onClick={() => setOpenModal(false)}
              >
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            <div className="flex flex-col items-center gap-4 mt-4">
              <button
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-md text-sm w-full cursor-pointer"
                onClick={() => {
                  navigate("/login");
                  setOpenModal(false);
                }}
              >
                Iniciar Sesión
              </button>
              <p className="text-gray-700 text-sm">¿No tienes cuenta?</p>
              <button
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-md text-sm w-full cursor-pointer"
                onClick={() => {
                  navigate("/register");
                  setOpenModal(false);
                }}
              >
                Registrarse
              </button>
            </div>
          </Box>
        </Modal>

        {/* Menú lateral y botón fijo */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={menuRef}>
            <button
              className="text-orange-600 hover:text-orange-800 text-2xl flex items-center justify-center h-10 w-10 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <ion-icon name="menu" size="large"></ion-icon>
            </button>

            <div
              className={`absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-50 border transition-all duration-200 ${
                menuOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <ul className="flex flex-col text-sm py-2">
                <li
                  className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                  onClick={() => {
                    navigate("/calcularFin");
                    setMenuOpen(false);
                  }}
                >
                  Calcular Financiación
                </li>
                <li
                  className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                  onClick={() => {
                    navigate("/catalogo");
                    setMenuOpen(false);
                  }}
                >
                  Ver Catálogo
                </li>
                <li
                  className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                  onClick={() => {
                    navigate("/venderCoche");
                    setMenuOpen(false);
                  }}
                >
                  Vende tu Coche
                </li>
                {usuarioLogin && (
                  <>
                    <li
                      className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                      onClick={() => {
                        navigate("/favoritos");
                        setMenuOpen(false);
                      }}
                    >
                      Ver Favoritos
                    </li>
                    {usuarioLogin.Rols?.length > 1 && (
                      <li
                        className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                        onClick={() => {
                          navigate("/cochesUser");
                          setMenuOpen(false);
                        }}
                      >
                        Tus Coches
                      </li>
                    )}
                    <li
                      className="px-4 py-2 hover:bg-orange-100 text-red-600 cursor-pointer"
                      onClick={() => {
                        cerrarSesion();
                        setMenuOpen(false);
                      }}
                    >
                      Cerrar Sesión
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <button
            onClick={() => navigate("/venderCoche")}
            className="hidden md:block bg-orange-600 hover:bg-orange-400 text-white px-4 py-2 rounded text-sm font-medium cursor-pointer"
          >
            Vende tu Coche
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
