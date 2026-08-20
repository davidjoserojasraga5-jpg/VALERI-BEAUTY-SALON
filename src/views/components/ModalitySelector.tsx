import React from 'react';
import { Home, Store, MapPin, Sparkles, AlertCircle, ShieldCheck, Clock, Check } from 'lucide-react';
import { BookingModality, HomeAddress, SurchargeZone } from '../../models/types';
import { SALON_INFO, SURCHARGE_ZONES, formatCOP } from '../../models/initialData';

interface ModalitySelectorProps {
  modality: BookingModality;
  onChangeModality: (modality: BookingModality) => void;
  homeAddress: HomeAddress;
  onChangeAddress: (address: HomeAddress) => void;
  selectedZoneId: string;
  onChangeZone: (zoneId: string) => void;
}

export const ModalitySelector: React.FC<ModalitySelectorProps> = ({
  modality,
  onChangeModality,
  homeAddress,
  onChangeAddress,
  selectedZoneId,
  onChangeZone
}) => {
  const currentZone = SURCHARGE_ZONES.find(z => z.id === selectedZoneId) || SURCHARGE_ZONES[0];

  const handleFieldChange = (field: keyof HomeAddress, value: string) => {
    onChangeAddress({
      ...homeAddress,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-serif font-bold text-neutral-900 uppercase tracking-wide">
          Modalidad de Atención
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Elige entre la experiencia en nuestro salón boutique o recibir a nuestros profesionales en la comodidad de tu hogar.
        </p>
      </div>

      {/* Main Choice Cards: Presencial vs Domicilio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Presencial Option */}
        <div
          onClick={() => onChangeModality('presencial')}
          className={`cursor-pointer rounded-xl p-5 border transition-all duration-200 relative ${
            modality === 'presencial'
              ? 'border-[#D4AF37] bg-[#F5E1DA]/10 ring-1 ring-[#D4AF37] shadow-sm'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-full bg-black text-[#D4AF37] flex items-center justify-center mb-3">
              <Store className="w-5 h-5" />
            </div>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              modality === 'presencial' ? 'border-4 border-black bg-white' : 'border border-gray-300'
            }`} />
          </div>

          <h4 className="font-bold text-sm uppercase tracking-wide text-neutral-900">
            Atención en Salón Valeri
          </h4>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88732] block my-1">
            Sin recargo de traslado ($ 0 COP)
          </span>

          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Disfruta de nuestras instalaciones boutique con ambientación relajante, café de cortesía, WiFi y estacionamiento privado.
          </p>

          <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="truncate">{SALON_INFO.address}</span>
          </div>
        </div>

        {/* Domicilio Option */}
        <div
          onClick={() => onChangeModality('domicilio')}
          className={`cursor-pointer rounded-xl p-5 border transition-all duration-200 relative ${
            modality === 'domicilio'
              ? 'border-[#D4AF37] bg-[#F5E1DA]/10 ring-1 ring-[#D4AF37] shadow-sm'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-full bg-black text-[#D4AF37] flex items-center justify-center mb-3">
              <Home className="w-5 h-5" />
            </div>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              modality === 'domicilio' ? 'border-4 border-black bg-white' : 'border border-gray-300'
            }`} />
          </div>

          <h4 className="font-bold text-sm uppercase tracking-wide text-neutral-900">
            Servicio a Domicilio VIP
          </h4>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A88732] block my-1">
            Recargo según zona (desde {formatCOP(SURCHARGE_ZONES[0].fee)})
          </span>

          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            Llevamos el kit esterilizado, herramientas profesionales, iluminación y productos de gama alta hasta tu casa u oficina.
          </p>

          <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>Puntualidad, higiene y máxima comodidad</span>
          </div>
        </div>
      </div>

      {/* If Domicilio is selected: Mandatory Address & Zone Selector */}
      {modality === 'domicilio' && (
        <div className="p-6 bg-white rounded-xl border border-[#D4AF37]/30 space-y-5 animate-in fade-in-50 duration-300">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A88732] border-b border-gray-100 pb-3">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            Datos de Ubicación para el Traslado
          </div>

          {/* Zone Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              Selecciona tu Zona / Sector:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SURCHARGE_ZONES.map((zone) => {
                const isZoneSelected = selectedZoneId === zone.id;
                return (
                  <div
                    key={zone.id}
                    onClick={() => onChangeZone(zone.id)}
                    className={`cursor-pointer p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      isZoneSelected
                        ? 'border-[#D4AF37] bg-[#F5E1DA]/30 ring-1 ring-[#D4AF37]'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-neutral-900 block">{zone.name}</span>
                      <span className="text-[11px] text-gray-500">Aprox. {zone.estimatedTime} de traslado</span>
                    </div>
                    <span className="font-bold text-xs text-[#D4AF37] bg-black px-2.5 py-1 rounded-sm shadow-2xs">
                      +{formatCOP(zone.fee)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complete Address Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            {/* Street */}
            <div className="sm:col-span-8">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                Calle, Avenida o Boulevard <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Av. Primavera o Calle Los Cedros"
                value={homeAddress.street}
                onChange={(e) => handleFieldChange('street', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            {/* Number */}
            <div className="sm:col-span-4">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                Número / Casa / Depto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej. #452 Apto 3B"
                value={homeAddress.number}
                onChange={(e) => handleFieldChange('number', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            {/* Neighborhood */}
            <div className="sm:col-span-6">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                Colonia, Residencial o Barrio <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Residencial Las Acacias"
                value={homeAddress.neighborhood}
                onChange={(e) => handleFieldChange('neighborhood', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            {/* City */}
            <div className="sm:col-span-6">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                Ciudad / Municipio
              </label>
              <input
                type="text"
                value={homeAddress.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            {/* References */}
            <div className="sm:col-span-12">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 mb-1">
                Puntos de referencia para el estilista (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Portón negro frente al parque, timbre 2..."
                value={homeAddress.references}
                onChange={(e) => handleFieldChange('references', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Delivery fee info alert */}
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-[#F5E1DA] border border-[#D4AF37]/30 text-xs text-[#A88732]">
            <Clock className="w-4 h-4 shrink-0 text-[#A88732]" />
            <div>
              Recargo calculado por traslado: <strong className="font-bold text-black">{formatCOP(currentZone.fee)}</strong>. Incluye traslado puntual y kit de bioseguridad.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
