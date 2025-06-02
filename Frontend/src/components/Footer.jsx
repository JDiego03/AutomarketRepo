function Footer() {
  return (
    <footer className="bg-amber-50 text-gray-900 p-8 mt-10 border-t border-gray-200 shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
        {/* Marca y Derechos */}
        <div className="flex flex-col text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-4xl font-bold tracking-wide text-orange-600 mb-4">
            Automarket
          </h2>
          <p className="text-gray-500 text-sm">
            © 2025 Automarket. Todos los derechos reservados.
          </p>
        </div>

        {/* Enlaces útiles + Empresa + Contacto */}
        <div className="flex flex-col sm:flex-row gap-6 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Enlaces útiles
            </h3>
            <nav>
              <a
                href="/legal/privacidad"
                className="text-gray-700 hover:text-orange-600 text-sm block py-2 transition-colors"
              >
                Política de Privacidad
              </a>
              <a
                href="/legal/terminos"
                className="text-gray-700 hover:text-orange-600 text-sm block py-2 transition-colors"
              >
                Términos y Condiciones
              </a>
              <a
                href="/soporte"
                className="text-gray-700 hover:text-orange-600 text-sm block py-2 transition-colors"
              >
                Centro de Ayuda
              </a>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Sobre Automarket
            </h3>
            <p className="text-gray-500 text-sm">
              En Automarket, nos dedicamos a ofrecer vehículos de segunda mano
              de alta calidad a precios competitivos...
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Contáctanos
            </h3>
            <p className="text-gray-500 text-sm">
              Dirección: Calle de la Automoción, 123
            </p>
            <p className="text-gray-500 text-sm">Teléfono: +123 456 789</p>
            <p className="text-gray-500 text-sm">
              Email: contacto@automarket.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
