/**
 * Salón de Belleza Valeri - Asistente y Sistema de Reservas
 * Architecture: Model-View-Controller (MVC) + Firebase Firestore Integration
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './views/components/Navbar';
import { HeroBanner } from './views/components/HeroBanner';
import { ServiceCatalogView } from './views/components/ServiceCatalogView';
import { BookingWizardView } from './views/components/BookingWizardView';
import { AppointmentLookupView } from './views/components/AppointmentLookupView';
import { StylistsShowcase } from './views/components/StylistsShowcase';
import { AdminDashboardView } from './views/components/AdminDashboardView';
import { SalonInfoFooter } from './views/components/SalonInfoFooter';
import { Booking, BookingFormDraft, CategoryType, LookbookItem, Service } from './models/types';
import { INITIAL_DRAFT } from './controllers/BookingController';
import { AdminController } from './controllers/AdminController';
import { subscribeToBookings, getLocalBookings } from './services/firestoreService';
import { INITIAL_SERVICES } from './models/initialData';

export default function App() {
  // Navigation View State
  const [activeView, setActiveView] = useState<'home' | 'catalog' | 'booking' | 'lookup' | 'stylists' | 'admin'>('home');
  
  // Booking Draft State
  const [bookingDraft, setBookingDraft] = useState<BookingFormDraft>(INITIAL_DRAFT);
  
  // Realtime Bookings from Firestore
  const [bookings, setBookings] = useState<Booking[]>(getLocalBookings());
  
  // Admin Login Session
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(AdminController.isAuthenticated());
  
  // Filter for Catalog
  const [catalogCategory, setCatalogCategory] = useState<CategoryType>('damas');

  // Attach Firestore Snapshot Listener
  useEffect(() => {
    const unsubscribe = subscribeToBookings((latestBookings) => {
      setBookings(latestBookings);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Handle adding / removing a service from the booking draft
  const handleToggleSelectService = (service: Service) => {
    setBookingDraft(prev => {
      const exists = prev.selectedServices.some(s => s.id === service.id);
      if (exists) {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(s => s.id !== service.id)
        };
      } else {
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, service]
        };
      }
    });
  };

  // Start booking directly or from a specific service/modality
  const handleStartBooking = (modality?: 'presencial' | 'domicilio') => {
    if (modality) {
      setBookingDraft(prev => ({ ...prev, modality }));
    }
    // If no services selected, pre-select the popular signature service to assist the user
    if (bookingDraft.selectedServices.length === 0) {
      setBookingDraft(prev => ({ ...prev, selectedServices: [INITIAL_SERVICES[0]] }));
    }
    setActiveView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedFromCatalog = (service?: Service) => {
    if (service && !bookingDraft.selectedServices.some(s => s.id === service.id)) {
      setBookingDraft(prev => ({
        ...prev,
        selectedServices: [...prev.selectedServices, service],
        step: 2
      }));
    } else {
      setBookingDraft(prev => ({ ...prev, step: 2 }));
    }
    setActiveView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreCatalog = (category?: string) => {
    if (category && (category === 'damas' || category === 'caballeros' || category === 'ninos' || category === 'jovenes')) {
      setCatalogCategory(category as CategoryType);
    }
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStylistForBooking = (stylistId: string) => {
    setBookingDraft(prev => ({
      ...prev,
      selectedStylistId: stylistId,
      step: 1
    }));
    setActiveView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLookbook = (look: LookbookItem) => {
    if (look.id) {
      setBookingDraft(prev => ({
        ...prev,
        selectedLookbookId: look.id,
        selectedLookbookTitle: look.title,
        selectedLookbookImage: look.image
      }));
    } else {
      setBookingDraft(prev => ({
        ...prev,
        selectedLookbookId: undefined,
        selectedLookbookTitle: undefined,
        selectedLookbookImage: undefined
      }));
    }
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    // Reset draft
    setBookingDraft({
      ...INITIAL_DRAFT,
      selectedServices: []
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A]">
      {/* Navigation Top Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedServicesCount={bookingDraft.selectedServices.length}
        onOpenBooking={() => handleStartBooking()}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Router */}
      <main className="grow">
        {/* VIEW 1: Home Screen */}
        {activeView === 'home' && (
          <div className="space-y-12">
            <HeroBanner
              onStartBooking={handleStartBooking}
              onExploreCatalog={handleExploreCatalog}
              onOpenLookup={() => setActiveView('lookup')}
            />

            {/* Featured Services Catalog Section */}
            <div className="border-t border-neutral-200/80">
              <ServiceCatalogView
                selectedServices={bookingDraft.selectedServices}
                onToggleSelectService={handleToggleSelectService}
                onProceedToBooking={handleProceedFromCatalog}
                initialCategory={catalogCategory}
                selectedLookbook={
                  bookingDraft.selectedLookbookId
                    ? {
                        id: bookingDraft.selectedLookbookId,
                        title: bookingDraft.selectedLookbookTitle || '',
                        image: bookingDraft.selectedLookbookImage || ''
                      }
                    : undefined
                }
                onSelectLookbook={handleSelectLookbook}
              />
            </div>

            {/* Stylists Showcase */}
            <div className="bg-white border-y border-neutral-200/80">
              <StylistsShowcase onSelectStylistForBooking={handleSelectStylistForBooking} />
            </div>
          </div>
        )}

        {/* VIEW 2: Full Catalog View */}
        {activeView === 'catalog' && (
          <ServiceCatalogView
            selectedServices={bookingDraft.selectedServices}
            onToggleSelectService={handleToggleSelectService}
            onProceedToBooking={handleProceedFromCatalog}
            initialCategory={catalogCategory}
            selectedLookbook={
              bookingDraft.selectedLookbookId
                ? {
                    id: bookingDraft.selectedLookbookId,
                    title: bookingDraft.selectedLookbookTitle || '',
                    image: bookingDraft.selectedLookbookImage || ''
                  }
                : undefined
            }
            onSelectLookbook={handleSelectLookbook}
          />
        )}

        {/* VIEW 3: Guided Booking Wizard */}
        {activeView === 'booking' && (
          <BookingWizardView
            draft={bookingDraft}
            setDraft={setBookingDraft}
            onOpenCatalog={() => setActiveView('catalog')}
            existingBookings={bookings}
            onBookingSuccess={handleBookingSuccess}
            onCancel={() => setActiveView('home')}
            onOpenLookup={() => setActiveView('lookup')}
          />
        )}

        {/* VIEW 4: Appointment Lookup / Status Tracker */}
        {activeView === 'lookup' && (
          <AppointmentLookupView onStartBooking={() => handleStartBooking()} />
        )}

        {/* VIEW 5: Stylists Showcase Page */}
        {activeView === 'stylists' && (
          <StylistsShowcase onSelectStylistForBooking={handleSelectStylistForBooking} />
        )}

        {/* VIEW 6: Authenticated Admin Dashboard */}
        {activeView === 'admin' && (
          <AdminDashboardView
            bookings={bookings}
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
          />
        )}
      </main>

      {/* Footer */}
      <SalonInfoFooter
        onOpenBooking={() => handleStartBooking()}
        onOpenAdmin={() => {
          setActiveView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExploreCatalog={() => handleExploreCatalog()}
      />
    </div>
  );
}
