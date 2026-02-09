import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer-bbdiscos">
      <div className="footer-container">
        <div className="footer-content">
          {/* Contacto Section */}
          <div className="footer-section-contact">
            <h3 className="footer-title">Contáctanos</h3>
            <div className="footer-contact">
              <a
                href="https://wa.me/541127564343"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp size={20} />
                <span>541127564343</span>
              </a>
              <a href="tel:1127564343" className="footer-link">
                <Phone size={20} />
                <span>1127564343</span>
              </a>
              <a
                href="mailto:bbdiscos.contacto@gmail.com"
                className="footer-link"
              >
                <Mail size={20} />
                <span>bbdiscos.contacto@gmail.com</span>
              </a>
              <div className="footer-link">
                <MapPin size={20} />
                <span>CABA</span>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="footer-section-social">
            <h3 className="footer-title">Sigamos conectados</h3>
            <div className="footer-social">
              <a
                href="https://instagram.com/bbdiscos"
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://facebook.com/bbdiscos"
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            Copyright BB Discos - 2026. Todos los derechos reservados.
          </p>
          <p className="footer-legal">
            Defensa de las y los consumidores. Para reclamos{" "}
            <a
              href="https://autogestion.produccion.gob.ar/consumidores"
              target="_blank"
              rel="noopener noreferrer"
            >
              ingresá acá
            </a>
            . / <a href="/arrepentimiento">Botón de arrepentimiento</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
