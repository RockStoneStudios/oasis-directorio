"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import {
  Heart,
  Home,
  LayoutDashboard,
  Menu,
  User,
  X,
  MapPin,
  Grid3x3,
  List,
  BadgeDollarSign,
  RadioIcon,
  Moon,
  Sun,
  ChevronDown,
  Vote,
  Calendar,
  Apple,
  Cherry,
  Grape,

} from "lucide-react";
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
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [isMuniOpen, setIsMuniOpen] = useState(false);
  const [isMobileMuniOpen, setIsMobileMuniOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentMuni, setCurrentMuni] = useState<Municipality | null>(null);
  const [showParticles, setShowParticles] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const isAgent = user?.publicMetadata?.plan === "agent" || user?.organizationMemberships?.some(m => m.role === "agent");

  useEffect(() => {
    setMounted(true);
    updateSelectedMunicipality();

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMuniOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsMobileMuniOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    
    const handleCustomEvent = () => updateSelectedMunicipality();
    window.addEventListener("oasis_muni_changed", handleCustomEvent);
    window.addEventListener("storage", updateSelectedMunicipality);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("oasis_muni_changed", handleCustomEvent);
      window.removeEventListener("storage", updateSelectedMunicipality);
    };
  }, [municipalities]);

  const updateSelectedMunicipality = () => {
    const savedSlug = localStorage.getItem("oasis_municipality");
    if (savedSlug && municipalities.length > 0) {
      const found = municipalities.find((m) => {
        const mSlug = typeof m.slug === "string" ? m.slug : m.slug?.current || "";
        return mSlug === savedSlug;
      });
      if (found) {
        setCurrentMuni(found);
        return;
      }
    }
    setCurrentMuni(null);
  };

  const handleSelectMunicipality = (slug: string | null, isMobile = false) => {
    const params = new URLSearchParams(window.location.search);
    if (slug) {
      localStorage.setItem("oasis_municipality", slug);
      params.set("municipality", slug);
    } else {
      localStorage.removeItem("oasis_municipality");
      params.delete("municipality");
    }

    if (isMobile) setIsMobileMuniOpen(false);
    else setIsMuniOpen(false);

    window.dispatchEvent(new Event("oasis_muni_changed"));
    updateSelectedMunicipality();
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  // Función para activar la animación de partículas
  const triggerParticles = () => {
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 3000);
  };

  const isPricingPage = pathname === "/pricing";
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header
      className={
        isPricingPage
          ? "w-full border-b border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#1C1917]"
          : "sticky top-0 z-50 w-full border-b border-[#E7E5E4]/50 dark:border-[#44403C]/50 bg-white/95 dark:bg-[#1C1917]/95 backdrop-blur supports-backdrop-filter:bg-white/80 dark:supports-backdrop-filter:bg-[#1C1917]/80"
      }
    >
      {/* Estilos CSS para las partículas */}
      <style jsx>{`
        @keyframes fruit-pop {
          0% {
            transform: scale(0) translate(0, 0);
            opacity: 0;
          }
          20% {
            transform: scale(1.2) translate(var(--tx, 0px), var(--ty, 0px));
            opacity: 1;
          }
          100% {
            transform: scale(0.8) translate(var(--tx-end, 0px), var(--ty-end, -40px));
            opacity: 0;
          }
        }

        .fruit-particle {
          position: absolute;
          pointer-events: none;
          z-index: 100;
          animation: fruit-pop 0.8s ease-out forwards;
        }

        .fruit-link {
          position: relative;
          overflow: visible;
        }

        .fruit-link:hover .fruit-icon-bounce {
          animation: bounce 0.5s ease infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        .fruit-icon-bounce {
          display: inline-block;
          transition: transform 0.2s ease;
        }
      `}</style>

      {/* Contenedor de partículas */}
      {showParticles && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {[...Array(12)].map((_, i) => {
            const fruits = [
              { icon: "🍍", color: "#F59E0B", name: "piña" },
              { icon: "🍓", color: "#EF4444", name: "fresa" },
              { icon: "🍌", color: "#EAB308", name: "banano" },
              { icon: "🥭", color: "#F97316", name: "mango" },
              { icon: "🍊", color: "#F59E0B", name: "naranja" },
              { icon: "🍉", color: "#10B981", name: "sandía" },
              { icon: "🍒", color: "#DC2626", name: "cereza" },
              { icon: "🍑", color: "#F97316", name: "durazno" },
            ];
            const fruit = fruits[i % fruits.length];
            const randomX = (Math.random() - 0.5) * 200;
            const randomY = (Math.random() - 0.5) * 100 - 50;
            const randomDelay = Math.random() * 0.5;
            return (
              <div
                key={i}
                className="fruit-particle"
                style={
                  {
                    left: `${50 + (Math.random() - 0.5) * 40}%`,
                    top: `${30 + (Math.random() - 0.5) * 30}%`,
                    animationDelay: `${randomDelay}s`,
                    fontSize: `${20 + Math.random() * 20}px`,
                    "--tx": `${randomX}px`,
                    "--ty": `${randomY}px`,
                    "--tx-end": `${randomX * 1.5}px`,
                    "--ty-end": `${randomY * 1.5 - 60}px`,
                  } as React.CSSProperties
                }
              >
                {fruit.icon}
              </div>
            );
          })}
        </div>
      )}

      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity duration-200 hover:opacity-80">
            <div className="flex h-28 w-30 items-center justify-center rounded-lg overflow-hidden mt-5">
              <Image src="/ooasys.webp" width={140} height={140} alt="Logo Ooasys" unoptimized className="shadow-md object-cover" priority />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <Link href="/business" className="px-4 py-2 text-sm font-medium text-[#44403C] dark:text-[#D6D3D1] rounded-lg hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all">
              Negocios
            </Link>
            <Link href="/sobre-nosotros" className="px-4 py-2 text-sm font-medium text-[#44403C] dark:text-[#D6D3D1] rounded-lg hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all">
              Conócenos
            </Link>
            <Link href="/elecciones" className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 ${pathname === '/elecciones' ? 'text-[#F59E0B] bg-[#F59E0B]/10' : 'text-[#D97706] dark:text-[#FBBF24] hover:bg-[#F59E0B]/10'}`}>
              <Vote className="w-4 h-4" /> Elecciones
            </Link>
            
            {/* 🍍 ENLACE DE FIESTAS DE LAS FRUTAS CON ANIMACIÓN */}
            <Link 
              href="/eventos/fiestas-de-frutas-2026" 
              onClick={triggerParticles}
              className="fruit-link group px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              <span className="fruit-icon-bounce text-base">🍍</span>
              <span>Fiestas de las Frutas</span>
              <span className="fruit-icon-bounce text-base">🍓</span>
            </Link>

            {mounted && user && isAgent && (
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-[#44403C] dark:text-[#D6D3D1] rounded-lg hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all">
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && (
            <>
              {/* Selector Escritorio */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsMuniOpen(!isMuniOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-full bg-[#F5F0E8] dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] text-xs font-semibold text-[#44403C] dark:text-[#D6D3D1] hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all cursor-pointer"
                  aria-label={currentMuni ? `Municipio seleccionado: ${currentMuni.name}. Tocar para cambiar municipio` : "Seleccionar municipio para filtrar negocios"}
                >
                  {currentMuni && currentMuni.flag ? (
                    <>
                      <div className="relative h-4 w-6 rounded-sm overflow-hidden border border-black/10">
                        <Image src={urlFor(currentMuni.flag).url()} alt="" fill className="object-cover" />
                      </div>
                      <span>{currentMuni.name}</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="h-3.5 w-3.5 text-[#14B8A6]" />
                      <span>Todo el Occidente</span>
                    </>
                  )}
                  <ChevronDown className={`h-3 w-3 transition-transform ${isMuniOpen ? "rotate-180 text-[#14B8A6]" : "text-[#A8A29E]"}`} />
                </button>

                {isMuniOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 z-50 bg-white dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] rounded-xl shadow-xl overflow-hidden py-1 max-h-72 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => handleSelectMunicipality(null, false)}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2 hover:bg-[#14B8A6]/10 transition-colors ${!currentMuni ? "text-[#14B8A6] font-bold bg-[#14B8A6]/5" : "text-[#44403C] dark:text-[#D6D3D1]"}`}
                    >
                      <MapPin className="h-3.5 w-3.5 text-[#14B8A6]" /> Todo el Occidente
                    </button>
                    {municipalities.map((muni) => {
                      const mSlug = typeof muni.slug === "string" ? muni.slug : muni.slug?.current || "";
                      return (
                        <button
                          key={muni._id}
                          type="button"
                          onClick={() => handleSelectMunicipality(mSlug, false)}
                          className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2 hover:bg-[#14B8A6]/10 transition-colors ${currentMuni?._id === muni._id ? "text-[#14B8A6] font-bold bg-[#14B8A6]/5" : "text-[#44403C] dark:text-[#D6D3D1]"}`}
                        >
                          {muni.flag ? (
                            <div className="relative h-3.5 w-5 rounded-sm overflow-hidden border border-black/10 shrink-0">
                              <Image src={urlFor(muni.flag).url()} alt="" fill className="object-cover" />
                            </div>
                          ) : <MapPin className="h-3.5 w-3.5 opacity-40 shrink-0" />}
                          <span className="truncate">{muni.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Botón tema */}
              <button 
                onClick={toggleTheme} 
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all" 
                aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <SignedIn>
                <Link href="/saved" className="flex h-10 w-10 items-center justify-center rounded-lg text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all"><Heart className="h-5 w-5" /></Link>
                <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-lg text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all"><User className="h-5 w-5" /></Link>
                {isAgent && <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-lg text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all"><LayoutDashboard className="h-5 w-5" /></Link>}
                <div className="ml-2"><UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} /></div>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal"><Button variant="ghost" size="sm" className="text-[#44403C] dark:text-[#D6D3D1] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10">Iniciar sesión</Button></SignInButton>
                <SignUpButton mode="modal"><Button size="sm" className="bg-[#14B8A6] hover:bg-[#0F766E] text-white">Crear cuenta</Button></SignUpButton>
              </SignedOut>
            </>
          )}
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex md:hidden items-center gap-2">
          {mounted ? (
            <>
              {/* Selector Móvil */}
              <div className="relative" ref={mobileDropdownRef}>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileMuniOpen(!isMobileMuniOpen);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsMobileMuniOpen(!isMobileMuniOpen);
                    }
                  }}
                  className="flex items-center justify-center h-8 px-2.5 rounded-lg text-xs font-semibold bg-[#F5F0E8] dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] text-[#44403C] dark:text-[#D6D3D1] gap-1 cursor-pointer select-none"
                  role="button"
                  tabIndex={0}
                  aria-label={currentMuni ? `Municipio seleccionado: ${currentMuni.name}. Tocar para cambiar` : "Seleccionar municipio para filtrar negocios"}
                >
                  {currentMuni && currentMuni.flag ? (
                    <div className="relative h-3.5 w-5 rounded-sm overflow-hidden border border-black/10 shrink-0 pointer-events-none">
                      <Image src={urlFor(currentMuni.flag).url()} alt="" fill className="object-cover" />
                    </div>
                  ) : <MapPin className="h-3.5 w-3.5 text-[#14B8A6] pointer-events-none" />}
                  <span className="max-w-16.25 truncate pointer-events-none">{currentMuni ? currentMuni.name : "Occidente"}</span>
                  <ChevronDown className="h-2.5 w-2.5 opacity-50 pointer-events-none" />
                </div>

                {isMobileMuniOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 z-60 bg-white dark:bg-[#292524] border border-[#E7E5E4] dark:border-[#44403C] rounded-xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto">
                    <div onClick={() => handleSelectMunicipality(null, true)} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-[#14B8A6]/10 transition-colors text-[#44403C] dark:text-[#D6D3D1] cursor-pointer">
                      Todo el Occidente
                    </div>
                    {municipalities.map((muni) => {
                      const mSlug = typeof muni.slug === "string" ? muni.slug : muni.slug?.current || "";
                      return (
                        <div key={muni._id} onClick={() => handleSelectMunicipality(mSlug, true)} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-[#14B8A6]/10 transition-colors text-[#44403C] dark:text-[#D6D3D1] truncate cursor-pointer">
                          {muni.name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Botón tema móvil */}
              <button 
                onClick={toggleTheme} 
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#78716C] dark:text-[#A8A29E] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all"
                aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <SignedIn>
                <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
              </SignedIn>

              {/* Sheet de Navegación Lateral Móvil */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Abrir menú de navegación" className="text-[#78716C] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10">
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-75 sm:w-87.5 overscroll-contain bg-white dark:bg-[#1C1917] border-l border-[#E7E5E4] dark:border-[#44403C]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14B8A6]">
                        <Home className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-heading text-[#1C1917] dark:text-white">Ooasys</span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 mt-6">
                    <Link href="/clasico" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[#44403C] dark:text-[#D6D3D1] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all"><List className="h-5 w-5" />De la A a la Z</Link>
                    <Link href="/categorias" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[#44403C] dark:text-[#D6D3D1] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all"><Grid3x3 className="h-5 w-5" />Buscar por Categoría</Link>
                    <Link href="/mapa" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[#44403C] dark:text-[#D6D3D1] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all"><MapPin className="h-5 w-5" />Cerca de mí</Link>
                    <Link href="/atm" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[#44403C] dark:text-[#D6D3D1] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all"><BadgeDollarSign className="h-5 w-5" /> ¿Dónde retirar dinero?</Link>
                    <Link href="/estereo" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[#44403C] dark:text-[#D6D3D1] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all"><RadioIcon className="h-5 w-5" /> Emisoras del occidente antioqueño</Link>
                    
                    <Link href="/elecciones" onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-4 py-3 text-base font-bold rounded-lg transition-all ${pathname === '/elecciones' ? 'text-[#F59E0B] bg-[#F59E0B]/10' : 'text-[#D97706] dark:text-[#FBBF24] hover:bg-[#F59E0B]/10'}`}>
                      <Vote className="h-5 w-5" /> Elecciones 2026
                    </Link>

                    {/* 🍍 ENLACE DE FIESTAS DE LAS FRUTAS EN MÓVIL */}
                    <Link 
                      href="/eventos/fiestas-de-frutas-2026" 
                      onClick={() => {
                        setIsOpen(false);
                        triggerParticles();
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-base font-bold rounded-lg transition-all bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md"
                    >
                      <span className="text-lg">🍍</span>
                      Fiestas de las Frutas
                      <span className="text-lg">🍓</span>
                    </Link>

                    <div className="h-px bg-[#E7E5E4] dark:bg-[#44403C] my-2" />
                    <Link href="/business" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[#44403C] dark:text-[#D6D3D1] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all">Negocios</Link>

                    {user && (
                      <>
                        <div className="h-px bg-[#E7E5E4] dark:bg-[#44403C] my-2" />
                        <Link href="/saved" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[#44403C] dark:text-[#D6D3D1] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all"><Heart className="h-5 w-5" /> Guardados</Link>
                        <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[#44403C] dark:text-[#D6D3D1] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all"><User className="h-5 w-5" /> Mi perfil</Link>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#F5F0E8] dark:bg-[#292524] animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}