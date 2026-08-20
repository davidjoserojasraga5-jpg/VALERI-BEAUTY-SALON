import React, { useState } from 'react';
import { Search, Calendar, Scissors, Clock, MapPin, User, MessageCircle, AlertCircle, Sparkles, CheckCircle2, Home } from 'lucide-react';
import { Booking } from '../../models/types';
import { searchBooking } from '../../services/firestoreService';
import { WhatsAppController } from '../../controllers/WhatsAppController';
import { SALON_INFO, formatCOP } from '../../models/initialData';

interface AppointmentLookupViewProps {
  onStartBooking: () => void;
}

export const AppointmentLookupView: React.FC<AppointmentLookupViewProps> = ({ onStartBooking }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Booking[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearched(true);
    try {
      const found = await searchBooking(searchQuery);
      setResults(found);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmada':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase tracking-wider">Confirmada</span>;
      case 'en_proceso':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px] uppercase tracking-wider">En Proceso</span>;
      case 'completada':
        return <span className="px-2.5 py-0.5 rounded-full bg-[#F5E1DA] text-black font-bold text-[10px] uppercase tracking-wider">Completada</span>;
      case 'cancelada':
        return <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 font-bold text-[10px] uppercase tracking-wider">Cancelada</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-wider">Pendiente</span>;
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#A88732]">
          <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
          Seguimiento de Citas Online
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
          Consulta tu Cita
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Ingresa tu código de reserva (ej. <strong className="text-neutral-900 font-mono">VAL-8492</strong>) o tu número de teléfono registrado.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ej: VAL-8492 o +57 310 845 9920 o 3108459920..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:brightness-110 text-black px-7 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSearching ? <span>Buscando...</span> : <span>Buscar Cita</span>}
          </button>
        </div>
      </form>

      {/* Results Section */}
      {searched && results !== null && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-8 space-y-4 shadow-2xs">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-neutral-800 uppercase tracking-wide">
                No encontramos reservas con ese código o número
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Verifica que el código coincida con el ticket de confirmación o programa una nueva cita en segundos.
              </p>
              <button
                onClick={onStartBooking}
                className="px-6 py-2.5 bg-black text-[#D4AF37] rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 cursor-pointer"
              >
                Agendar Nueva Cita
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <span>Resultados encontrados: {results.length}</span>
              </div>

              {results.map((booking) => {
                const isDomicilio = booking.modality === 'domicilio';
                const whatsappUrl = WhatsAppController.getClientConfirmationUrl(booking);

                return (
                  <div 
                    key={booking.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-neutral-900">
                            #{booking.bookingCode}
                          </span>
                          {getStatusBadge(booking.status)}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">
                          Cliente: <strong className="text-neutral-900">{booking.clientName}</strong> • {booking.clientPhone}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Total a Pagar (COP)</span>
                        <span className="text-2xl font-bold text-[#D4AF37]">
                          {formatCOP(booking.total, true)}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-gray-50 rounded-lg space-y-1 border border-gray-100">
                        <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest block">Horario Agendado</span>
                        <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{booking.date} a las {booking.timeSlot} hrs</span>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg space-y-1 border border-gray-100">
                        <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest block">Estilista</span>
                        <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                          <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{booking.stylistName}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg space-y-1 border border-gray-100">
                        <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest block">Modalidad</span>
                        <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                          {isDomicilio ? <Home className="w-3.5 h-3.5 text-[#A88732]" /> : <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />}
                          <span>{isDomicilio ? 'A Domicilio VIP' : 'En Salón'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Address info if Domicilio */}
                    {isDomicilio && booking.homeAddress && (
                      <div className="p-3 bg-[#F5E1DA] border border-[#D4AF37]/30 rounded-lg text-xs text-neutral-800">
                        <strong className="font-bold text-[10px] uppercase tracking-wider block mb-0.5 text-[#A88732]">Dirección de Entrega:</strong>
                        <span>{booking.homeAddress.street} #{booking.homeAddress.number}, {booking.homeAddress.neighborhood}, {booking.homeAddress.city}. {booking.homeAddress.references}</span>
                      </div>
                    )}

                    {/* Services list */}
                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold uppercase text-[9px] tracking-widest text-gray-500 block">Servicios incluidos:</span>
                      {booking.services.map((s, idx) => (
                        <div key={idx} className="flex justify-between py-1 border-b border-gray-50 text-neutral-700">
                          <span>• {s.name} ({s.durationMinutes} min)</span>
                          <span className="font-bold text-neutral-900">{formatCOP(s.price)}</span>
                        </div>
                      ))}
                    </div>

                    {/* WhatsApp Action Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-gray-500">
                        ¿Deseas reprogramar o consultar detalles con el salón?
                      </span>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp Valeri</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
