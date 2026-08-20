import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles, Scissors, MapPin, Calendar, User, ShieldCheck, AlertCircle, Trash2, Plus } from 'lucide-react';
import { Booking, BookingFormDraft, LookbookItem, Service } from '../../models/types';
import { BookingController, INITIAL_DRAFT } from '../../controllers/BookingController';
import { ModalitySelector } from './ModalitySelector';
import { CalendarPicker } from './CalendarPicker';
import { ClientForm } from './ClientForm';
import { BookingSummaryModal } from './BookingSummaryModal';
import { SALON_INFO, SURCHARGE_ZONES, formatCOP } from '../../models/initialData';

interface BookingWizardViewProps {
  draft: BookingFormDraft;
  setDraft: React.Dispatch<React.SetStateAction<BookingFormDraft>>;
  onOpenCatalog: () => void;
  existingBookings: Booking[];
  onBookingSuccess: (booking: Booking) => void;
  onCancel: () => void;
  onOpenLookup: () => void;
}

export const BookingWizardView: React.FC<BookingWizardViewProps> = ({
  draft,
  setDraft,
  onOpenCatalog,
  existingBookings,
  onBookingSuccess,
  onCancel,
  onOpenLookup
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  const steps = [
    { num: 1, title: 'Servicios', icon: Scissors },
    { num: 2, title: 'Modalidad', icon: MapPin },
    { num: 3, title: 'Fecha & Hora', icon: Calendar },
    { num: 4, title: 'Tus Datos', icon: User },
  ];

  const totals = BookingController.calculateTotals(draft);

  const handleNext = async () => {
    setErrorMessage(null);
    const validation = BookingController.validateStep(draft, draft.step);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Por favor completa todos los campos obligatorios.');
      return;
    }

    if (draft.step < 4) {
      setDraft(prev => ({ ...prev, step: prev.step + 1 }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final submission step
      setIsSubmitting(true);
      try {
        const result = await BookingController.submitBooking(draft);
        setCompletedBooking(result);
        onBookingSuccess(result);
      } catch (err) {
        console.error('Failed to submit booking:', err);
        setErrorMessage('Hubo un inconveniente al guardar tu cita. Por favor intenta de nuevo.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    if (draft.step > 1) {
      setDraft(prev => ({ ...prev, step: prev.step - 1 }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  const handleRemoveService = (serviceId: string) => {
    setDraft(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(s => s.id !== serviceId)
    }));
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Wizard Header & Stepper */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A88732] block">
              Asistente de Reservas Online
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
              Agenda tu Experiencia
            </h1>
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium">Disponibilidad en tiempo real sincronizada</span>
          </div>
        </div>

        {/* Step Progress Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((s) => {
            const isCurrent = draft.step === s.num;
            const isDone = draft.step > s.num;
            return (
              <div
                key={s.num}
                className={`flex items-center gap-3 transition-all ${
                  isCurrent
                    ? 'opacity-100'
                    : isDone
                    ? 'opacity-90'
                    : 'opacity-40'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  isCurrent
                    ? 'bg-black text-white'
                    : isDone
                    ? 'bg-[#D4AF37] text-black'
                    : 'border border-gray-400 text-gray-400'
                }`}>
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 block leading-tight">
                    {s.title}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Paso 0{s.num}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Offer / VIP Notice Box */}
      <div className="p-4 bg-[#F5E1DA] rounded-xl border border-[#D4AF37]/20 flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#A88732] block mb-0.5">
            Experiencia Valeri VIP
          </span>
          <p className="text-xs font-serif italic text-neutral-800">
            "Cada detalle está pensado para realzar tu belleza con los mejores productos de grado profesional."
          </p>
        </div>
        <span className="text-[9px] uppercase font-bold tracking-widest text-[#A88732] bg-white/70 px-2.5 py-1 rounded-sm border border-[#D4AF37]/30 shrink-0">
          Garantía 100%
        </span>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs sm:text-sm text-red-700 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Wizard Content Grid: Step Body + Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Step Main View (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs">
          
          {/* STEP 1: Services review & management */}
          {draft.step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
                    Servicios Seleccionados
                  </h3>
                  <p className="text-xs text-gray-500">
                    Revisa los tratamientos que deseas incluir o añade más desde el catálogo.
                  </p>
                </div>

                <button
                  onClick={onOpenCatalog}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-[#F5E1DA] hover:bg-[#ebd3cb] text-neutral-900 font-bold text-[10px] sm:text-xs uppercase tracking-wider border border-[#D4AF37]/30 transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#A88732]" />
                  <span>Añadir más servicios</span>
                </button>
              </div>

              {draft.selectedServices.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl p-6 space-y-3">
                  <Scissors className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-sm font-semibold text-gray-700">
                    Aún no has seleccionado ningún servicio para tu cita
                  </p>
                  <button
                    onClick={onOpenCatalog}
                    className="px-5 py-2.5 bg-black text-[#D4AF37] rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-neutral-800"
                  >
                    Ver Catálogo Completo
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {draft.selectedServices.map((srv) => (
                    <div key={srv.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={srv.image}
                          alt={srv.name}
                          className="w-14 h-14 rounded-lg object-cover border border-[#F5E1DA]"
                        />
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-neutral-900">
                            {srv.name}
                          </h4>
                          <span className="text-[11px] text-gray-500 block">
                            {srv.durationMinutes} min • Categoría: {srv.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-base font-bold text-[#D4AF37]">
                          {formatCOP(srv.price)}
                        </span>
                        <button
                          onClick={() => handleRemoveService(srv.id)}
                          className="p-2 rounded-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Eliminar de la cita"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Modality & Address */}
          {draft.step === 2 && (
            <ModalitySelector
              modality={draft.modality}
              onChangeModality={(mod) => setDraft(prev => ({ ...prev, modality: mod }))}
              homeAddress={draft.homeAddress}
              onChangeAddress={(addr) => setDraft(prev => ({ ...prev, homeAddress: addr }))}
              selectedZoneId={draft.selectedZoneId}
              onChangeZone={(zId) => setDraft(prev => ({ ...prev, selectedZoneId: zId }))}
            />
          )}

          {/* STEP 3: Stylist, Date & Time Slot */}
          {draft.step === 3 && (
            <CalendarPicker
              selectedDate={draft.selectedDate}
              onSelectDate={(d) => setDraft(prev => ({ ...prev, selectedDate: d }))}
              selectedTimeSlot={draft.selectedTimeSlot}
              onSelectTimeSlot={(ts) => setDraft(prev => ({ ...prev, selectedTimeSlot: ts }))}
              selectedStylistId={draft.selectedStylistId}
              onSelectStylist={(sId) => setDraft(prev => ({ ...prev, selectedStylistId: sId }))}
              existingBookings={existingBookings}
            />
          )}

          {/* STEP 4: Client Info & Payment */}
          {draft.step === 4 && (
            <ClientForm
              clientName={draft.clientName}
              onChangeName={(n) => setDraft(prev => ({ ...prev, clientName: n }))}
              clientPhone={draft.clientPhone}
              onChangePhone={(p) => setDraft(prev => ({ ...prev, clientPhone: p }))}
              clientEmail={draft.clientEmail}
              onChangeEmail={(e) => setDraft(prev => ({ ...prev, clientEmail: e }))}
              clientNotes={draft.clientNotes}
              onChangeNotes={(notes) => setDraft(prev => ({ ...prev, clientNotes: notes }))}
              paymentMethod={draft.paymentMethod}
              onChangePaymentMethod={(pm) => setDraft(prev => ({ ...prev, paymentMethod: pm }))}
            />
          )}

          {/* Step Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-gray-300 text-neutral-800 font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{draft.step === 1 ? 'Cancelar' : 'Anterior'}</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleNext}
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:brightness-110 text-black px-7 py-3 rounded-sm font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Guardando cita...</span>
              ) : draft.step === 4 ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[3]" />
                  <span>Finalizar y Confirmar Reserva</span>
                </>
              ) : (
                <>
                  <span>Siguiente Paso</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Live Booking Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-[#F9F9F9] p-6 rounded-xl border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="font-serif font-bold text-lg text-neutral-900 uppercase tracking-wide">
              Resumen de Cita
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#A88732] bg-[#F5E1DA] px-2.5 py-1 rounded-sm border border-[#D4AF37]/30">
              {draft.modality === 'domicilio' ? 'A Domicilio' : 'En Salón'}
            </span>
          </div>

          {/* Selected Services list summary */}
          <div className="space-y-2 text-xs">
            <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest block">
              Servicios ({draft.selectedServices.length})
            </span>
            {draft.selectedServices.length === 0 ? (
              <p className="text-gray-400 italic">Ningún servicio seleccionado.</p>
            ) : (
              <div className="space-y-1.5">
                {draft.selectedServices.map(s => (
                  <div key={s.id} className="flex items-center justify-between text-neutral-800">
                    <span className="truncate max-w-[180px]">• {s.name}</span>
                    <span className="font-bold text-[#D4AF37]">{formatCOP(s.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule & Stylist Info if selected */}
          <div className="pt-3 border-t border-gray-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-gray-600">
              <span className="text-[10px] uppercase font-bold tracking-wider">Duración:</span>
              <span className="font-bold text-neutral-900">{totals.totalDuration} min</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span className="text-[10px] uppercase font-bold tracking-wider">Fecha:</span>
              <span className="font-bold text-neutral-900">{draft.selectedDate || 'Por definir'}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span className="text-[10px] uppercase font-bold tracking-wider">Hora:</span>
              <span className="font-bold text-neutral-900">{draft.selectedTimeSlot} hrs</span>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="pt-3 border-t border-gray-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-gray-600">
              <span className="text-[10px] uppercase tracking-wider">Subtotal:</span>
              <span className="font-bold text-neutral-900">{formatCOP(totals.subtotal)}</span>
            </div>

            {draft.modality === 'domicilio' && (
              <div className="flex items-center justify-between text-[#A88732] font-semibold">
                <span className="text-[10px] uppercase tracking-wider">Traslado a domicilio:</span>
                <span>+{formatCOP(totals.deliveryFee)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-300 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-900">
              <span>Total Estimado:</span>
              <span className="text-xl font-bold text-[#D4AF37]">{formatCOP(totals.total, true)}</span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="p-3.5 bg-white rounded-lg border border-gray-200 text-[11px] text-gray-500 space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-900 font-bold text-[10px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Garantía de Atención</span>
            </div>
            <p>
              Confirmación directa por WhatsApp con nuestro equipo y recordatorio previo.
            </p>
          </div>
        </div>

      </div>

      {/* Completion Modal */}
      <BookingSummaryModal
        booking={completedBooking}
        isOpen={!!completedBooking}
        onClose={() => {
          setCompletedBooking(null);
          onCancel();
        }}
        onViewLookup={onOpenLookup}
      />
    </div>
  );
};
