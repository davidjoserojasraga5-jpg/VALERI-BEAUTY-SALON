import React, { useState } from 'react';
import { X, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { LOOKBOOK_GALLERY } from '../../models/initialData';
import { CategoryType, LookbookItem } from '../../models/types';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLook: (look: LookbookItem) => void;
  selectedLookId?: string;
  defaultCategory?: CategoryType;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  isOpen,
  onClose,
  onSelectLook,
  selectedLookId,
  defaultCategory = 'damas'
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>(defaultCategory);

  if (!isOpen) return null;

  const filteredLooks = activeCategory === 'all'
    ? LOOKBOOK_GALLERY
    : LOOKBOOK_GALLERY.filter(item => item.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#A88732]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Galería de Inspiración & Estilos
            </div>
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mt-1 uppercase tracking-wide">
              Lookbook Exclusivo Valeri
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Elige el estilo o acabado que deseas para que tu estilista prepare las técnicas exactas.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-100 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-black text-[#D4AF37]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos los Estilos
          </button>
          <button
            onClick={() => setActiveCategory('damas')}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              activeCategory === 'damas'
                ? 'bg-black text-[#D4AF37]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Damas
          </button>
          <button
            onClick={() => setActiveCategory('caballeros')}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              activeCategory === 'caballeros'
                ? 'bg-black text-[#D4AF37]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Caballeros
          </button>
          <button
            onClick={() => setActiveCategory('jovenes')}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              activeCategory === 'jovenes'
                ? 'bg-black text-[#D4AF37]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Jóvenes
          </button>
          <button
            onClick={() => setActiveCategory('ninos')}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
              activeCategory === 'ninos'
                ? 'bg-black text-[#D4AF37]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Niños
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredLooks.map((look) => {
            const isChosen = selectedLookId === look.id;
            return (
              <div
                key={look.id}
                onClick={() => onSelectLook(look)}
                className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 relative flex flex-col justify-between ${
                  isChosen
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-md'
                    : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {isChosen && (
                    <div className="absolute top-3 right-3 bg-[#D4AF37] text-black p-1.5 rounded-full shadow-md font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-serif font-bold text-base leading-tight uppercase tracking-wide">
                      {look.title}
                    </h4>
                  </div>
                </div>

                <div className="p-4 bg-white flex flex-col justify-between grow">
                  <p className="text-xs text-gray-600 mb-3">
                    {look.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[10px] text-[#A88732] font-bold uppercase tracking-wider">
                      {look.tags.join(' • ')}
                    </span>
                    <button
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors ${
                        isChosen
                          ? 'bg-black text-[#D4AF37]'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isChosen ? 'Seleccionado' : 'Elegir Estilo'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {selectedLookId ? 'Estilo de referencia asignado a tu cita' : 'Haz clic en cualquier estilo para añadirlo como referencia'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-sm bg-black text-[#D4AF37] text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
          >
            Listo / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
