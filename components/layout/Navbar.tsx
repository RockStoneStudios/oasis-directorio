"use client";

import {
  Protect,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Heart, Home, LayoutDashboard, Menu, User, X, MapPin, Grid3x3, List, BadgeDollarSign, RadioIcon, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { useTheme } from "next-themes";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // 🚀 Forzamos a que el cliente se sincronice antes de renderizar elementos interactivos
  useEffect(() => {
    setMounted(true);
  }, []);

  // Disable sticky header on pricing page to prevent z-index conflicts
  const isPricingPage = pathname === "/pricing";

  // Función para alternar el tema
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={
        isPricingPage
          ? "w-full border-b border-border/50 bg-background"
          : "sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80"
      }
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80"
          >
            <div className="flex h-28 w-30 items-center justify-center rounded-lg overflow-hidden mt-5">
              <Image
                src="/oasis.png"
                width={140}
                height={140}
                alt="Logo Oasis"
                className="shadow-md object-cover"
              />
            </div>
          </Link>

          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            <Link
              href="/business"
              className="px-4 py-2 text-sm font-medium text-slate-900 dark:text-gray-200 rounded-lg hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
            >
              Negocios
            </Link>

            {/* 👀 Liberado: Ahora "Conócenos" es inmune a Clerk y se ve siempre con los colores correctos */}
            <Link
              href="/sobre-nosotros"
              className="px-4 py-2 text-sm font-medium text-slate-900 dark:text-gray-200 rounded-lg hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
            >
              Conocenos
            </Link>

            {/* Aquí adentro solo manejas lógica exclusiva de autenticación */}
            <SignedIn>
              <Protect plan="agent">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-slate-900 dark:text-gray-200 rounded-lg hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                >
                  Dashboard
                </Link>
              </Protect>
            </SignedIn>
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {mounted && (
            <>
              {/* 🌓 Theme Toggle - Desktop */}
              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                aria-label="Cambiar tema"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Moon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>

              <SignedIn>
                <Link
                  href="/saved"
                  aria-label="Guardados"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                >
                  <Heart className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link
                  href="/profile"
                  aria-label="My profile"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Protect plan="agent">
                  <Link
                    href="/dashboard"
                    aria-label="Agent dashboard"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                  >
                    <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </Protect>
                <div className="ml-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9",
                      },
                    }}
                  />
                </div>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Iniciar sesion
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Crear cuenta</Button>
                </SignUpButton>
              </SignedOut>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          {mounted ? (
            <>
              {/* 🌓 Theme Toggle - Mobile */}
              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                aria-label="Cambiar tema"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
              </button>

              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              </SignedIn>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? (
                      <X className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Menu className="h-5 w-5" aria-hidden="true" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-75 sm:w-87.5 overscroll-contain"
                >
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                          <Home
                            className="h-4 w-4 text-primary-foreground"
                            aria-hidden="true"
                          />
                        </div>
                        <span className="font-heading">Oasis</span>
                      </div>
                      
                      <button
                        onClick={toggleTheme}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                        aria-label="Cambiar tema"
                      >
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Moon className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </SheetTitle>
                  </SheetHeader>
                  <nav
                    className="flex flex-col gap-2 mt-8"
                    aria-label="Mobile navigation"
                  >
                    <Link
                      href="/clasico"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                    >
                      <List className="h-5 w-5" aria-hidden="true" />
                      Directorio clásico
                    </Link>
                    
                    <Link
                      href="/categorias"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                    >
                      <Grid3x3 className="h-5 w-5" aria-hidden="true" />
                      Directorio por categorías
                    </Link>
                    
                    <Link
                      href="/mapa"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                    >
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                      Mapa de negocios
                    </Link>
                     <Link
                      href="/atm"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                    >
                      <BadgeDollarSign className="h-6 w-5" aria-hidden="true" />
                       Donde retirar dinero?
                    </Link>
                    
                    <Link
                      href="/estereo"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                    >
                      <RadioIcon className="h-5 w-5" aria-hidden="true" />
                      Estereo
                    </Link>

                    <div className="h-px bg-border my-2" />

                    <Link
                      href="/business"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                    >
                      Negocios
                    </Link>
                    
                    <SignedIn>
                      <Protect
                        plan="agent"
                        fallback={
                          <Link
                            href="/pricing"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                          >
                            Registrar negocio
                          </Link>
                        }
                      >
                        <Link
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                        >
                          <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                          Dashboard
                        </Link>
                      </Protect>
                    </SignedIn>
                    <SignedOut>
                      <Link
                        href="/pricing"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                      >
                        Registrar negocio
                      </Link>
                    </SignedOut>
                    
                    <SignedIn>
                      <div className="h-px bg-border my-2" />
                      <Link
                        href="/saved"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                      >
                        <Heart className="h-5 w-5" aria-hidden="true" />
                        Guardados
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-[background-color] duration-200"
                      >
                        <User className="h-5 w-5" aria-hidden="true" />
                        Mi perfil
                      </Link>
                    </SignedIn>
                    
                    <SignedOut>
                      <div className="h-px bg-border my-2" />
                      <div className="flex flex-col gap-2 px-4 mt-2">
                        <SignInButton mode="modal">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsOpen(false)}
                          >
                            Iniciar sesion
                          </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                          <Button
                            className="w-full"
                            onClick={() => setIsOpen(false)}
                          >
                            Crear cuenta
                          </Button>
                        </SignUpButton>
                      </div>
                    </SignedOut>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}