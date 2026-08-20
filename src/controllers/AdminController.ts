import { AdminStats, Booking, BookingStatus } from '../models/types';
import { getTodayDateString } from './BookingController';

export const ADMIN_STORAGE_AUTH_KEY = 'valeri_salon_admin_auth';
export const DEFAULT_ADMIN_PIN = '1234';

export class AdminController {

  public static isAuthenticated(): boolean {
    return localStorage.getItem(ADMIN_STORAGE_AUTH_KEY) === 'true';
  }

  public static login(pinOrPassword: string): boolean {
    if (pinOrPassword.trim() === DEFAULT_ADMIN_PIN || pinOrPassword.trim().toLowerCase() === 'valeri2026') {
      localStorage.setItem(ADMIN_STORAGE_AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  public static logout(): void {
    localStorage.removeItem(ADMIN_STORAGE_AUTH_KEY);
  }

  /**
   * Compute comprehensive dashboard statistics from list of bookings
   */
  public static calculateStats(bookings: Booking[]): AdminStats {
    const today = getTodayDateString();

    const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelada');
    const pendingBookings = bookings.filter(b => b.status === 'pendiente');
    const confirmedBookings = bookings.filter(b => b.status === 'confirmada');
    const completedBookings = bookings.filter(b => b.status === 'completada');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelada');

    const todayRevenue = todayBookings.reduce((acc, b) => acc + b.total, 0);
    const totalRevenue = completedBookings.reduce((acc, b) => acc + b.total, 0);

    return {
      totalBookings: bookings.length,
      todayBookingsCount: todayBookings.length,
      pendingBookings: pendingBookings.length,
      confirmedBookings: confirmedBookings.length,
      completedBookings: completedBookings.length,
      cancelledBookings: cancelledBookings.length,
      todayRevenue,
      totalRevenue
    };
  }

  /**
   * Filter and sort bookings for admin table / agenda
   */
  public static filterBookings(
    bookings: Booking[],
    options: {
      filterDate?: 'all' | 'today' | 'tomorrow' | 'upcoming';
      status?: BookingStatus | 'all';
      stylistId?: string;
      modality?: 'all' | 'presencial' | 'domicilio';
      searchTerm?: string;
    }
  ): Booking[] {
    const today = getTodayDateString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    return bookings.filter(b => {
      // Date filter
      if (options.filterDate === 'today' && b.date !== today) return false;
      if (options.filterDate === 'tomorrow' && b.date !== tomorrowStr) return false;
      if (options.filterDate === 'upcoming' && b.date < today) return false;

      // Status filter
      if (options.status && options.status !== 'all' && b.status !== options.status) return false;

      // Stylist filter
      if (options.stylistId && options.stylistId !== 'all' && b.stylistId !== options.stylistId) return false;

      // Modality filter
      if (options.modality && options.modality !== 'all' && b.modality !== options.modality) return false;

      // Search term
      if (options.searchTerm) {
        const query = options.searchTerm.toLowerCase().trim();
        const matches = 
          b.clientName.toLowerCase().includes(query) ||
          b.bookingCode.toLowerCase().includes(query) ||
          b.clientPhone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
          b.services.some(s => s.name.toLowerCase().includes(query));
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by date ascending, then time slot
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.timeSlot.localeCompare(b.timeSlot);
    });
  }
}
