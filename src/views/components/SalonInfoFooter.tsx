import React from 'react';
import { Scissors, MapPin, Phone, Mail, Clock, Instagram, ShieldCheck, Home, Sparkles } from 'lucide-react';
import { SALON_INFO, SURCHARGE_ZONES, formatCOP } from '../../models/initialData';

interface SalonInfoFooterProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onExploreCatalog: () => void;
}

export const SalonInfoFooter: React.FC<SalonInfoFooterProps> = ({
  onOpenBooking,
  onOpenAdmin,
  onExploreCatalog
}) => {
  return (
    <footer className="bg-black text-white border-t border-[#D4AF37]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* VIP Home Service Banner Strip */}
        <div className="bg-[#F5E1DA] rounded-xl p-6 sm:p-8 border border-[#D4AF37]/40 mb-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 text-black">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-lg bg-black text-[#D4AF37] flex items-center justify-center shrink-0 shadow-xs">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88732] block">
                Atención VIP Personalizada
              </span>
              <h3 className="text-xl font-serif font-bold text-black uppercase tracking-wide">
                ¿Prefieres atención en la comodidad de tu hogar?
              </h3>
              <p className="text-xs text-neutral-700 mt-1 max-w-xl">
                Nuestro servicio VIP a domicilio cubre Zona Centro, Norte, Sur y Periferia con instrumental esterilizado de primer nivel.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-[#D4AF37] font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-sm shadow-md transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Solicitar a Domicilio</span>
          </button>
        </div>

        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-white/10 text-xs">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-widest text-white uppercase">
                VALERI
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed font-light">
              {SALON_INFO.slogan}. Salón boutique y servicio a domicilio para damas, caballeros, jóvenes y niños.
            </p>
            <div className="pt-1 text-[#D4AF37] font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Instagram className="w-4 h-4" />
              <span>{SALON_INFO.instagram}</span>
            </div>
          </div>

          {/* Col 2: Horarios */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Horarios de Atención
            </h4>
            <div className="space-y-2 text-neutral-300">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-[11px] uppercase tracking-wider">Salón Boutique:</span>
                  <span className="text-neutral-400">{SALON_INFO.schedule}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Home className="w-4 h-4 text-[#F5E1DA] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-[11px] uppercase tracking-wider">Servicio a Domicilio:</span>
                  <span className="text-neutral-400">{SALON_INFO.homeServiceHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Ubicación y Contacto */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Contacto Directo
            </h4>
            <div className="space-y-2.5 text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-neutral-400">{SALON_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-neutral-400">{SALON_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-neutral-400">{SALON_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Zonas de Cobertura Domicilio */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Zonas de Traslado
            </h4>
            <div className="space-y-1 text-neutral-400">
              {SURCHARGE_ZONES.map(z => (
                <div key={z.id} className="flex justify-between py-1 border-b border-white/5">
                  <span className="truncate max-w-[140px]">{z.name.split('(')[0]}</span>
                  <span className="text-[#D4AF37] font-bold">+{formatCOP(z.fee)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright & admin portal shortcut */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Salón de Belleza Valeri. Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onExploreCatalog}
              className="hover:text-neutral-300 transition-colors uppercase tracking-wider text-[11px]"
            >
              Catálogo
            </button>
            <span>•</span>
            <button
              onClick={onOpenBooking}
              className="hover:text-neutral-300 transition-colors uppercase tracking-wider text-[11px]"
            >
              Reservar
            </button>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#D4AF37] hover:underline font-bold uppercase tracking-wider text-[11px]"
            >
              Portal Administrativo
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
