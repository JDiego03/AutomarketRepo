import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function ActivarGmail() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <header className="w-full">
        <Header />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold mb-4">Activa tu cuenta</h1>
          <p className="mb-6 text-gray-600">
            Por motivos de seguridad, necesitas activar tu cuenta. Revisa tu
            correo electrónico.
          </p>
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-orange-600 text-white font-medium rounded-xl shadow-md hover:bg-orange-400 transition-colors"
          >
            Ir a Gmail
          </a>
        </div>
      </div>

      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}

export default ActivarGmail;
