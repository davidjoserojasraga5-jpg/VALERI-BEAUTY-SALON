import React from 'react';
import { Star, Scissors, Sparkles, Award, Calendar, CheckCircle2 } from 'lucide-react';
import { INITIAL_STYLISTS } from '../../models/initialData';
import { Stylist } from '../../models/types';

interface StylistsShowcaseProps {
  onSelectStylistForBooking: (stylistId: string) => void;
}

export const StylistsShowcase: React.FC<StylistsShowcaseProps> = ({ onSelectStylistForBooking }) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#A88732]">
          <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
          Equipo Profesional de Élite
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
          Nuestros Estilistas Master
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Profesionales certificados con formación internacional en técnicas vanguardistas de corte, colorimetría, barbería clásica y nail art.
        </p>
      </div>

      {/* Grid of Stylists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {INITIAL_STYLISTS.map((stylist) => (
          <div
            key={stylist.id}
            className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
                <img
                  src={stylist.image}
                  alt={stylist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-white/10">
                  <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                  <span>{stylist.rating}</span>
                  <span className="text-[10px] text-neutral-400">({stylist.reviewCount})</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                    {stylist.role}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wide">
                    {stylist.name}
                  </h3>
                </div>
              </div>

              {/* Bio & Specialties */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {stylist.bio}
                </p>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-2">
                    Especialidades Destacadas:
                  </span>
                  <div className="space-y-1.5">
                    {stylist.specialties.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#A88732] shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-5 pt-0">
              <button
                onClick={() => onSelectStylistForBooking(stylist.id)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#F5E1DA] hover:bg-black text-neutral-900 hover:text-[#D4AF37] border border-[#D4AF37]/30 hover:border-black py-2.5 px-4 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all shadow-2xs group-hover:bg-black group-hover:text-[#D4AF37]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#A88732] group-hover:text-[#D4AF37]" />
                <span>Reservar con {stylist.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
