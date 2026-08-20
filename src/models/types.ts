export type CategoryType = 'damas' | 'caballeros' | 'ninos' | 'jovenes';

export type BookingModality = 'presencial' | 'domicilio';

export type BookingStatus = 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';

export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta' | 'sinpe' | 'nequi' | 'daviplata' | 'pse';

export interface Service {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  detailedDescription?: string;
  durationMinutes: number;
  price: number;
  image: string;
  popular?: boolean;
  tags?: string[];
  recommendedFor?: string;
  includes?: string[];
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  image: string;
  bio: string;
  availableDays: number[]; // 0 for Sun, 1 for Mon...
  workingHours: { start: string; end: string };
}

export interface LookbookItem {
  id: string;
  title: string;
  category: CategoryType;
  image: string;
  description: string;
  relatedServiceId?: string;
  tags: string[];
}

export interface SurchargeZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string;
  description: string;
}

export interface HomeAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  references: string;
  zoneId: string;
}

export interface BookingFormDraft {
  step: number;
  selectedServices: Service[];
  modality: BookingModality;
  homeAddress: HomeAddress;
  selectedZoneId: string;
  selectedStylistId: string;
  selectedDate: string;
  selectedTimeSlot: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientNotes: string;
  paymentMethod: PaymentMethod;
  selectedLookbookId?: string;
  selectedLookbookTitle?: string;
  selectedLookbookImage?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientNotes?: string;
  modality: BookingModality;
  homeAddress?: HomeAddress;
  deliveryFee: number;
  services: Service[];
  totalDuration: number;
  subtotal: number;
  total: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  stylistId: string;
  stylistName: string;
  status: BookingStatus;
  selectedLookbook?: {
    id: string;
    title: string;
    image: string;
  };
  paymentMethod: PaymentMethod;
  updatedAt?: string;
}

export interface AdminStats {
  totalBookings: number;
  todayBookingsCount: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  todayRevenue: number;
  totalRevenue: number;
}
