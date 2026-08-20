import React from 'react';
import { X, Clock, CheckCircle2, Sparkles, Tag, Plus, Check } from 'lucide-react';
import { Service } from '../../models/types';
import { formatCOP } from '../../models/initialData';

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  isSelected: boolean;
  onToggleSelect: (service: Service) => void;
  onBookNow: (service: Service) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  isSelected,
  onToggleSelect,
  onBookNow
}) => {
  if (!isOpen || !service) return null;

  const categoryLabels: Record<string, string> = {
    damas: 'Damas',
    caballeros: 'Caballeros',
    ninos: 'Niños & Niñas',
    jovenes: 'Jóvenes & Tendencias'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-56 sm:h-64 w-full shrink-0">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm bg-[#D4AF37] text-black mb-1.5 shadow-xs">
              {categoryLabels[service.category] || service.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight uppercase tracking-wide">
              {service.name}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Key specs */}
          <div className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2 text-xs text-neutral-700">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>Duración estimada: <strong className="font-bold">{service.durationMinutes} min</strong></span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Precio estimado</span>
              <span className="text-xl font-bold text-[#D4AF37]">
                {formatCOP(service.price)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Descripción del Tratamiento
            </h4>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {service.detailedDescription || service.description}
            </p>
          </div>

          {/* Includes List */}
          {service.includes && service.includes.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                ¿Qué incluye este servicio?
              </h4>
              <ul className="space-y-2">
                {service.includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                    <CheckCircle2 className="w-4 h-4 text-[#A88732] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {service.tags && service.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {service.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm bg-[#F5E1DA] text-neutral-900 border border-[#D4AF37]/30"
                >
                  <Tag className="w-3 h-3 text-[#A88732]" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={() => onToggleSelect(service)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
              isSelected 
                ? 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300' 
                : 'bg-white border border-gray-300 text-neutral-800 hover:bg-gray-100 shadow-xs'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Seleccionado</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Añadir a mi Cita</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onBookNow(service);
              onClose();
            }}
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:brightness-110 text-black px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Agendar Ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
