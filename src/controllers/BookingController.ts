import { Booking, BookingModality, HomeAddress, PaymentMethod, Service, Stylist, SurchargeZone } from '../models/types';
import { INITIAL_STYLISTS, SURCHARGE_ZONES } from '../models/initialData';
import { createBooking } from '../services/firestoreService';

export interface BookingFormDraft {
  step: number; // 1: Services, 2: Modality, 3: Stylist & Schedule, 4: Client Info, 5: Confirmation
  selectedServices: Service[];
  modality: BookingModality;
  homeAddress: HomeAddress;
  selectedZoneId: string;
  selectedStylistId: string;
  selectedDate: string; // YYYY-MM-DD
  selectedTimeSlot: string; // HH:mm
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientNotes: string;
  paymentMethod: PaymentMethod;
  selectedLookbookId?: string;
  selectedLookbookTitle?: string;
  selectedLookbookImage?: string;
}

export const INITIAL_DRAFT: BookingFormDraft = {
  step: 1,
  selectedServices: [],
  modality: 'presencial',
  homeAddress: {
    street: '',
    number: '',
    neighborhood: '',
    city: 'Distrito Central',
    references: '',
    zoneId: 'centro'
  },
  selectedZoneId: 'centro',
  selectedStylistId: 'any',
  selectedDate: getTomorrowDateString(),
  selectedTimeSlot: '10:00',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientNotes: '',
  paymentMethod: 'efectivo'
};

export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export class BookingController {

  /**
   * Calculate totals based on draft
   */
  public static calculateTotals(draft: BookingFormDraft) {
    const subtotal = draft.selectedServices.reduce((acc, s) => acc + s.price, 0);
    const totalDuration = draft.selectedServices.reduce((acc, s) => acc + s.durationMinutes, 0);
    
    let deliveryFee = 0;
    if (draft.modality === 'domicilio') {
      const zone = SURCHARGE_ZONES.find(z => z.id === draft.selectedZoneId) || SURCHARGE_ZONES[0];
      deliveryFee = zone ? zone.fee : 12000;
    }

    const total = subtotal + deliveryFee;

    return {
      subtotal,
      deliveryFee,
      total,
      totalDuration
    };
  }

  /**
   * Generates time slots between 8:30 AM and 19:30 with 30 min increments
   */
  public static getAvailableTimeSlots(dateStr: string, stylistId: string, existingBookings: Booking[]): { time: string; available: boolean; reason?: string }[] {
    const allSlots = [
      '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
      '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
    ];

    // Filter bookings on this date (excluding cancelled)
    const activeBookingsOnDate = existingBookings.filter(b => 
      b.date === dateStr && b.status !== 'cancelada'
    );

    return allSlots.map(time => {
      let isBusy = false;
      if (stylistId && stylistId !== 'any') {
        isBusy = activeBookingsOnDate.some(b => b.timeSlot === time && (b.stylistId === stylistId || b.stylistId === 'any'));
      } else {
        // If 'any', check if all stylists are occupied
        const busyStylistsForTime = activeBookingsOnDate.filter(b => b.timeSlot === time).map(b => b.stylistId);
        isBusy = busyStylistsForTime.length >= INITIAL_STYLISTS.length;
      }

      return {
        time,
        available: !isBusy,
        reason: isBusy ? 'Horario ocupado' : 'Disponible'
      };
    });
  }

  /**
   * Validate current wizard step
   */
  public static validateStep(draft: BookingFormDraft, step: number): { valid: boolean; error?: string } {
    if (step === 1) {
      if (draft.selectedServices.length === 0) {
        return { valid: false, error: 'Por favor selecciona al menos un servicio para continuar.' };
      }
    }

    if (step === 2) {
      if (draft.modality === 'domicilio') {
        if (!draft.homeAddress.street.trim()) {
          return { valid: false, error: 'El nombre de la calle o avenida es obligatorio para servicio a domicilio.' };
        }
        if (!draft.homeAddress.number.trim()) {
          return { valid: false, error: 'El número de casa, edificio o apto es obligatorio.' };
        }
        if (!draft.homeAddress.neighborhood.trim()) {
          return { valid: false, error: 'La colonia, barrio o sector es obligatorio.' };
        }
      }
    }

    if (step === 3) {
      if (!draft.selectedDate) {
        return { valid: false, error: 'Por favor selecciona una fecha válida para tu cita.' };
      }
      if (!draft.selectedTimeSlot) {
        return { valid: false, error: 'Por favor selecciona un horario disponible.' };
      }
    }

    if (step === 4) {
      if (!draft.clientName.trim() || draft.clientName.trim().length < 3) {
        return { valid: false, error: 'Por favor ingresa tu nombre y apellido completo.' };
      }
      const cleanPhone = draft.clientPhone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 7) {
        return { valid: false, error: 'Por favor ingresa un número de teléfono o WhatsApp válido.' };
      }
    }

    return { valid: true };
  }

  /**
   * Submit and persist final booking
   */
  public static async submitBooking(draft: BookingFormDraft): Promise<Booking> {
    const { subtotal, deliveryFee, total, totalDuration } = this.calculateTotals(draft);
    
    // Determine stylist name
    let stylistName = 'Cualquier estilista disponible';
    if (draft.selectedStylistId && draft.selectedStylistId !== 'any') {
      const stylist = INITIAL_STYLISTS.find(s => s.id === draft.selectedStylistId);
      if (stylist) stylistName = stylist.name;
    }

    const bookingCode = `VAL-${Math.floor(1000 + Math.random() * 9000)}`;
    const bookingId = `book_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const newBooking: Booking = {
      id: bookingId,
      bookingCode,
      createdAt: new Date().toISOString(),
      clientName: draft.clientName.trim(),
      clientPhone: draft.clientPhone.trim(),
      clientEmail: draft.clientEmail?.trim() || undefined,
      clientNotes: draft.clientNotes?.trim() || undefined,
      modality: draft.modality,
      homeAddress: draft.modality === 'domicilio' ? {
        ...draft.homeAddress,
        zoneId: draft.selectedZoneId
      } : undefined,
      deliveryFee,
      services: draft.selectedServices,
      totalDuration,
      subtotal,
      total,
      date: draft.selectedDate,
      timeSlot: draft.selectedTimeSlot,
      stylistId: draft.selectedStylistId,
      stylistName,
      status: 'pendiente',
      paymentMethod: draft.paymentMethod,
      selectedLookbook: draft.selectedLookbookId ? {
        id: draft.selectedLookbookId,
        title: draft.selectedLookbookTitle || 'Estilo de lookbook',
        image: draft.selectedLookbookImage || ''
      } : undefined
    };

    return await createBooking(newBooking);
  }
}
