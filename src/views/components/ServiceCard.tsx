import React from 'react';
import { Clock, Plus, Check, Eye, Sparkles } from 'lucide-react';
import { Service } from '../../models/types';
import { formatCOP } from '../../models/initialData';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggleSelect: (service: Service) => void;
  onViewDetails: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected,
  onToggleSelect,
  onViewDetails
}) => {
  return (
    <div 
      className={`group relative bg-white rounded-xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
        isSelected
          ? 'border-[#D4AF37] bg-[#F5E1DA]/10 ring-1 ring-[#D4AF37] shadow-md'
          : 'border-[#F5E1DA] hover:border-[#D4AF37] shadow-xs'
      }`}
    >
      {/* Selected Ribbon Badge */}
      {isSelected && (
        <div className="absolute top-2.5 right-2.5 z-20 bg-[#D4AF37] text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
          Seleccionado
        </div>
      )}

      <div>
        {/* Card Image */}
        <div className="relative h-44 w-full overflow-hidden bg-gray-100">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {service.popular && (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-black text-[#D4AF37] px-2 py-0.5 rounded-sm shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                Top
              </span>
            )}
          </div>

          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 text-[10px] font-medium bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-sm">
            <Clock className="w-3 h-3 text-[#D4AF37]" />
            {service.durationMinutes} min
          </span>

          {/* Quick View Button on Image */}
          <button
            onClick={() => onViewDetails(service)}
            className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-neutral-900 hover:bg-white hover:scale-110 transition-all shadow-xs backdrop-blur-xs cursor-pointer"
            title="Ver detalles completos"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          <h4 
            onClick={() => onViewDetails(service)}
            className="text-sm sm:text-base font-bold uppercase tracking-wide text-neutral-900 line-clamp-1 group-hover:text-[#A88732] cursor-pointer transition-colors"
          >
            {service.name}
          </h4>

          <p className="mt-1 text-[10px] sm:text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Tags */}
          {service.tags && service.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {service.tags.slice(0, 2).map((tag, idx) => (
                <span 
                  key={idx} 
                  className="text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#F5E1DA]/40 border border-[#F5E1DA] text-neutral-600 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Action */}
      <div className="p-4 sm:p-5 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 block font-semibold">Precio (COP)</span>
          <span className="text-base sm:text-lg font-bold text-[#D4AF37]">
            {formatCOP(service.price)}
          </span>
        </div>

        <button
          onClick={() => onToggleSelect(service)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            isSelected
              ? 'bg-[#D4AF37] text-black shadow-xs hover:brightness-110'
              : 'bg-black text-white hover:bg-neutral-800'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Agregado</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
