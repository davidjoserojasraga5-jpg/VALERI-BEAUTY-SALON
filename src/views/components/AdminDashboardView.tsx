import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Calendar, Clock, DollarSign, UserCheck, 
  AlertCircle, CheckCircle2, Search, Filter, Phone, MessageSquare, 
  MapPin, Home, Scissors, Trash2, Plus, Sparkles, RefreshCw, Eye
} from 'lucide-react';
import { Booking, BookingStatus, Service, Stylist } from '../../models/types';
import { AdminController, DEFAULT_ADMIN_PIN } from '../../controllers/AdminController';
import { updateBookingStatus, deleteBooking, createBooking } from '../../services/firestoreService';
import { WhatsAppController } from '../../controllers/WhatsAppController';
import { INITIAL_SERVICES, INITIAL_STYLISTS, SALON_INFO, SURCHARGE_ZONES, formatCOP } from '../../models/initialData';
import { getTodayDateString, getTomorrowDateString } from '../../controllers/BookingController';

interface AdminDashboardViewProps {
  bookings: Booking[];
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  bookings,
  isAdminLoggedIn,
  setIsAdminLoggedIn
}) => {
  // Login State
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Tab & Filters
  const [activeTab, setActiveTab] = useState<'agenda' | 'all' | 'new_booking'>('agenda');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'upcoming'>('today');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [modalityFilter, setModalityFilter] = useState<'all' | 'presencial' | 'domicilio'>('all');
  const [stylistFilter, setStylistFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Quick New Booking Modal State (Walk-in)
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newServiceId, setNewServiceId] = useState(INITIAL_SERVICES[0].id);
  const [newDate, setNewDate] = useState(getTodayDateString());
  const [newTime, setNewTime] = useState('11:00');
  const [newStylistId, setNewStylistId] = useState(INITIAL_STYLISTS[0].id);
  const [newModality, setNewModality] = useState<'presencial' | 'domicilio'>('presencial');
  const [isCreatingWalkIn, setIsCreatingWalkIn] = useState(false);

  // Selected Booking Detail Modal
  const [inspectBooking, setInspectBooking] = useState<Booking | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (AdminController.login(pinInput)) {
      setIsAdminLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    AdminController.logout();
    setIsAdminLoggedIn(false);
  };

  const stats = useMemo(() => {
    return AdminController.calculateStats(bookings);
  }, [bookings]);

  const filteredList = useMemo(() => {
    return AdminController.filterBookings(bookings, {
      filterDate: dateFilter,
      status: statusFilter,
      modality: modalityFilter,
      stylistId: stylistFilter,
      searchTerm: searchTerm
    });
  }, [bookings, dateFilter, statusFilter, modalityFilter, stylistFilter, searchTerm]);

  // Handle Status Update
  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Delete
  const handleDelete = async (bookingId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta reserva permanentemente?')) {
      await deleteBooking(bookingId);
      if (inspectBooking?.id === bookingId) {
        setInspectBooking(null);
      }
    }
  };

  // Handle Create Quick Walk-in Appointment
  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientPhone.trim()) return;

    setIsCreatingWalkIn(true);
    try {
      const srv = INITIAL_SERVICES.find(s => s.id === newServiceId) || INITIAL_SERVICES[0];
      const stylist = INITIAL_STYLISTS.find(s => s.id === newStylistId) || INITIAL_STYLISTS[0];
      const bookingCode = `VAL-${Math.floor(1000 + Math.random() * 9000)}`;

      const booking: Booking = {
        id: `admin_book_${Date.now()}`,
        bookingCode,
        createdAt: new Date().toISOString(),
        clientName: newClientName.trim(),
        clientPhone: newClientPhone.trim(),
        modality: newModality,
        deliveryFee: newModality === 'domicilio' ? 12000 : 0,
        services: [srv],
        totalDuration: srv.durationMinutes,
        subtotal: srv.price,
        total: srv.price + (newModality === 'domicilio' ? 12000 : 0),
        date: newDate,
        timeSlot: newTime,
        stylistId: stylist.id,
        stylistName: stylist.name,
        status: 'confirmada',
        paymentMethod: 'efectivo'
      };

      await createBooking(booking);
      setNewClientName('');
      setNewClientPhone('');
      setActiveTab('agenda');
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingWalkIn(false);
    }
  };

  // If not logged in, render PIN login
  if (!isAdminLoggedIn) {
    return (
      <div className="py-16 px-4 max-w-md mx-auto animate-in fade-in duration-300">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-lg bg-black text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
              Panel Administrativo
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Acceso exclusivo para recepcionistas, estilistas y administración de Salón Valeri.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 text-left mb-1.5 uppercase tracking-wider">
                Ingresa tu PIN o Contraseña
              </label>
              <input
                type="password"
                placeholder="PIN (por defecto: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-bold py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-600 font-medium">
                PIN incorrecto. Intenta con <strong className="font-bold">1234</strong> o <strong>valeri2026</strong>.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#D4AF37] hover:brightness-110 text-black py-3 rounded-sm font-bold text-xs uppercase tracking-widest shadow-md transition-all"
            >
              Ingresar al Sistema
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400">
            PIN de prueba rápido: <span className="font-mono font-bold text-neutral-900">1234</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Top Header */}
      <div className="bg-black text-white p-6 sm:p-8 rounded-xl border border-[#D4AF37]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            Panel de Gestión en Tiempo Real
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white uppercase tracking-wide">
            Agenda & Control de Citas Valeri
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Persistencia sincronizada con Firebase Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('new_booking')}
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:brightness-110 text-black px-4 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Cita Manual</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-neutral-200 px-3.5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Citas de Hoy
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-neutral-900">{stats.todayBookingsCount}</span>
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <span className="text-[10px] text-gray-500 font-medium block">
            {getTodayDateString()}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Ingresos Estimados Hoy
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-bold text-[#D4AF37]">{formatCOP(stats.todayRevenue)}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-emerald-600 font-medium block">
            En agenda hoy (COP)
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Por Confirmar
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">{stats.pendingBookings}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[10px] text-gray-500 font-medium block">
            Requieren atención
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Confirmadas
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">{stats.confirmedBookings}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] text-gray-500 font-medium block">
            En agenda firme
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
            Total Histórico
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-neutral-900">{stats.totalBookings}</span>
            <Scissors className="w-4 h-4 text-[#A88732]" />
          </div>
          <span className="text-[10px] text-gray-500 font-medium block">
            Citas registradas
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('agenda')}
          className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'agenda'
              ? 'bg-black text-[#D4AF37] shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Agenda del Día
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'all'
              ? 'bg-black text-[#D4AF37] shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Todas las Reservas ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('new_booking')}
          className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'new_booking'
              ? 'bg-black text-[#D4AF37] shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          + Cita Manual
        </button>
      </div>

      {/* TAB 1 & 2: Agenda / All Bookings Table with Filters */}
      {(activeTab === 'agenda' || activeTab === 'all') && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente, código, teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">Fecha:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-neutral-800 text-xs"
              >
                <option value="today">Solo Hoy ({getTodayDateString()})</option>
                <option value="tomorrow">Mañana ({getTomorrowDateString()})</option>
                <option value="upcoming">Próximas</option>
                <option value="all">Todas las fechas</option>
              </select>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">Estado:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-neutral-800 text-xs"
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            {/* Modality filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-wider">Modalidad:</span>
              <select
                value={modalityFilter}
                onChange={(e) => setModalityFilter(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-neutral-800 text-xs"
              >
                <option value="all">Todas</option>
                <option value="presencial">En Salón</option>
                <option value="domicilio">A Domicilio VIP</option>
              </select>
            </div>
          </div>

          {/* Bookings List / Table */}
          {filteredList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-8 space-y-2">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                No hay citas que coincidan con los filtros seleccionados
              </p>
              <p className="text-xs text-gray-400">
                Prueba cambiando la fecha o el estado seleccionado.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden divide-y divide-gray-100">
              {filteredList.map((booking) => {
                const isDomicilio = booking.modality === 'domicilio';
                const waConfirmUrl = WhatsAppController.getAdminToClientUrl(booking, 'confirm');
                const waOnWayUrl = WhatsAppController.getAdminToClientUrl(booking, 'on_way');
                const waReminderUrl = WhatsAppController.getAdminToClientUrl(booking, 'reminder');

                return (
                  <div key={booking.id} className="p-4 sm:p-5 hover:bg-gray-50/70 transition-colors space-y-3">
                    
                    {/* Top Row: Time, Code, Client, Status Selector, Actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      
                      {/* Left Block: Time Slot, Code & Client */}
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="p-2.5 rounded-sm bg-black text-[#D4AF37] text-center min-w-[65px] shrink-0 font-bold">
                          <span className="font-mono text-sm block leading-none">
                            {booking.timeSlot}
                          </span>
                          <span className="text-[8px] uppercase tracking-widest text-neutral-400 block mt-1">
                            {booking.date.slice(5)}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-neutral-900 bg-gray-100 px-2 py-0.5 rounded-sm">
                              #{booking.bookingCode}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-neutral-900 uppercase">
                              {booking.clientName}
                            </span>
                            {isDomicilio ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5E1DA] text-neutral-900">
                                <Home className="w-3 h-3 text-[#A88732]" /> Domicilio
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-neutral-700">
                                <MapPin className="w-3 h-3 text-[#D4AF37]" /> En Salón
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {booking.clientPhone}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Scissors className="w-3 h-3 text-[#D4AF37]" /> {booking.stylistName}
                            </span>
                            <span>•</span>
                            <span className="font-bold text-neutral-900">
                              Total: {formatCOP(booking.total, true)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Block: Status Dropdown & WhatsApp Direct Links */}
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {/* Status selector */}
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                          className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-sm border transition-colors ${
                            booking.status === 'confirmada'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : booking.status === 'en_proceso'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : booking.status === 'completada'
                              ? 'bg-[#F5E1DA] text-neutral-900 border-[#D4AF37]'
                              : booking.status === 'cancelada'
                              ? 'bg-red-50 text-red-800 border-red-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="en_proceso">En Proceso</option>
                          <option value="completada">Completada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>

                        {/* WhatsApp Menu */}
                        <div className="flex items-center gap-1">
                          <a
                            href={waConfirmUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-sm bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1"
                            title="Enviar confirmación oficial por WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Confirmar</span>
                          </a>

                          {isDomicilio && (
                            <a
                              href={waOnWayUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-sm bg-[#F5E1DA] text-neutral-900 hover:bg-[#ebd2c9] text-[10px] uppercase tracking-wider font-bold flex items-center gap-1"
                              title="Avisar que el estilista va en camino"
                            >
                              <Home className="w-3.5 h-3.5 text-[#A88732]" />
                              <span className="hidden sm:inline">En Camino</span>
                            </a>
                          )}

                          <button
                            onClick={() => setInspectBooking(booking)}
                            className="p-2 rounded-sm bg-gray-100 text-neutral-700 hover:bg-gray-200"
                            title="Ver detalles completos"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="p-2 rounded-sm text-gray-400 hover:text-red-600 hover:bg-red-50"
                            title="Eliminar reserva"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Services list summary inside card */}
                    <div className="pl-0 sm:pl-16 text-xs text-gray-600 flex flex-wrap gap-2">
                      {booking.services.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-sm bg-gray-100 border border-gray-200 text-[11px]">
                          {s.name} ({formatCOP(s.price)})
                        </span>
                      ))}
                      {booking.clientNotes && (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm text-[11px] italic">
                          Nota: {booking.clientNotes}
                        </span>
                      )}
                    </div>

                    {/* If Home Service: Display destination address */}
                    {isDomicilio && booking.homeAddress && (
                      <div className="pl-0 sm:pl-16 text-xs text-[#A88732] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {booking.homeAddress.street} #{booking.homeAddress.number}, {booking.homeAddress.neighborhood}, {booking.homeAddress.city} {booking.homeAddress.references ? `(${booking.homeAddress.references})` : ''}
                        </span>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Walk-in Quick Appointment Form */}
      {activeTab === 'new_booking' && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
              Registrar Cita Manual (Recepción / Walk-In)
            </h3>
            <p className="text-xs text-gray-500">
              Agenda una cita para un cliente presencial o por llamada telefónica directa.
            </p>
          </div>

          <form onSubmit={handleCreateWalkIn} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                Nombre del Cliente <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nombre completo"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                Teléfono / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Número de contacto"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                  Servicio Principal
                </label>
                <select
                  value={newServiceId}
                  onChange={(e) => setNewServiceId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                >
                  {INITIAL_SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({formatCOP(s.price)} - {s.durationMinutes} min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                  Estilista Asignado
                </label>
                <select
                  value={newStylistId}
                  onChange={(e) => setNewStylistId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                >
                  {INITIAL_STYLISTS.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role.split('&')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                  Modalidad
                </label>
                <select
                  value={newModality}
                  onChange={(e) => setNewModality(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <option value="presencial">En Salón</option>
                  <option value="domicilio">A Domicilio</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('agenda')}
                className="px-4 py-2 border border-gray-200 rounded-sm text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreatingWalkIn}
                className="px-6 py-2 bg-black text-[#D4AF37] hover:bg-neutral-800 rounded-sm text-xs font-bold uppercase tracking-wider shadow-xs disabled:opacity-50"
              >
                {isCreatingWalkIn ? 'Guardando...' : 'Crear y Confirmar Cita'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inspect Booking Detail Modal */}
      {inspectBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#A88732] block">
                  DETALLE DE RESERVA #{inspectBooking.bookingCode}
                </span>
                <h3 className="font-serif font-bold text-xl text-neutral-900 uppercase tracking-wide">
                  {inspectBooking.clientName}
                </h3>
              </div>
              <button
                onClick={() => setInspectBooking(null)}
                className="text-gray-400 hover:text-neutral-700 text-sm font-bold p-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg space-y-1 border border-gray-100">
                <div><strong>Teléfono:</strong> {inspectBooking.clientPhone}</div>
                {inspectBooking.clientEmail && <div><strong>Email:</strong> {inspectBooking.clientEmail}</div>}
                <div><strong>Fecha y Hora:</strong> {inspectBooking.date} a las {inspectBooking.timeSlot} hrs</div>
                <div><strong>Estilista:</strong> {inspectBooking.stylistName}</div>
                <div><strong>Modalidad:</strong> {inspectBooking.modality === 'domicilio' ? 'A Domicilio VIP' : 'En Salón'}</div>
                {inspectBooking.homeAddress && (
                  <div><strong>Dirección:</strong> {inspectBooking.homeAddress.street} #{inspectBooking.homeAddress.number}, {inspectBooking.homeAddress.neighborhood}, {inspectBooking.homeAddress.city} ({inspectBooking.homeAddress.references})</div>
                )}
                {inspectBooking.clientNotes && <div><strong>Notas:</strong> {inspectBooking.clientNotes}</div>}
                <div><strong>Total:</strong> {formatCOP(inspectBooking.total, true)} ({inspectBooking.paymentMethod})</div>
              </div>

              <div>
                <strong className="block mb-1 text-[10px] uppercase font-bold tracking-wider text-gray-500">Servicios solicitados:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-neutral-700">
                  {inspectBooking.services.map((s, i) => (
                    <li key={i}>{s.name} - {formatCOP(s.price)} ({s.durationMinutes} min)</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                onClick={() => setInspectBooking(null)}
                className="px-4 py-2 bg-black text-[#D4AF37] rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
