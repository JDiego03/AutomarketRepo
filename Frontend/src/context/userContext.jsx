import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [usuarioLogin, setUsuarioLogin] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);

  const obtenerUsuario = async () => {
    const res = await fetch("https://localhost:3002/api/user/loginUser", {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setUsuarioLogin(data.user);
      return true;
    } else {
      setUsuarioLogin(null);
      return false;
    }
  };

  const verificarUsuario = async () => {
    try {
      const success = await obtenerUsuario();

      if (!success) {
        const renovar = await fetch(
          "https://localhost:3002/api/user/actualizarToken",
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (renovar.ok) {
          console.log("🔄 Token renovado correctamente");
          await obtenerUsuario(); // intenta de nuevo
        } else {
          console.warn("⚠ No se pudo renovar el token");
          setUsuarioLogin(null);
        }
      }
    } catch (error) {
      console.error("💥 Error al verificar sesión:", error);
      setUsuarioLogin(null);
    } finally {
      setCargandoUsuario(false); // Solo aquí debe ir
    }
  };

  // ✅ Para refrescar usuario desde cualquier componente
  const refrescarUsuario = async () => {
    try {
      return await obtenerUsuario();
    } catch (err) {
      console.error("❌ Error al refrescar usuario:", err);
      setUsuarioLogin(null);
      return false;
    }
  };

  useEffect(() => {
    verificarUsuario();
  }, []);

  return (
    <UserContext.Provider
      value={{
        usuarioLogin,
        setUsuarioLogin,
        cargandoUsuario,
        refrescarUsuario,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUserContext debe usarse dentro de un UserContextProvider"
    );
  }
  return context;
}
