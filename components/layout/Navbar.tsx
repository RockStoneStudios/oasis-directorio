"use client";

import {
  Protect,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Heart, Home, LayoutDashboard, Menu, User, X, MapPin, Grid3x3, List, BadgeDollarSign, RadioIcon, Moon, Sun, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
import { urlFor } from "@/lib/sanity/image";

interface Municipality {
  _id: string;
  name: string;
  slug: { current: string } | string;
  flag?: any;
}

interface NavbarProps {
  municipalities?: Municipality[];
}

export function Navbar({ municipalities = [] }: NavbarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Control del menú móvil (Sheet)
  const [isMuniOpen, setIsMuniOpen] = useState(false); // Control del Dropdown nativo
  const [mounted, setMounted] = useState(false);
  const [currentMuni, setCurrentMuni] = useState<Municipality | null>(null);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown si se hace clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMuniOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateSelectedMunicipality = () => {
    const savedSlug = localStorage.getItem("oasis_municipality");
    
    if (savedSlug && municipalities.length > 0) {
      const found = municipalities.find(m => {
        const mSlug = typeof m.slug === 'string' ? m.slug : m.slug?.current || "";
        return mSlug === savedSlug;
      });

      if (found) {
        setCurrentMuni(found);
        return;
      }
    }
    setCurrentMuni(null);
  };

  useEffect(() => {
    setMounted(true);
    updateSelectedMunicipality();

    const handleCustomEvent = () => {
      updateSelectedMunicipality();
    };

    window.addEventListener("oasis_muni_changed", handleCustomEvent);
    window.addEventListener("storage", updateSelectedMunicipality);

    return () => {
      window.removeEventListener("oasis_muni_changed", handleCustomEvent);
      window.removeEventListener("storage", updateSelectedMunicipality);
    };
  }, [municipalities]);

  const handleSelectMunicipality = (slug: string | null) => {
    const params = new URLSearchParams(window.location.search);

    if (slug) {
      localStorage.setItem("oasis_municipality", slug);
      params.set("municipality", slug);
    } else {
      localStorage.removeItem("oasis_municipality");
      params.delete("municipality");
    }
    
    setIsMuniOpen(false);
    window.dispatchEvent(new Event("oasis_muni_changed"));
    updateSelectedMunicipality();

    // Redirige al Home actualizando la URL para que el Servidor filtre los negocios destacados
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const isPricingPage = pathname === "/pricing";

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

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <Link
              href="/business"
              className="px-4 py-2 text-sm font-medium text-slate-900 dark:text-gray-200 rounded-lg hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
            >
              Negocios
            </Link>

            <Link
              href="/sobre-nosotros"
              className="px-4 py-2 text-sm font-medium text-slate-900 dark:text-gray-200 rounded-lg hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
            >
              Conócenos
            </Link>

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
        <div className="hidden md:flex items-center gap-3">
          {mounted && (
            <>
              {/* 🗺️ Selector de Municipio Nativo e Interactivo */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsMuniOpen(!isMuniOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-full bg-accent/40 border border-border/40 text-xs font-semibold text-slate-900 dark:text-gray-200 hover:bg-accent/80 transition-all group cursor-pointer"
                >
                  {currentMuni && currentMuni.flag ? (
                    <>
                      <div className="relative h-4 w-6 rounded-sm overflow-hidden border border-black/10">
                        <Image
                          src={urlFor(currentMuni.flag).url()}
                          alt={`Bandera de ${currentMuni.name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>{currentMuni.name}</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>Todo el Occidente</span>
                    </>
                  )}
                  <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${isMuniOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Menú Desplegable con estilos nativos para Light/Dark */}
                {isMuniOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 z-50 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl backdrop-blur-lg overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150 max-h-72 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => handleSelectMunicipality(null)}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-2 ${
                        !currentMuni ? "text-primary font-bold bg-primary/10" : "text-foreground/90"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      Todo el Occidente
                    </button>
                    
                    {municipalities.map((muni) => {
                      const mSlug = typeof muni.slug === 'string' ? muni.slug : muni.slug?.current || "";
                      const isSelected = currentMuni?._id === muni._id;
                      return (
                        <button
                          key={muni._id}
                          type="button"
                          onClick={() => handleSelectMunicipality(mSlug)}
                          className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-2 ${
                            isSelected ? "text-primary font-bold bg-primary/10" : "text-foreground/90"
                          }`}
                        >
                          {muni.flag ? (
                            <div className="relative h-3.5 w-5 rounded-sm overflow-hidden border border-black/10 shrink-0">
                              <Image src={urlFor(muni.flag).url()} alt="" fill className="object-cover" />
                            </div>
                          ) : (
                            <MapPin className="h-3.5 w-3.5 opacity-40 shrink-0" />
                          )}
                          <span className="truncate">{muni.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 🌓 Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                aria-label="Cambiar tema"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Autenticado */}
              <SignedIn>
                <Link
                  href="/saved"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                >
                  <Heart className="h-5 w-5" />
                </Link>
                <Link
                  href="/profile"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                >
                  <User className="h-5 w-5" />
                </Link>
                <Protect plan="agent">
                  <Link
                    href="/dashboard"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                </Protect>
                <div className="ml-2">
                  <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
                </div>
              </SignedIn>

              {/* Invitado */}
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="text-slate-900 dark:text-gray-200">
                    Iniciar sesión
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
              {/* Dropdown Nativo para Móviles */}
              <div className="relative">
                <button
                  onClick={() => setIsMuniOpen(!isMuniOpen)}
                  className="flex items-center justify-center h-8 px-2.5 rounded-lg text-xs font-semibold bg-accent/40 border border-border/40 text-slate-900 dark:text-gray-200 gap-1 cursor-pointer"
                >
                  {currentMuni && currentMuni.flag ? (
                    <div className="relative h-3.5 w-5 rounded-sm overflow-hidden border border-black/10 shrink-0">
                      <Image src={urlFor(currentMuni.flag).url()} alt="" fill className="object-cover" />
                    </div>
                  ) : (
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                  )}
                  <span className="max-w-[65px] truncate">{currentMuni ? currentMuni.name : "Occidente"}</span>
                  <ChevronDown className="h-2.5 w-2.5 opacity-50" />
                </button>

                {isMuniOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 z-50 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={() => handleSelectMunicipality(null)}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-accent text-foreground/90 block"
                    >
                      Todo el Occidente
                    </button>
                    {municipalities.map((muni) => {
                      const mSlug = typeof muni.slug === 'string' ? muni.slug : muni.slug?.current || "";
                      return (
                        <button
                          key={muni._id}
                          onClick={() => handleSelectMunicipality(mSlug)}
                          className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-accent text-foreground/90 block truncate"
                        >
                          {muni.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-[color,background-color] duration-200"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <SignedIn>
                <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
              </SignedIn>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-75 sm:w-87.5 overscroll-contain">
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                          <Home className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="font-heading">Oasis</span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 mt-8">
                    <Link
                      href="/clasico"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent transition-all"
                    >
                      <List className="h-5 w-5" />
                      Directorio clásico
                    </Link>
                    
                    <Link
                      href="/categorias"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent"
                    >
                      <Grid3x3 className="h-5 w-5" />
                      Directorio por categorías
                    </Link>
                    
                    <Link
                      href="/mapa"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent"
                    >
                      <MapPin className="h-5 w-5" />
                      Mapa de negocios
                    </Link>

                    <Link
                      href="/atm"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent"
                    >
                      <BadgeDollarSign className="h-5 w-5" />
                      ¿Dónde retirar dinero?
                    </Link>
                    
                    <Link
                      href="/estereo"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent"
                    >
                      <RadioIcon className="h-5 w-5" />
                      Estéreo
                    </Link>

                    <div className="h-px bg-border my-2" />

                    <Link
                      href="/business"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent"
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
                            className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent"
                          >
                            Registrar negocio
                          </Link>
                        }
                      >
                        <Link
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent"
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          Dashboard
                        </Link>
                      </Protect>
                    </SignedIn>
                    
                    <SignedOut>
                      <Link
                        href="/pricing"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent"
                      >
                        Registrar negocio
                      </Link>
                    </SignedOut>
                    
                    <SignedIn>
                      <div className="h-px bg-border my-2" />
                      <Link
                        href="/saved"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent"
                      >
                        <Heart className="h-5 w-5" />
                        Guardados
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg hover:bg-accent"
                      >
                        <User className="h-5 w-5" />
                        Mi perfil
                      </Link>
                    </SignedIn>
                    
                    <SignedOut>
                      <div className="h-px bg-border my-2" />
                      <div className="flex flex-col gap-2 px-4 mt-2">
                        <SignInButton mode="modal">
                          <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                            Iniciar sesión
                          </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                          <Button className="w-full" onClick={() => setIsOpen(false)}>
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