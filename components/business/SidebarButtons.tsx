'use client';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Globe, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";

export function SidebarButtons({ business, whatsappUrl }: { business: any, whatsappUrl: string | null }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const shadow = {
    small: resolvedTheme === 'dark' 
      ? '5px 5px 12px rgba(10,14,18,0.8), -5px -5px 12px rgba(35,45,55,0.5)' 
      : '5px 5px 12px rgba(163,177,198,0.6), -5px -5px 12px rgba(255,255,255,0.5)',
    smallHover: resolvedTheme === 'dark'
      ? 'inset 4px 4px 10px rgba(0,0,0,0.7), inset -4px -4px 10px rgba(45,55,65,0.4)'
      : 'inset 3px 3px 8px rgba(163,177,198,0.6), inset -3px -3px 8px rgba(255,255,255,0.4)',
    outer: resolvedTheme === 'dark'
      ? '18px 18px 36px rgba(10,14,18,0.9), -18px -18px 36px rgba(35,45,55,0.6)'
      : '20px 20px 40px rgba(163,177,198,0.8), -20px -20px 40px rgba(255,255,255,0.6)'
  };

  const links = [
    { cond: business.phone, href: `tel:${business.phone}`, icon: Phone, color: 'text-green-600 dark:text-green-400', title: 'Teléfono' },
    { cond: business.website, href: business.website, icon: Globe, color: 'text-blue-600 dark:text-blue-400', title: 'Sitio web' },
    { cond: business.facebook, href: business.facebook, icon: SiFacebook, color: 'text-[#1877F2]', title: 'Facebook' },
    { cond: business.instagram, href: business.instagram, icon: SiInstagram, color: 'text-[#E4405F]', title: 'Instagram' },
    { cond: business.tiktok, href: business.tiktok, icon: SiTiktok, color: 'text-gray-900 dark:text-white', title: 'TikTok' },
    { cond: whatsappUrl, href: whatsappUrl, icon: SiWhatsapp, color: 'text-green-600 dark:text-green-400', title: 'WhatsApp' },
  ].filter(l => l.cond);

  return (
    <section 
      className="rounded-2xl p-5 sm:p-6 transition-all duration-300 bg-[#e0e5ec] dark:bg-[#151a20]"
      style={{ boxShadow: mounted ? shadow.outer : undefined }}
    >
      <div className="grid gap-4 justify-items-center" style={{ gridTemplateColumns: `repeat(${links.length}, minmax(0, 1fr))` }}>
        {links.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={item.title}
            className="w-12 h-12 rounded-full bg-[#e0e5ec] dark:bg-[#151a20] transition-all duration-300 flex items-center justify-center group"
            style={{ boxShadow: mounted ? shadow.small : undefined }}
            onMouseDown={(e) => { e.currentTarget.style.boxShadow = shadow.smallHover; }}
            onMouseUp={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = shadow.small; }}
          >
            <item.icon className={`h-6 w-6 ${item.color} group-hover:scale-110 transition-transform`} />
          </a>
        ))}
      </div>
    </section>
  );
}