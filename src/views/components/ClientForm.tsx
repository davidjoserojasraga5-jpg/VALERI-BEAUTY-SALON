import React from 'react';
import { User, Phone, Mail, MessageSquare, CreditCard, Banknote, Landmark, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '../../models/types';

interface ClientFormProps {
  clientName: string;
  onChangeName: (val: string) => void;
  clientPhone: string;
  onChangePhone: (val: string) => void;
  clientEmail: string;
  onChangeEmail: (val: string) => void;
  clientNotes: string;
  onChangeNotes: (val: string) => void;
  paymentMethod: PaymentMethod;
  onChangePaymentMethod: (method: PaymentMethod) => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  clientName,
  onChangeName,
  clientPhone,
  onChangePhone,
  clientEmail,
  onChangeEmail,
  clientNotes,
  onChangeNotes,
  paymentMethod,
  onChangePaymentMethod
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
          Datos de Contacto & Pago
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Ingresa tus datos para enviarte la confirmación oficial y notificarte el día de la cita.
        </p>
      </div>

      {/* Inputs Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
            Nombre y Apellidos completos <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Ej. Valeria Gómez Restrepo"
              value={clientName}
              onChange={(e) => onChangeName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Phone / WhatsApp */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
            Número de WhatsApp / Móvil (Colombia) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              placeholder="Ej. +57 310 845 9920 o 3108459920"
              value={clientPhone}
              onChange={(e) => onChangePhone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">
            A este número te enviaremos el recordatorio y enlace de confirmación por WhatsApp (+57).
          </span>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
            Correo Electrónico (opcional)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="valeria@ejemplo.com"
              value={clientEmail}
              onChange={(e) => onChangeEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Special Notes */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
            Comentarios especiales o requerimientos (opcional)
          </label>
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <textarea
              rows={2}
              placeholder="Indícanos si tienes alergias, tipo de cabello, largo o si es para una ocasión especial..."
              value={clientNotes}
              onChange={(e) => onChangeNotes(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
        <label className="block text-xs uppercase font-bold tracking-wider text-neutral-900">
          Forma de pago en Pesos Colombianos (COP) (se cancela al recibir el servicio):
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => onChangePaymentMethod('efectivo')}
            className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              paymentMethod === 'efectivo'
                ? 'border-[#D4AF37] bg-[#F5E1DA]/30 text-neutral-900 ring-1 ring-[#D4AF37]'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50'
            }`}
          >
            <Banknote className="w-5 h-5 text-[#A88732]" />
            <span className="font-bold text-[11px] uppercase tracking-wider">Efectivo COP</span>
          </button>

          <button
            type="button"
            onClick={() => onChangePaymentMethod('transferencia')}
            className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              paymentMethod === 'transferencia' || paymentMethod === 'pse'
                ? 'border-[#D4AF37] bg-[#F5E1DA]/30 text-neutral-900 ring-1 ring-[#D4AF37]'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50'
            }`}
          >
            <Landmark className="w-5 h-5 text-[#A88732]" />
            <span className="font-bold text-[11px] uppercase tracking-wider">Transferencia / PSE</span>
          </button>

          <button
            type="button"
            onClick={() => onChangePaymentMethod('tarjeta')}
            className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              paymentMethod === 'tarjeta'
                ? 'border-[#D4AF37] bg-[#F5E1DA]/30 text-neutral-900 ring-1 ring-[#D4AF37]'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50'
            }`}
          >
            <CreditCard className="w-5 h-5 text-[#A88732]" />
            <span className="font-bold text-[11px] uppercase tracking-wider">Datafono / Tarjeta</span>
          </button>

          <button
            type="button"
            onClick={() => onChangePaymentMethod('nequi')}
            className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              paymentMethod === 'nequi' || paymentMethod === 'daviplata' || paymentMethod === 'sinpe'
                ? 'border-[#D4AF37] bg-[#F5E1DA]/30 text-neutral-900 ring-1 ring-[#D4AF37]'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-[#A88732]" />
            <span className="font-bold text-[11px] uppercase tracking-wider">Nequi / Daviplata</span>
          </button>
        </div>
      </div>
    </div>
  );
};
