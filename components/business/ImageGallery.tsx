"use client";

import { ChevronLeft, ChevronRight, Expand, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage, LoadedSanityImage } from "@/types";

interface ImageGalleryProps {
  images: (SanityImage | LoadedSanityImage)[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      else if (e.key === "ArrowRight") goToNext();
      else if (e.key === "Escape") setLightboxOpen(false);
    },
    [goToPrevious, goToNext]
  );

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] sm:aspect-[16/9] bg-muted rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-border/50">
        <ImageIcon className="h-10 w-10 text-muted-foreground/40 mb-2" />
        <span className="text-muted-foreground text-sm font-medium">Galería no disponible</span>
      </div>
    );
  }

  const getAssetId = (image: any): string => image.asset?._id || image.asset?._ref || "";

  return (
    <>
      <section 
        className="space-y-3 sm:space-y-4" 
        aria-label="Galería de imágenes"
      >
        {/* Contenedor Imagen Principal */}
        <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden group shadow-warm bg-muted">
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
            aria-label="Ampliar imagen"
          >
            <Image
              src={urlFor(images[selectedIndex]).width(1200).height(675).url()}
              alt={images[selectedIndex].alt || title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 800px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            
            {/* Indicador visual de expansión en móvil */}
            <div className="absolute top-3 right-3 sm:hidden bg-background/80 backdrop-blur-md p-2 rounded-full shadow-sm">
              <Expand className="h-4 w-4 text-foreground" />
            </div>

            {/* Overlay Desktop */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center">
              <div className="bg-background/90 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
                <Expand className="h-6 w-6 text-foreground" />
              </div>
            </div>

            {/* Badge de contador */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-background/90 backdrop-blur-md text-foreground px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm tabular-nums border border-border/50">
              {selectedIndex + 1} / {images.length}
            </div>
          </button>

          {/* Flechas Navegación */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-md hover:bg-background shadow-md h-9 w-9 sm:h-11 sm:w-11 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-md hover:bg-background shadow-md h-9 w-9 sm:h-11 sm:w-11 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        {/* Miniaturas con Scroll Táctil Optimizado */}
        {images.length > 1 && (
          <div 
            className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory"
          >
            {images.map((image, index) => (
              <button
                key={getAssetId(image) || index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-xl overflow-hidden border-2 transition-all snap-start ${
                  index === selectedIndex
                    ? "border-primary ring-2 ring-primary/20 scale-[0.98]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={urlFor(image).width(200).height(150).url()}
                  alt={`Miniatura ${index + 1}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox con Fullscreen en Móvil */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent 
          className="max-w-[100vw] sm:max-w-7xl w-full h-[100dvh] sm:h-auto p-0 bg-black/95 border-none flex flex-col justify-center items-center"
          onKeyDown={handleKeyDown}
        >
          <DialogTitle className="sr-only">Imagen ampliada de {title}</DialogTitle>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={urlFor(images[selectedIndex]).width(1920).url()}
              alt={images[selectedIndex].alt || title}
              fill
              className="object-contain"
              sizes="100vw"
            />

            {/* Navegación Lightbox */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full h-12 w-12"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full h-12 w-12"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Contador Lightbox */}
            <div className="absolute bottom-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}