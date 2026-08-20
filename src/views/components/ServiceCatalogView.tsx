import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, SlidersHorizontal, Image as ImageIcon, ArrowRight, Check, X } from 'lucide-react';
import { INITIAL_SERVICES, formatCOP } from '../../models/initialData';
import { CategoryType, LookbookItem, Service } from '../../models/types';
import { ServiceCard } from './ServiceCard';
import { ServiceDetailModal } from './ServiceDetailModal';
import { LookbookModal } from './LookbookModal';

interface ServiceCatalogViewProps {
  selectedServices: Service[];
  onToggleSelectService: (service: Service) => void;
  onProceedToBooking: (service?: Service) => void;
  initialCategory?: CategoryType;
  selectedLookbook?: { id: string; title: string; image: string };
  onSelectLookbook: (look: LookbookItem) => void;
}

export const ServiceCatalogView: React.FC<ServiceCatalogViewProps> = ({
  selectedServices,
  onToggleSelectService,
  onProceedToBooking,
  initialCategory = 'damas',
  selectedLookbook,
  onSelectLookbook
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailModalService, setDetailModalService] = useState<Service | null>(null);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');

  const categories = [
    { id: 'all', label: 'Todos los Servicios', icon: '✨', count: INITIAL_SERVICES.length },
    { id: 'damas', label: 'Damas', icon: '💅', count: INITIAL_SERVICES.filter(s => s.category === 'damas').length },
    { id: 'caballeros', label: 'Caballeros', icon: '✂️', count: INITIAL_SERVICES.filter(s => s.category === 'caballeros').length },
    { id: 'jovenes', label: 'Jóvenes & Tendencias', icon: '⚡', count: INITIAL_SERVICES.filter(s => s.category === 'jovenes').length },
    { id: 'ninos', label: 'Niños & Niñas', icon: '🧸', count: INITIAL_SERVICES.filter(s => s.category === 'ninos').length },
  ];

  // Filtering services
  const filteredServices = useMemo(() => {
    return INITIAL_SERVICES.filter(service => {
      // Category filter
      if (activeCategory !== 'all' && service.category !== activeCategory) {
        return false;
      }
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesDesc = service.description.toLowerCase().includes(query);
        const matchesTags = service.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }
      return true;
    }).sort((a, b) => {
      if (priceSort === 'asc') return a.price - b.price;
      if (priceSort === 'desc') return b.price - a.price;
      return 0;
    });
  }, [activeCategory, searchTerm, priceSort]);

  const selectedIds = useMemo(() => new Set(selectedServices.map(s => s.id)), [selectedServices]);
  const subtotal = selectedServices.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#A88732] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Catálogo Profesional Interactivo
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A] uppercase tracking-wide">
            Servicios & Tratamientos
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mt-1">
            Explora nuestros tratamientos capilares, barbería, spa de uñas y estética categorizados con tarifas transparentes y tiempos estimados.
          </p>
        </div>

        {/* Lookbook Inspiration Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLookbookOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-[#F5E1DA] text-[#A88732] hover:bg-[#ebd3cb] font-bold text-[10px] sm:text-xs uppercase tracking-widest border border-[#D4AF37]/30 transition-all shadow-xs"
          >
            <ImageIcon className="w-4 h-4 text-[#A88732]" />
            <span>Lookbook de Inspiración</span>
            {selectedLookbook && (
              <span className="w-2 h-2 rounded-full bg-[#A88732] animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Lookbook active indicator if attached */}
      {selectedLookbook && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5E1DA]/30 border border-[#D4AF37]/40">
          <div className="flex items-center gap-3">
            <img 
              src={selectedLookbook.image} 
              alt={selectedLookbook.title} 
              className="w-12 h-12 rounded-md object-cover border border-[#D4AF37]"
            />
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#A88732] block">
                Estilo de Referencia Adjunto:
              </span>
              <span className="text-sm font-serif font-bold text-neutral-900">
                {selectedLookbook.title}
              </span>
            </div>
          </div>
          <button
            onClick={() => onSelectLookbook({ id: '', title: '', category: 'damas', image: '', description: '', tags: [] })}
            className="text-xs text-neutral-500 hover:text-neutral-800 p-1.5 rounded-sm hover:bg-neutral-200"
            title="Quitar referencia"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Category Pills & Search Controls */}
      <div className="space-y-4">
        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as CategoryType | 'all')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-gray-500 hover:text-black hover:border-gray-400 border border-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeCategory === cat.id
                  ? 'bg-white/20 text-[#D4AF37]'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar servicio (ej. Balayage, Fade, Keratina)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-[#D4AF37]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 hidden sm:inline">Ordenar:</span>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-hidden focus:border-[#D4AF37]"
            >
              <option value="default">Destacados / Recomendados</option>
              <option value="asc">Precio: Menor a Mayor</option>
              <option value="desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8 space-y-3">
          <Search className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-neutral-800">
            No encontramos servicios con esos criterios
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Prueba buscando con otro término o seleccionando otra categoría.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
            className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800"
          >
            Ver todos los servicios
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedIds.has(service.id)}
              onToggleSelect={onToggleSelectService}
              onViewDetails={(s) => setDetailModalService(s)}
            />
          ))}
        </div>
      )}

      {/* Floating Bottom Sticky Summary Bar when services are selected */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-30 max-w-4xl mx-auto animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-black text-white p-4 sm:p-5 rounded-xl shadow-2xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-black font-bold text-sm flex items-center justify-center shrink-0">
                {selectedServices.length}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] block">
                  {selectedServices.length === 1 ? '1 servicio seleccionado' : `${selectedServices.length} servicios seleccionados`}
                </span>
                <span className="text-base sm:text-lg font-serif italic text-white">
                  Total Estimado: {formatCOP(subtotal)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => onProceedToBooking()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4AF37] hover:brightness-110 text-black px-6 py-2.5 sm:py-3 rounded-sm font-bold text-[10px] sm:text-xs uppercase tracking-widest shadow-sm transition-all cursor-pointer"
              >
                <span>Continuar con mi Cita</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Details Modal */}
      <ServiceDetailModal
        service={detailModalService}
        isOpen={!!detailModalService}
        onClose={() => setDetailModalService(null)}
        isSelected={detailModalService ? selectedIds.has(detailModalService.id) : false}
        onToggleSelect={onToggleSelectService}
        onBookNow={(s) => {
          if (!selectedIds.has(s.id)) {
            onToggleSelectService(s);
          }
          onProceedToBooking(s);
        }}
      />

      {/* Lookbook Inspiration Modal */}
      <LookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        selectedLookId={selectedLookbook?.id}
        onSelectLook={(look) => {
          onSelectLookbook(look);
          setIsLookbookOpen(false);
        }}
        defaultCategory={activeCategory !== 'all' ? activeCategory : 'damas'}
      />
    </div>
  );
};
