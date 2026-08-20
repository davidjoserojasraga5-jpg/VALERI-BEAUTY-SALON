import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Copy, Calendar, MapPin, Scissors, Clock, User, Check, Sparkles, Home, Download } from 'lucide-react';
import { Booking } from '../../models/types';
import { SALON_INFO, SURCHARGE_ZONES, formatCOP } from '../../models/initialData';
import { WhatsAppController } from '../../controllers/WhatsAppController';

interface BookingSummaryModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onViewLookup: () => void;
}

export const BookingSummaryModal: React.FC<BookingSummaryModalProps> = ({
  booking,
  isOpen,
  onClose,
  onViewLookup
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen && booking) {
      // Trigger golden confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#C5A059', '#F5E1DA', '#1A1A1A', '#FFFFFF']
        });
      } catch (e) {
        console.log('Confetti rendered');
      }
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const isDomicilio = booking.modality === 'domicilio';
  const whatsappUrl = WhatsAppController.getClientConfirmationUrl(booking);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#D4AF37] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ticket Header */}
        <div className="bg-black text-white p-6 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center mx-auto mb-3 shadow-md font-bold">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4AF37] block mb-1">
            ¡Reserva Solicitada con Éxito!
          </span>
          <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-wide">
            Salón de Belleza Valeri
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            Hemos registrado tu cita en el sistema. Confirma directamente por WhatsApp con nuestro equipo.
          </p>

          {/* Booking Code Tag */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-[#D4AF37]/50 px-4 py-1.5 rounded-sm">
            <span className="text-xs text-neutral-300 uppercase tracking-wider">Código de Cita:</span>
            <span className="font-mono font-bold text-sm text-[#D4AF37]">
              #{booking.bookingCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="ml-1 p-1 hover:text-[#D4AF37] transition-colors"
              title="Copiar código"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Ticket Body: Structured Receipt */}
        <div className="p-6 overflow-y-auto space-y-4 bg-gray-50">
          
          {/* Key Appointment Details */}
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Fecha & Hora</span>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-900">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{booking.date}</span>
              </div>
              <span className="text-xs text-gray-600 font-mono pl-5 block">
                {booking.timeSlot} hrs
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Estilista Asignado</span>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-900">
                <Scissors className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="truncate">{booking.stylistName}</span>
              </div>
              <span className="text-xs text-gray-600 pl-5 block">
                {booking.totalDuration} min aprox.
              </span>
            </div>
          </div>

          {/* Location / Modality Box */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                {isDomicilio ? (
                  <>
                    <Home className="w-3.5 h-3.5 text-[#A88732]" />
                    <span className="text-[#A88732]">Servicio a Domicilio VIP</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Atención en Salón Valeri</span>
                  </>
                )}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                {isDomicilio ? `Recargo: +${formatCOP(booking.deliveryFee)}` : 'Salón Central'}
              </span>
            </div>

            {isDomicilio && booking.homeAddress ? (
              <p className="text-gray-600 pl-5 text-[11px]">
                {booking.homeAddress.street} #{booking.homeAddress.number}, {booking.homeAddress.neighborhood}, {booking.homeAddress.city}.
                {booking.homeAddress.references && ` (${booking.homeAddress.references})`}
              </p>
            ) : (
              <p className="text-gray-600 pl-5 text-[11px]">
                {SALON_INFO.address}
              </p>
            )}
          </div>

          {/* Services list & Price Breakdown */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs space-y-3">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Servicios Seleccionados</span>
            <div className="divide-y divide-gray-100">
              {booking.services.map((srv, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-neutral-900 block">{srv.name}</span>
                    <span className="text-[10px] text-gray-500">{srv.durationMinutes} min</span>
                  </div>
                  <span className="font-bold text-neutral-900">{formatCOP(srv.price)}</span>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">Total a Pagar ({booking.paymentMethod})</span>
                <span className="text-[10px] text-gray-400">Sin anticipo obligatorio • Pesos Colombianos</span>
              </div>
              <span className="text-xl font-bold text-[#D4AF37]">
                {formatCOP(booking.total, true)}
              </span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="p-5 border-t border-gray-200 bg-white space-y-3 shrink-0">
          {/* Main WhatsApp Direct Button */}
          <button
            onClick={handleSendWhatsApp}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-6 rounded-sm font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:brightness-105"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Confirmar Cita por WhatsApp</span>
          </button>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={() => {
                onClose();
                onViewLookup();
              }}
              className="text-gray-600 hover:text-black font-semibold text-[11px] uppercase tracking-wider underline underline-offset-2"
            >
              Consultar estado de cita
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-black text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider rounded-sm hover:bg-neutral-800"
            >
              Cerrar y Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
