import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { Booking, BookingStatus, Service, Stylist } from '../models/types';
import { INITIAL_SAMPLE_BOOKINGS, INITIAL_SERVICES, INITIAL_STYLISTS } from '../models/initialData';

const BOOKINGS_COLLECTION = 'bookings';
const LOCAL_STORAGE_BOOKINGS_KEY = 'valeri_salon_bookings_cache';

// Helper to get local bookings
export function getLocalBookings(): Booking[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading localStorage bookings', e);
  }
  return INITIAL_SAMPLE_BOOKINGS as Booking[];
}

// Helper to save local bookings
export function saveLocalBookings(bookings: Booking[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Error saving localStorage bookings', e);
  }
}

/**
 * Save new booking to Firestore & Cache
 */
export async function createBooking(booking: Booking): Promise<Booking> {
  // Update local cache first for instant optimistic response
  const current = getLocalBookings();
  const updated = [booking, ...current.filter(b => b.id !== booking.id)];
  saveLocalBookings(updated);

  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, booking.id);
    await setDoc(docRef, {
      ...booking,
      createdAt: booking.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore write failed, saved locally:', error);
  }

  return booking;
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId: string, newStatus: BookingStatus): Promise<void> {
  // Update local cache
  const current = getLocalBookings();
  const updated = current.map(b => b.id === bookingId ? { ...b, status: newStatus, updatedAt: new Date().toISOString() } : b);
  saveLocalBookings(updated);

  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore status update fallback to local:', error);
  }
}

/**
 * Update whole booking
 */
export async function updateBooking(booking: Booking): Promise<void> {
  const current = getLocalBookings();
  const updated = current.map(b => b.id === booking.id ? { ...booking, updatedAt: new Date().toISOString() } : b);
  saveLocalBookings(updated);

  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, booking.id);
    await setDoc(docRef, {
      ...booking,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore update fallback to local:', error);
  }
}

/**
 * Delete booking
 */
export async function deleteBooking(bookingId: string): Promise<void> {
  const current = getLocalBookings();
  const updated = current.filter(b => b.id !== bookingId);
  saveLocalBookings(updated);

  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore delete fallback to local:', error);
  }
}

/**
 * Listen to bookings in real-time
 */
export function subscribeToBookings(callback: (bookings: Booking[]) => void): () => void {
  try {
    const q = query(collection(db, BOOKINGS_COLLECTION), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const remoteBookings = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Booking[];
        saveLocalBookings(remoteBookings);
        callback(remoteBookings);
      } else {
        // If firestore is empty, seed with initial sample bookings
        const local = getLocalBookings();
        callback(local);
      }
    }, (error) => {
      console.warn('Snapshot listener error, using local data:', error);
      callback(getLocalBookings());
    });

    return unsubscribe;
  } catch (e) {
    console.warn('Failed to attach Firestore snapshot listener:', e);
    callback(getLocalBookings());
    return () => {};
  }
}

/**
 * Search bookings by Code or Phone
 */
export async function searchBooking(queryStr: string): Promise<Booking[]> {
  const clean = queryStr.trim().toLowerCase();
  if (!clean) return [];

  const local = getLocalBookings();
  return local.filter(b => 
    b.bookingCode.toLowerCase().includes(clean) ||
    b.clientPhone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')) ||
    b.clientName.toLowerCase().includes(clean)
  );
}
