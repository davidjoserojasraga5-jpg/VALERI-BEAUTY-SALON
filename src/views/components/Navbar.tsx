import React, { useState } from 'react';
import { Sparkles, Calendar, Search, ShieldCheck, Phone, Scissors, MapPin, Menu, X, ShoppingBag } from 'lucide-react';
import { SALON_INFO } from '../../models/initialData';
import { Service } from '../../models/types';

interface NavbarProps {
  activeView: 'home' | 'catalog' | 'booking' | 'lookup' | 'stylists' | 'admin';
  setActiveView: (view: 'home' | 'catalog' | 'booking' | 'lookup' | 'stylists' | 'admin') => void;
  selectedServicesCount: number;
  onOpenBooking: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  selectedServicesCount,
  onOpenBooking,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'catalog' | 'booking' | 'lookup' | 'stylists' | 'admin') => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#D4AF37]/30 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo / Wordmark */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black flex items-center justify-center rounded-full shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <span className="text-[#D4AF37] font-serif font-bold text-sm sm:text-base">V</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-serif tracking-widest uppercase font-bold text-[#1A1A1A] leading-tight">
                Valeri <span className="text-[#D4AF37] font-normal lowercase sm:uppercase text-sm sm:text-base">Beauty Salon</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-semibold">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-all pb-1 ${
                activeView === 'home'
                  ? 'border-b-2 border-[#D4AF37] text-[#1A1A1A]'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className={`transition-all pb-1 ${
                activeView === 'catalog'
                  ? 'border-b-2 border-[#D4AF37] text-[#1A1A1A]'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => handleNavClick('booking')}
              className={`transition-all pb-1 ${
                activeView === 'booking'
                  ? 'border-b-2 border-[#D4AF37] text-[#1A1A1A]'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              Asistente de Reservas
            </button>
            <button
              onClick={() => handleNavClick('stylists')}
              className={`transition-all pb-1 ${
                activeView === 'stylists'
                  ? 'border-b-2 border-[#D4AF37] text-[#1A1A1A]'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              Estilistas
            </button>
            <button
              onClick={() => handleNavClick('lookup')}
              className={`transition-all pb-1 flex items-center gap-1.5 ${
                activeView === 'lookup'
                  ? 'border-b-2 border-[#D4AF37] text-[#1A1A1A]'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              <Search className="w-3 h-3" />
              <span>Mi Reserva</span>
            </button>
          </nav>

          {/* Actions Zone */}
          <div className="flex items-center gap-3">
            {/* Direct Booking Assistant Button */}
            <button
              onClick={onOpenBooking}
              className="relative inline-flex items-center gap-2 bg-[#D4AF37] hover:brightness-110 text-black px-4 sm:px-5 py-2.5 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-xs transition-all group"
            >
              <Calendar className="w-3.5 h-3.5 text-black" />
              <span className="whitespace-nowrap">Agendar Cita</span>
              {selectedServicesCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-black text-[#D4AF37] font-bold text-[10px] flex items-center justify-center ml-0.5">
                  {selectedServicesCount}
                </span>
              )}
            </button>

            {/* Admin Portal Toggle */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-sm border transition-all text-xs flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'border-[#D4AF37] bg-[#F5E1DA]/30 text-[#A88732] font-bold ring-1 ring-[#D4AF37]'
                  : 'border-gray-200 text-gray-500 hover:text-black hover:border-gray-400'
              }`}
              title="Panel Administrativo"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden xl:inline text-[10px] uppercase font-bold tracking-wider">
                {isAdminLoggedIn ? 'Admin Online' : 'Admin'}
              </span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-6 space-y-3 shadow-lg text-xs uppercase tracking-widest font-semibold">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2.5 px-3 rounded-sm hover:bg-[#F5E1DA]/30 text-neutral-800"
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavClick('catalog')}
            className="w-full text-left py-2.5 px-3 rounded-sm hover:bg-[#F5E1DA]/30 text-neutral-800"
          >
            Catálogo de Servicios
          </button>
          <button
            onClick={() => handleNavClick('booking')}
            className="w-full text-left py-2.5 px-3 rounded-sm hover:bg-[#F5E1DA]/30 text-neutral-800"
          >
            Asistente de Reservas
          </button>
          <button
            onClick={() => handleNavClick('stylists')}
            className="w-full text-left py-2.5 px-3 rounded-sm hover:bg-[#F5E1DA]/30 text-neutral-800"
          >
            Equipo de Estilistas
          </button>
          <button
            onClick={() => handleNavClick('lookup')}
            className="w-full text-left py-2.5 px-3 rounded-sm hover:bg-[#F5E1DA]/30 text-neutral-800 flex items-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            Consultar Mi Reserva
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className="w-full text-left py-2.5 px-3 rounded-sm hover:bg-[#F5E1DA]/30 text-[#A88732] flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Acceso Administrador
          </button>
          
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500 normal-case tracking-normal">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              {SALON_INFO.address}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
