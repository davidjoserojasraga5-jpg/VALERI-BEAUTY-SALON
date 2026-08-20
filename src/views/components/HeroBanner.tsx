import React from 'react';
import { Calendar, Sparkles, Home, Star, Scissors, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { SALON_INFO } from '../../models/initialData';

interface HeroBannerProps {
  onStartBooking: (modality?: 'presencial' | 'domicilio') => void;
  onExploreCatalog: (category?: string) => void;
  onOpenLookup: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartBooking,
  onExploreCatalog,
  onOpenLookup
}) => {
  return (
    <section className="relative overflow-hidden bg-black text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
      {/* Background Subtle Accent Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#F5E1DA]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Salón de Belleza Valeri • Haute Coiffure & Spa
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight uppercase">
              Tu Estilo, Tu Esencia, <br />
              <span className="text-[#D4AF37] italic font-serif lowercase">nuestra pasión.</span>
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Descubre nuestro catálogo exclusivo para <strong className="text-white font-semibold">Damas, Caballeros, Niños y Jóvenes</strong>. Disfruta de la atención en nuestro salón boutique o solicita nuestro <strong className="text-[#F5E1DA] font-semibold">servicio VIP a domicilio</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onStartBooking('presencial')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#D4AF37] hover:brightness-110 text-black font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-sm shadow-lg shadow-[#D4AF37]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4 text-black" />
                <span>Agendar en Salón</span>
              </button>

              <button
                onClick={() => onStartBooking('domicilio')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-sm transition-all hover:border-[#F5E1DA]"
              >
                <Home className="w-4 h-4 text-[#F5E1DA]" />
                <span>Pedir a Domicilio VIP</span>
              </button>
            </div>

            {/* Fast Category Quicklinks */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-neutral-400">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 mr-1">Explorar:</span>
              <button 
                onClick={() => onExploreCatalog('damas')}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-200 text-xs transition-colors"
              >
                💅 Damas
              </button>
              <button 
                onClick={() => onExploreCatalog('caballeros')}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-200 text-xs transition-colors"
              >
                ✂️ Caballeros
              </button>
              <button 
                onClick={() => onExploreCatalog('jovenes')}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-200 text-xs transition-colors"
              >
                ⚡ Jóvenes
              </button>
              <button 
                onClick={() => onExploreCatalog('ninos')}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-neutral-200 text-xs transition-colors"
              >
                🧸 Niños
              </button>
            </div>
          </div>

          {/* Featured Visual Card Showcase */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-white/[0.04] border border-[#D4AF37]/30 rounded-xl p-6 backdrop-blur-md shadow-2xl">
              
              {/* Top Card Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-neutral-200">4.98 / 5.0 (800+ Citas)</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40">
                  Valeri VIP
                </span>
              </div>

              {/* Image Grid with styles */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="relative group overflow-hidden rounded-lg h-36">
                  <img
                    src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80"
                    alt="Balayage Signature"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-xs font-medium text-white">Balayage & Color</span>
                  </div>
                </div>

                <div className="relative group overflow-hidden rounded-lg h-36">
                  <img
                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80"
                    alt="Barbería & Fade"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-xs font-medium text-white">Fade & Barba Clásica</span>
                  </div>
                </div>
              </div>

              {/* Key Amenities */}
              <div className="space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Horarios: Lun a Sáb 8am - 8pm | Dom 9am - 5pm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-3.5 h-3.5 text-[#F5E1DA] shrink-0" />
                  <span>Servicio a domicilio con instrumental esterilizado</span>
                </div>
              </div>

              {/* Fast lookup link */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-neutral-400">¿Tienes una cita agendada?</span>
                <button
                  onClick={onOpenLookup}
                  className="text-xs text-[#D4AF37] hover:underline font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                >
                  <span>Consultar estado</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
