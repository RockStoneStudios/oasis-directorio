'use client';

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
  title?: string;
}

export default function CountdownTimer({ targetDate, title }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate);
    const timer = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 rounded-2xl p-6 md:p-8 mb-8 text-white text-center shadow-2xl">
      <p className="text-xs md:text-sm uppercase tracking-wider mb-2 font-semibold">
        🍍 ¡LA ESPERA CASI TERMINA! 💃
      </p>
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        {title || "Cuenta regresiva para el evento"}
      </h2>
      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-3 text-white shadow-lg">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-[10px] uppercase tracking-wider">Días</div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-3 text-white shadow-lg">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-[10px] uppercase tracking-wider">Horas</div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-3 text-white shadow-lg">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-[10px] uppercase tracking-wider">Minutos</div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-3 text-white shadow-lg">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-[10px] uppercase tracking-wider">Segundos</div>
        </div>
      </div>
      <p className="text-xs mt-4 text-teal-100">📍 Evento en Sopetrán, Antioquia</p>
    </div>
  );
}