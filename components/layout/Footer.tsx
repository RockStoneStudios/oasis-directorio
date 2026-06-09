"use client";

import { Home, Mail, MapPin, Star, Clock, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("¡Gracias por suscribirte a Ooasys! 🏜️");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <footer className="border-t border-[#E7E5E4] dark:border-[#44403C] bg-gradient-to-br from-[#FAFAF9] to-[#F5F0E8] dark:from-[#1C1917] dark:to-[#292524]">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4 w-fit transition-all duration-200 hover:opacity-80 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#0F766E] shadow-md group-hover:shadow-lg transition-all">
                <Home
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                />
              </div>
              <span className="text-xl font-bold font-heading tracking-tight bg-gradient-to-r from-[#1C1917] to-[#44403C] dark:from-white dark:to-[#A8A29E] bg-clip-text text-transparent">
                Ooasys
              </span>
            </Link>
            <p className="text-[#78716C] dark:text-[#A8A29E] max-w-sm mb-6 text-sm leading-relaxed">
              Tu oasis digital en el Occidente Antioqueño. Descubre negocios, eventos y servicios locales en Sopetrán, Santa Fe, San Jerónimo y más.
            </p>

            {/* Mini features */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-[#A8A29E]">
                <MapPin className="h-3.5 w-3.5 text-[#14B8A6]" />
                <span>+15 Municipios</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-[#A8A29E]">
                <Star className="h-3.5 w-3.5 text-[#F59E0B]" />
                <span>Negocios verificados</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-[#A8A29E]">
                <Clock className="h-3.5 w-3.5 text-[#10B981]" />
                <span>Info actualizada</span>
              </div>
            </div>

            {/* Newsletter Ooasys */}
            <div className="max-w-sm">
              <h3 className="font-semibold font-heading mb-3 text-[#1C1917] dark:text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#14B8A6]" />
                Novedades de Ooasys
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Correo electrónico
                  </label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu mejor correo"
                    autoComplete="email"
                    required
                    className="h-11 bg-white dark:bg-[#292524] border-[#E7E5E4] dark:border-[#44403C] text-[#1C1917] dark:text-white placeholder:text-[#A8A29E] focus:border-[#14B8A6] focus:ring-[#14B8A6]/20"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-4 bg-gradient-to-r from-[#14B8A6] to-[#0F766E] hover:from-[#0F766E] hover:to-[#0D5A54] text-white shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span className="sr-only">Suscribiendo</span>
                    </span>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only sm:ml-2">
                        Suscribirme
                      </span>
                    </>
                  )}
                </Button>
              </form>
              <p className="text-xs text-[#A8A29E] mt-3">
                Recibe tips, negocios nuevos y eventos. Sin spam. 🌊
              </p>
            </div>
          </div>

          {/* Browse Column */}
          <nav aria-label="Explorar negocios">
            <h3 className="font-semibold font-heading mb-4 text-[#1C1917] dark:text-white">Explorar</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/business"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Todos los negocios
                </Link>
              </li>
              <li>
                <Link
                  href="/business?status=open"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Abiertos ahora
                </Link>
              </li>
              <li>
                <Link
                  href="/business?sort=rating_desc"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Mejor calificados
                </Link>
              </li>
              <li>
                <Link
                  href="/business?sort=name_asc"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Orden alfabético
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Categorías
                </Link>
              </li>
            </ul>
          </nav>

          {/* For Business Owners Column */}
          <nav aria-label="Recursos para negocios">
            <h3 className="font-semibold font-heading mb-4 text-[#1C1917] dark:text-white">Para negocios</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/pricing"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Registrar negocio
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/listings"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Gestionar negocios
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/leads"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Solicitudes
                </Link>
              </li>
              <li>
                <Link
                  href="/guia-registro"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Guía de registro
                </Link>
              </li>
            </ul>
          </nav>

          {/* Account Column */}
          <nav aria-label="Cuenta">
            <h3 className="font-semibold font-heading mb-4 text-[#1C1917] dark:text-white">Cuenta</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/saved"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Guardados
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Mi perfil
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200"
                >
                  Ayuda
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar Ooasys */}
        <div className="border-t border-[#E7E5E4] dark:border-[#44403C] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-[#78716C] dark:text-[#A8A29E] flex items-center gap-1" suppressHydrationWarning>
            © {new Date().getFullYear()} <span className="font-semibold text-[#14B8A6]">Ooasys</span>. Hecho con 🏜️ para el Occidente Antioqueño.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200 text-sm"
            >
              Privacidad
            </Link>
            <Link
              href="/terms"
              className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200 text-sm"
            >
              Términos
            </Link>
            <Link
              href="/contacto"
              className="text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors duration-200 text-sm"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}