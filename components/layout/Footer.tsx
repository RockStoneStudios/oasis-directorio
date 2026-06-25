"use client";

import { Home, Mail, MapPin, Star, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
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
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Grid principal - 2 columnas en móvil, 4 en tablet, 5 en desktop */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
          
          {/* Columna 1: Brand - ocupa 2 columnas en móvil, 2 en desktop */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-4 transition-all duration-200 hover:opacity-80 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#0F766E] shadow-md group-hover:shadow-lg transition-all">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading tracking-tight bg-gradient-to-r from-[#1C1917] to-[#44403C] dark:from-white dark:to-[#A8A29E] bg-clip-text text-transparent">
                Ooasys
              </span>
            </Link>
            
            <p className="text-[#78716C] dark:text-[#A8A29E] text-sm leading-relaxed mb-4 max-w-xs">
              Tu oasis digital en el Occidente Antioqueño.
            </p>

            {/* Features simplificados */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#78716C] dark:text-[#A8A29E] bg-white/50 dark:bg-[#292524]/50 px-3 py-1 rounded-full">
                <MapPin className="h-3 w-3 text-[#14B8A6]" />
                +5 Municipios
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#78716C] dark:text-[#A8A29E] bg-white/50 dark:bg-[#292524]/50 px-3 py-1 rounded-full">
                <Star className="h-3 w-3 text-[#F59E0B]" />
                Verificados
              </span>
            </div>

            {/* Newsletter - solo en desktop, en móvil abajo */}
            <div className="hidden lg:block">
              <h4 className="text-sm font-semibold text-[#1C1917] dark:text-white mb-2">
                Suscríbete
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo"
                  required
                  className="h-9 text-sm bg-white dark:bg-[#292524] border-[#E7E5E4] dark:border-[#44403C]"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="sm"
                  className="h-9 px-3 bg-gradient-to-r from-[#14B8A6] to-[#0F766E] hover:from-[#0F766E] hover:to-[#0D5A54] text-white text-sm"
                >
                  {isSubmitting ? "..." : "Ir"}
                </Button>
              </form>
            </div>
          </div>

          {/* Columna 2: Explorar */}
          <div>
            <h3 className="text-sm font-semibold text-[#1C1917] dark:text-white mb-3">
              Explorar
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/business" className="text-sm text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
                  Negocios
                </Link>
              </li>
              <li>
                <Link href="/business?status=open" className="text-sm text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
                  Abiertos ahora
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-sm text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
                  Categorías
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Para negocios */}
          <div>
            <h3 className="text-sm font-semibold text-[#1C1917] dark:text-white mb-3">
              Negocios
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-sm text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
                  Registrar
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/guia-registro" className="text-sm text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
                  Guía
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Cuenta */}
          <div>
            <h3 className="text-sm font-semibold text-[#1C1917] dark:text-white mb-3">
              Cuenta
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/saved" className="text-sm text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
                  Guardados
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
                  Perfil
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="text-sm text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
                  Iniciar sesión
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter móvil - solo visible en móvil */}
        <div className="mt-8 lg:hidden">
          <h4 className="text-sm font-semibold text-[#1C1917] dark:text-white mb-2">
            Suscríbete a novedades
          </h4>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo"
              required
              className="h-10 bg-white dark:bg-[#292524] border-[#E7E5E4] dark:border-[#44403C]"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-4 bg-gradient-to-r from-[#14B8A6] to-[#0F766E] hover:from-[#0F766E] hover:to-[#0D5A54] text-white"
            >
              {isSubmitting ? "..." : "Suscribirme"}
            </Button>
          </form>
        </div>

        {/* Bottom Bar - más compacto */}
        <div className="border-t border-[#E7E5E4] dark:border-[#44403C] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#78716C] dark:text-[#A8A29E]" suppressHydrationWarning>
            © {new Date().getFullYear()} Ooasys. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="text-xs text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
              Términos
            </Link>
            <Link href="/contacto" className="text-xs text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] transition-colors">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}