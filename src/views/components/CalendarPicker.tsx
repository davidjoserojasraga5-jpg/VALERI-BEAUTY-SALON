import React, { useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, User, Star, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Booking, Stylist } from '../../models/types';
import { INITIAL_STYLISTS } from '../../models/initialData';
import { BookingController, getTodayDateString } from '../../controllers/BookingController';

interface CalendarPickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedTimeSlot: string;
  onSelectTimeSlot: (slot: string) => void;
  selectedStylistId: string;
  onSelectStylist: (stylistId: string) => void;
  existingBookings: Booking[];
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onSelectDate,
  selectedTimeSlot,
  onSelectTimeSlot,
  selectedStylistId,
  onSelectStylist,
  existingBookings
}) => {
  const today = getTodayDateString();

  // Generate next 14 available days for fast horizontal picking
  const nextDays = useMemo(() => {
    const days = [];
    const baseDate = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('es-ES', { month: 'short' });
      
      days.push({
        dateStr,
        dayName: dayName.toUpperCase(),
        dayNum,
        monthName: monthName.toUpperCase(),
        isToday: i === 0
      });
    }
    return days;
  }, []);

  // Compute available time slots for the chosen date and stylist
  const slots = useMemo(() => {
    return BookingController.getAvailableTimeSlots(selectedDate, selectedStylistId, existingBookings);
  }, [selectedDate, selectedStylistId, existingBookings]);

  return (
    <div className="space-y-8">
      {/* 1. Stylist Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
              Selecciona tu Estilista
            </h3>
            <p className="text-xs text-gray-500">
              Elige a tu profesional de confianza o asignaremos al primer especialista libre.
            </p>
          </div>
        </div>

        {/* Stylist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Any Stylist Option */}
          <div
            onClick={() => onSelectStylist('any')}
            className={`cursor-pointer rounded-xl p-3.5 border transition-all text-center flex flex-col items-center justify-center ${
              selectedStylistId === 'any'
                ? 'border-[#D4AF37] bg-[#F5E1DA]/20 ring-1 ring-[#D4AF37] shadow-xs'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="w-11 h-11 rounded-full bg-black text-[#D4AF37] flex items-center justify-center font-serif text-base font-bold mb-2">
              ★
            </div>
            <span className="font-bold text-xs uppercase tracking-wider text-neutral-900 block leading-tight">
              Cualquier Estilista
            </span>
            <span className="text-[10px] uppercase font-bold text-[#A88732] mt-0.5">
              Mayor disponibilidad
            </span>
          </div>

          {/* Named Stylists */}
          {INITIAL_STYLISTS.map((stylist) => {
            const isSelected = selectedStylistId === stylist.id;
            return (
              <div
                key={stylist.id}
                onClick={() => onSelectStylist(stylist.id)}
                className={`cursor-pointer rounded-xl p-3 border transition-all relative flex flex-col items-center text-center ${
                  isSelected
                    ? 'border-[#D4AF37] bg-[#F5E1DA]/20 ring-1 ring-[#D4AF37] shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="relative w-11 h-11 rounded-full overflow-hidden mb-2 border border-[#D4AF37]">
                  <img
                    src={stylist.image}
                    alt={stylist.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="font-bold text-xs uppercase tracking-wider text-neutral-900 block leading-tight truncate max-w-full">
                  {stylist.name}
                </span>
                <span className="text-[10px] text-gray-500 block truncate max-w-full">
                  {stylist.role.split('&')[0]}
                </span>

                <div className="mt-1 flex items-center gap-1 text-[10px] text-[#A88732] font-bold">
                  <Star className="w-3 h-3 fill-current text-[#D4AF37]" />
                  <span>{stylist.rating}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Date Selection (Visual Days Carousel / Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
              Fecha de la Cita
            </h3>
            <p className="text-xs text-gray-500">
              Selecciona el día de tu preferencia para la sesión.
            </p>
          </div>
          
          {/* Custom Date Input for dates further ahead */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 hidden sm:inline">Otra fecha:</span>
            <input
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => onSelectDate(e.target.value)}
              className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-neutral-800 focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Days Scrollable Row */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {nextDays.map((day) => {
            const isSelected = selectedDate === day.dateStr;
            return (
              <button
                key={day.dateStr}
                onClick={() => onSelectDate(day.dateStr)}
                className={`flex flex-col items-center justify-center p-3 min-w-[70px] rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-xs ring-1 ring-[#D4AF37]'
                    : 'bg-white text-neutral-800 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className={`text-[9px] font-bold tracking-widest uppercase ${isSelected ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                  {day.dayName}
                </span>
                <span className="text-lg font-bold my-0.5">
                  {day.dayNum}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                  {day.isToday ? 'HOY' : day.monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Time Slot Grid */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
            Horario Disponible
          </h3>
          <p className="text-xs text-gray-500">
            Horarios calculados en tiempo real según la agenda de estilistas.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {slots.map((slot) => {
            const isSelected = selectedTimeSlot === slot.time;
            return (
              <button
                key={slot.time}
                disabled={!slot.available}
                onClick={() => onSelectTimeSlot(slot.time)}
                className={`py-2.5 px-2 rounded-lg text-xs font-semibold transition-all flex flex-col items-center justify-center ${
                  !slot.available
                    ? 'bg-gray-100 text-gray-400 border border-dashed border-gray-200 cursor-not-allowed line-through opacity-60'
                    : isSelected
                    ? 'bg-[#D4AF37] text-black font-bold shadow-xs ring-1 ring-black'
                    : 'bg-white border border-gray-200 text-neutral-800 hover:border-gray-400 hover:bg-[#F5E1DA]/20'
                }`}
              >
                <span className="font-mono text-xs">{slot.time}</span>
                <span className="text-[9px] mt-0.5 font-normal opacity-80">
                  {slot.available ? 'Libre' : 'Ocupado'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
