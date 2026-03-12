'use client';

import { useState, useEffect } from 'react';

export default function DealOfTheDay() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 0;
          minutes = 0;
          seconds = 0;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="lg:col-span-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4 px-2">
        <svg className="text-red-500" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c-3.2-2.4-8-6.7-8-12.1C4 6.5 7.6 3 12 1c4.4 2 8 5.5 8 9.9c0 5.4-4.8 9.7-8 12.1z" opacity="0.3" /><path d="M12 1C7.6 3 4 6.5 4 10.9c0 5.4 4.8 9.7 8 12.1c3.2-2.4 8-6.7 8-12.1C20 6.5 16.4 3 12 1Zm0 18.6c-2.2-2-6-5.6-6-8.7C6 7.2 8.7 4.5 12 3c3.3 1.5 6 4.2 6 7.9c0 3.1-3.8 6.7-6 8.7Z" /></svg>
        <h2 className="text-xl font-bold text-slate-900">Deal of the Day</h2>
      </div>
      <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
        {/* Discount Badge */}
        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10">
          40% OFF
        </div>
        <div className="w-full aspect-square relative mb-6 rounded-xl overflow-hidden bg-[#f7f6f8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt="Premium Olive Oil"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmPmz1eID0GFDeGPbna_-aGD8XY8Yx8ly5Ru57GHlPxDofMag9FxDjtvYP-S65TnUoKampA-ioeIa63-lFJXsFo-w-dqbubg2U9xLMi-Nh_XGL4iR4fOPoDQI3BXcXVRCmER9ogjWfu-JdGAJ1icUnY0KSWUP8n_4EVXTo8lVBo2Q51NbDjXhregtvrJH-4WKwSbf0z2AL7K-VeIeMO1X9cddWbOBbhU24EZHv1sW7OthymWhCEqvpgQFAAX5L4DAqHuRC6lZDW3c"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">Premium Olive Oil (1L)</h3>
              <p className="text-sm text-slate-500 mt-1">Extra Virgin, Imported</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-[#7c3bed]">₹850</p>
              <p className="text-sm text-slate-400 line-through">₹1450</p>
            </div>
          </div>
          {/* Timer */}
          <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center justify-between">
            <span className="text-red-600 text-xs font-bold uppercase tracking-wide">Ends in:</span>
            <div className="flex gap-2 text-red-700 font-mono font-bold text-sm">
              <span>{pad(timeLeft.hours)}</span>:<span>{pad(timeLeft.minutes)}</span>:<span>{pad(timeLeft.seconds)}</span>
            </div>
          </div>
          <button className="mt-4 w-full h-10 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
