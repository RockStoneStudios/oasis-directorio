"use client";

import { Home, Mail } from "lucide-react";
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Thanks for subscribing!");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <footer className="border-t border-border/50 bg-accent/30">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4 w-fit transition-opacity duration-200 hover:opacity-80"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home
                  className="h-5 w-5 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <span className="text-xl font-bold font-heading tracking-tight">
                Oasis
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Directorio local para descubrir negocios, eventos y noticias por
              municipio y categoria.
            </p>

            {/* Newsletter */}
            <div className="max-w-sm">
              <h3 className="font-semibold font-heading mb-3">Novedades</h3>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo"
                    autoComplete="email"
                    required
                    className="h-11"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-4"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span className="sr-only">Suscribiendo</span>
                    </span>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only sm:ml-2">
                        Suscribirse
                      </span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Browse Column */}
          <nav aria-label="Explorar negocios">
            <h3 className="font-semibold font-heading mb-4">Explorar</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/business"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Todos los negocios
                </Link>
              </li>
              <li>
                <Link
                  href="/business?status=open"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Abiertos ahora
                </Link>
              </li>
              <li>
                <Link
                  href="/business?sort=rating_desc"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Mejor calificados
                </Link>
              </li>
              <li>
                <Link
                  href="/business?sort=name_asc"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Orden alfabetico
                </Link>
              </li>
            </ul>
          </nav>

          {/* For Business Owners Column */}
          <nav aria-label="Recursos para negocios">
            <h3 className="font-semibold font-heading mb-4">Para negocios</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Registrar negocio
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/listings"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Gestionar negocios
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/leads"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Solicitudes
                </Link>
              </li>
            </ul>
          </nav>

          {/* Account Column */}
          <nav aria-label="Cuenta">
            <h3 className="font-semibold font-heading mb-4">Cuenta</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/saved"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Guardados
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Mi perfil
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Iniciar sesion
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p suppressHydrationWarning>
            (c) {new Date().getFullYear()} Oasis. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors duration-200"
            >
              Privacidad
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors duration-200"
            >
              Terminos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
