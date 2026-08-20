import { Service, Stylist, LookbookItem, SurchargeZone } from './types';

export const SALON_INFO = {
  name: "Salón de Belleza Valeri",
  slogan: "Arte, Elegancia y Estilo para Cada Momento",
  phone: "+57 (310) 845-9920",
  whatsappNumber: "573108459920", // Clean digits for WhatsApp API (Colombia +57)
  address: "Calle 85 #14-26, Piso 2, Chicó / Bogotá, Colombia",
  email: "contacto@salonvaleri.com",
  instagram: "@salonvaleri.oficial",
  schedule: "Lunes a Sábado: 8:00 AM - 8:00 PM | Domingos: 9:00 AM - 5:00 PM",
  homeServiceHours: "Lunes a Domingo: 8:00 AM - 7:00 PM",
  currencySymbol: "$",
  currencyCode: "COP",
  currencyName: "Pesos Colombianos (COP)"
};

/**
 * Helper to format monetary values into Colombian Pesos (COP)
 * Example: 55000 -> "$ 55.000" or "$ 55.000 COP"
 */
export function formatCOP(amount: number, withCode = false): string {
  const num = Number(amount) || 0;
  // Format with Colombian thousands separators (dot)
  const formatted = '$ ' + num.toLocaleString('es-CO');
  return withCode ? `${formatted} COP` : formatted;
}

export const SURCHARGE_ZONES: SurchargeZone[] = [
  {
    id: 'centro',
    name: 'Zona Centro / Chapinero (0 - 5 km)',
    fee: 12000,
    estimatedTime: '15-20 min',
    description: 'Cubre el centro metropolitano, Chapinero y barrios aledaños.'
  },
  {
    id: 'norte',
    name: 'Zona Norte / Chicó / Usaquén (5 - 12 km)',
    fee: 15000,
    estimatedTime: '25-35 min',
    description: 'Áreas residenciales del norte, Chicó, Santa Bárbara y Usaquén.'
  },
  {
    id: 'sur',
    name: 'Zona Sur / Salitre / Colinas (5 - 14 km)',
    fee: 18000,
    estimatedTime: '30-40 min',
    description: 'Sectores de Ciudad Salitre, Modelia, Teusaquillo y zonas aledañas.'
  },
  {
    id: 'periferia',
    name: 'Periferia / Chía / Cota / La Calera (15+ km)',
    fee: 28000,
    estimatedTime: '45-60 min',
    description: 'Municipios aledaños, condominios campestres y sabana norte.'
  }
];

export const INITIAL_SERVICES: Service[] = [
  // --- DAMAS ---
  {
    id: 'dam-01',
    name: 'Balayage & Colorimetría Signature',
    category: 'damas',
    description: 'Técnica francesa de iluminación degradada personalizada, matiz protector y brillo espejo.',
    detailedDescription: 'Nuestro servicio estrella para iluminar el cabello con transiciones suaves y naturales. Incluye diagnóstico capilar, decoloración con plex protector, matización personalizada, lavado sensorial y peinado con ondas glam.',
    durationMinutes: 180,
    price: 290000,
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
    popular: true,
    tags: ['Tendencia', 'Color', 'Rubios', 'Caramel'],
    includes: ['Diagnóstico capilar', 'Tratamiento Plex', 'Matiz y Tonalizante', 'Ondas / Brushing']
  },
  {
    id: 'dam-02',
    name: 'Corte de Dama & Estilizado con Brushing',
    category: 'damas',
    description: 'Corte de diseño según morfología facial, lavado relajante con masaje y secado con volumen.',
    detailedDescription: 'Asesoría de visagismo para elegir el largo y capas ideales para ti (Butterfly cut, Bob, Capas largas). Incluye lavado con aromaterapia, acondicionamiento profundo y acabado pulido.',
    durationMinutes: 60,
    price: 55000,
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    popular: true,
    tags: ['Corte', 'Diseño', 'Brushing'],
    includes: ['Lavado relajante', 'Corte personalizado', 'Styling profesional']
  },
  {
    id: 'dam-03',
    name: 'Alisado Orgánico & Keratina Biomimética',
    category: 'damas',
    description: 'Control de frizz 100%, lacio sedoso de alta duración sin formol ni químicos agresivos.',
    detailedDescription: 'Tratamiento termoactivo a base de aminoácidos botánicos, ácido hialurónico y proteína de seda. Aporta suavidad extrema, sella puntas abiertas y reduce el tiempo de secado diario.',
    durationMinutes: 150,
    price: 240000,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    popular: false,
    tags: ['Alisado', 'Sin Formol', 'Antifrizz'],
    includes: ['Lavado purificante', 'Aplicación termoactiva', 'Sellado cerámico', 'Mascarilla post']
  },
  {
    id: 'dam-04',
    name: 'Manicure & Pedicure Spa Deluxe',
    category: 'damas',
    description: 'Exfoliación con sales minerales, mascarilla hidratante, cutículas perfectas y esmaltado semipermanente.',
    detailedDescription: 'Ritual completo para manos y pies. Incluye baño relajante, exfoliación de rosas, remoción delicada de cutículas, limado anatómico, masaje relajante y esmaltado en gel de hasta 21 días de duración.',
    durationMinutes: 90,
    price: 65000,
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    popular: true,
    tags: ['Uñas', 'Spa', 'Semipermanente'],
    includes: ['Exfoliación botánica', 'Esmaltado en Gel', 'Masaje nutritivo']
  },
  {
    id: 'dam-05',
    name: 'Uñas Acrílicas / Soft Gel con Nail Art',
    category: 'damas',
    description: 'Extensiones estructurales en largo a elección, con diseño artístico personalizado o frenchie moderno.',
    detailedDescription: 'Estructuración perfecta con técnicas rusas o Soft Gel tips. Durabilidad superior con pedrería, líneas finas, cromados o encapsulados a tu gusto.',
    durationMinutes: 120,
    price: 95000,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    tags: ['Nail Art', 'Acrílico', 'Soft Gel'],
    includes: ['Preparación en seco', 'Extensión o recubrimiento', 'Nail Art 2 uñas']
  },
  {
    id: 'dam-06',
    name: 'Maquillaje Social & Peinado para Eventos',
    category: 'damas',
    description: 'Look de alta duración resistente al agua y fotos HD, con pestañas postizas de visón sintético.',
    detailedDescription: 'Preparación de piel con sérums hidratantes, contornos esculpidos, sombras en tendencia y fijación de 16 horas. Peinado recogido o suelto con textura glam.',
    durationMinutes: 110,
    price: 180000,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    tags: ['Social', 'Gala', 'Novias', 'Fiesta'],
    includes: ['Pestañas 3D', 'Preparación de piel', 'Fijador HD', 'Peinado completo']
  },
  {
    id: 'dam-07',
    name: 'Botox Capilar & Reconstrucción Molecular',
    category: 'damas',
    description: 'Inyección de colágeno y vitaminas para cabellos maltratados, porosos o teñidos.',
    detailedDescription: 'Rellena la fibra capilar devolviendo elasticidad y fuerza inmediata. Ideal antes o después de procesos químicos exigentes.',
    durationMinutes: 75,
    price: 120000,
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    tags: ['Reparación', 'Brillo', 'Nutrición'],
    includes: ['Diagnóstico de porosidad', 'Tratamiento concentrado', 'Vaporizador ozono']
  },

  // --- CABALLEROS ---
  {
    id: 'cab-01',
    name: 'Corte Caballero Fade & Barbería Clásica',
    category: 'caballeros',
    description: 'Corte a máquina y tijera con degradado milimétrico (Low, Mid, High Fade o Taper) y peinado pomada.',
    detailedDescription: 'Técnica de barbería de precisión. Asesoría de estilo, lavado con champú mentolado energizante, texturizado superior y perfilado de patillas y nuca.',
    durationMinutes: 45,
    price: 35000,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    popular: true,
    tags: ['Fade', 'Taper', 'Degradado', 'Clásico'],
    includes: ['Lavado mentolado', 'Corte con máquina & tijera', 'Styling mate o brillo']
  },
  {
    id: 'cab-02',
    name: 'Ritual de Barba con Toalla Caliente & Navaja',
    category: 'caballeros',
    description: 'Alineación de contornos, rebaje de volumen, vapor caliente con eucalipto y aceites orgánicos.',
    detailedDescription: 'Una experiencia relajante que abre los poros, previene la irritación y deja la barba suave y alineada con precisión de navaja libre.',
    durationMinutes: 35,
    price: 28000,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    popular: true,
    tags: ['Barba', 'Toalla Caliente', 'Navaja'],
    includes: ['Vapor y toalla aromática', 'Afeitado tradicional', 'Bálsamo hidratante']
  },
  {
    id: 'cab-03',
    name: 'Combo VIP: Corte + Barba + Masaje Capilar',
    category: 'caballeros',
    description: 'El paquete definitivo para el hombre distinguido: corte moderno, arreglo de barba y masaje descontracturante.',
    detailedDescription: 'Combina nuestro mejor corte fade o clásico, ritual de barba completo con toalla caliente, mascarilla exfoliante rápida y masaje en cuero cabelludo y hombros.',
    durationMinutes: 75,
    price: 58000,
    image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80',
    popular: true,
    tags: ['VIP', 'Combo', 'Relajación'],
    includes: ['Corte completo', 'Ritual de barba', 'Exfoliación facial', 'Masaje antiestrés']
  },
  {
    id: 'cab-04',
    name: 'Camuflaje de Canas / Matizado Natural',
    category: 'caballeros',
    description: 'Disimula las canas en barba o cabello en solo 15 minutos sin efecto raíz ni tintura artificial.',
    detailedDescription: 'Tono sobre tono ultra natural que atenúa las canas sin cambiar el color base de tu cabello. Aspecto rejuvenecido y discreto.',
    durationMinutes: 30,
    price: 40000,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    tags: ['Color', 'Discreción', 'Canas'],
    includes: ['Tinte libre de amoníaco', 'Lavado tonificante']
  },
  {
    id: 'cab-05',
    name: 'Limpieza Facial Express para Hombres',
    category: 'caballeros',
    description: 'Desintoxicación de poros, exfoliación con carbón activado y sérum matificante antibrillo.',
    detailedDescription: 'Ideal para eliminar impurezas, puntos negros y exceso de sebo ocasionado por el día a día. Deja la piel descansada y fresca.',
    durationMinutes: 40,
    price: 50000,
    image: 'https://images.unsplash.com/photo-1512290900672-1f02e6d09528?auto=format&fit=crop&w=800&q=80',
    tags: ['Facial', 'Piel', 'Carbón'],
    includes: ['Limpieza ultrasónica', 'Mascarilla peel-off', 'Protector solar mate']
  },

  // --- NIÑOS ---
  {
    id: 'nin-01',
    name: 'Corte Infantil Divertido & Paciencia Kids',
    category: 'ninos',
    description: 'Corte adaptado a los pequeños en ambiente amigable, con paciencia y técnicas suaves.',
    detailedDescription: 'Nuestros estilistas especializados atienden a niños y niñas con el mayor cuidado y cariño. Incluye peinado divertido con gel suave o purpurina si lo desean.',
    durationMinutes: 35,
    price: 28000,
    image: 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?auto=format&fit=crop&w=800&q=80',
    popular: true,
    tags: ['Kids', 'Paciencia', 'Infantil'],
    includes: ['Capa infantil', 'Corte tijera o máquina', 'Peinado final']
  },
  {
    id: 'nin-02',
    name: 'Corte con Diseños & Líneas Freestyle Kids',
    category: 'ninos',
    description: 'Líneas laterales, rayos o figuras artísticas talladas en el cabello para los pequeños con estilo.',
    detailedDescription: 'Diseño seguro realizado con máquina de contornos especiales sin filo agresivo. Muy popular para el regreso a clases o cumpleaños.',
    durationMinutes: 45,
    price: 35000,
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    tags: ['Freestyle', 'Líneas', 'Diseño'],
    includes: ['Corte general', 'Diseño a elección', 'Gel modelador']
  },
  {
    id: 'nin-03',
    name: 'Trenzas Fantasía & Lazos Princesas',
    category: 'ninos',
    description: 'Trenzas holandesas, trenzas de boxeadora o cascada con cintas de colores y lazos.',
    detailedDescription: 'Peinado protector que dura varios días, decorado con hilos brillantes, lazos o cuentas de colores hipoalergénicas.',
    durationMinutes: 40,
    price: 38000,
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
    popular: true,
    tags: ['Trenzas', 'Fantasía', 'Princesas'],
    includes: ['Desenredado suave', 'Trenzas con diseño', 'Accesorios de colores']
  },
  {
    id: 'nin-04',
    name: 'Spa Pequeñas Divas: Mini Manicure + Peinado',
    category: 'ninos',
    description: 'Esmaltado de uñitas con brillo al agua (no tóxico), mascarilla de frutas y peinado con flores.',
    detailedDescription: 'Experiencia mágica para consentir a las pequeñas en ocasiones especiales, piñatas o sesiones de fotos.',
    durationMinutes: 50,
    price: 48000,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    tags: ['Mini Spa', 'Niñas', 'Cumpleaños'],
    includes: ['Esmalte lavable', 'Stickers de uñas', 'Peinado glam kids']
  },

  // --- JÓVENES ---
  {
    id: 'jov-01',
    name: 'Corte Aesthetic: Wolf Cut / Mullet Moderno',
    category: 'jovenes',
    description: 'Capas texturizadas, movimiento natural y flequillos desfilados inspirados en tendencias virales.',
    detailedDescription: 'El corte más pedido en TikTok e Instagram. Ideal para cabellos ondulados, lisos o con textura. Incluye texturizado con navaja suave y crema de peinado mate.',
    durationMinutes: 55,
    price: 45000,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    popular: true,
    tags: ['Aesthetic', 'Wolf Cut', 'Mullet', 'Viral'],
    includes: ['Asesoría de estilo', 'Texturizado profundo', 'Fijación flexible']
  },
  {
    id: 'jov-02',
    name: 'Mechas Fantasía / Mechones Frontales Money Piece',
    category: 'jovenes',
    description: 'Tonos rosa pastel, azul cobalto, lavanda o mechas frontales contrastadas de alto impacto.',
    detailedDescription: 'Decoloración localizada con protector molecular y pigmentación semipermanente vibrante sin dañar el resto del cabello.',
    durationMinutes: 120,
    price: 130000,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    popular: true,
    tags: ['Fantasía', 'Money Piece', 'Colores'],
    includes: ['Decoloración segura', 'Pigmento directo', 'Mascarilla ácida selladora']
  },
  {
    id: 'jov-03',
    name: 'Laminado de Cejas & Lifting de Pestañas',
    category: 'jovenes',
    description: 'Efecto cejas peinadas hacia arriba tipo editorial + pestañas curvadas con tinte negro intenso.',
    detailedDescription: 'Abre la mirada al instante sin necesidad de maquillaje diario. Duración de 6 a 8 semanas con queratina fortalecedora.',
    durationMinutes: 60,
    price: 75000,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    popular: true,
    tags: ['Mirada', 'Laminado', 'Lifting'],
    includes: ['Diseño de cejas', 'Laminado orgánico', 'Lifting + Tinte de pestañas']
  },
  {
    id: 'jov-04',
    name: 'Nail Art Creativo Y2K / 3D Gel',
    category: 'jovenes',
    description: 'Diseños con relieve 3D, cromados cromo espejo, stickers kawaii y degradados aura.',
    detailedDescription: 'Para quienes buscan que sus manos sean el centro de atención. Diseños únicos creados a mano alzada por nuestras artistas.',
    durationMinutes: 90,
    price: 85000,
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
    tags: ['Y2K', 'Nail Art 3D', 'Aura Nails'],
    includes: ['Manicura rusa', 'Base rubber reforzada', 'Diseño completo personalizado']
  }
];

export const INITIAL_STYLISTS: Stylist[] = [
  {
    id: 'valeri',
    name: 'Valeri Rossi',
    role: 'Master Stylist & Directora Artística',
    specialties: ['Balayage & Colorimetría', 'Corte de Alta Precisión', 'Maquillaje de Novias'],
    rating: 4.98,
    reviewCount: 284,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Más de 12 años de trayectoria internacional en pasarelas y salones de alta gama. Apasionada por realzar la belleza natural de cada cliente.',
    availableDays: [1, 2, 3, 4, 5, 6],
    workingHours: { start: '09:00', end: '19:00' }
  },
  {
    id: 'carlos',
    name: 'Carlos Mendoza',
    role: 'Especialista en Barbería & Colorimetría Masculina',
    specialties: ['Fades & Taper', 'Rituales de Barba a Navaja', 'Camuflaje de Canas'],
    rating: 4.95,
    reviewCount: 198,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Barbero maestro certificado. Perfeccionista en degradados limpios, perfilado de barbas y asesoría de estilo moderno.',
    availableDays: [1, 2, 3, 4, 5, 6],
    workingHours: { start: '08:30', end: '18:30' }
  },
  {
    id: 'sofia',
    name: 'Sofía Navarro',
    role: 'Nail Artist & Esteticista Spa',
    specialties: ['Uñas Acrílicas & Soft Gel', 'Nail Art 3D & Diseños', 'Lifting & Cejas'],
    rating: 4.92,
    reviewCount: 165,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bio: 'Creativa innata con especialidad en manicura rusa y técnicas de hidratación profunda para manos y pestañas.',
    availableDays: [2, 3, 4, 5, 6, 0],
    workingHours: { start: '09:30', end: '19:30' }
  },
  {
    id: 'mateo',
    name: 'Mateo Morales',
    role: 'Estilista Juvenil & Hair Designer',
    specialties: ['Cortes Aesthetic & Wolf Cut', 'Tintes Fantasía & Mechas', 'Kids & Freestyle'],
    rating: 4.89,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'Experto en tendencias virales, cortes con textura descontracturada y trato cálido con niños y adolescentes.',
    availableDays: [1, 2, 3, 4, 5, 6],
    workingHours: { start: '10:00', end: '20:00' }
  }
];

export const LOOKBOOK_GALLERY: LookbookItem[] = [
  {
    id: 'lb-1',
    title: 'Balayage Caramelo Miel',
    category: 'damas',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'Transición suave y cálida ideal para bases castañas.',
    relatedServiceId: 'dam-01',
    tags: ['Balayage', 'Cálido', 'Ondas']
  },
  {
    id: 'lb-2',
    title: 'Skin Fade Impecable con Textura',
    category: 'caballeros',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    description: 'Degradado al ras en laterales con volumen superior definido.',
    relatedServiceId: 'cab-01',
    tags: ['Fade', 'Barbería', 'Masculino']
  },
  {
    id: 'lb-3',
    title: 'Uñas Almendradas Frenchie Dorado',
    category: 'damas',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    description: 'Elegancia pura con toques dorados y brillo espejo.',
    relatedServiceId: 'dam-04',
    tags: ['Nails', 'Dorado', 'Elegante']
  },
  {
    id: 'lb-4',
    title: 'Wolf Cut & Capas Desfiladas',
    category: 'jovenes',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: 'Volumen natural con flequillo cortina desenfadado.',
    relatedServiceId: 'jov-01',
    tags: ['Wolf Cut', 'Aesthetic', 'Capas']
  },
  {
    id: 'lb-5',
    title: 'Líneas Artísticas Kids',
    category: 'ninos',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    description: 'Detalle geométrico lateral que resalta el corte infantil.',
    relatedServiceId: 'nin-02',
    tags: ['Diseño', 'Kids', 'Moderno']
  },
  {
    id: 'lb-6',
    title: 'Lifting de Pestañas & Laminado Glow',
    category: 'jovenes',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    description: 'Efecto mirada despierta sin rímel.',
    relatedServiceId: 'jov-03',
    tags: ['Pestañas', 'Cejas', 'Glow']
  }
];

export const INITIAL_SAMPLE_BOOKINGS = [
  {
    id: 'res-101',
    bookingCode: 'VAL-8492',
    createdAt: new Date().toISOString(),
    clientName: 'Mariana Gómez',
    clientPhone: '+57 312 456 7890',
    clientEmail: 'mariana.gomez@ejemplo.com',
    clientNotes: 'Cabello teñido previamente, deseo aclarar puntas.',
    modality: 'presencial' as const,
    deliveryFee: 0,
    services: [INITIAL_SERVICES[0]], // Balayage 290.000
    totalDuration: 180,
    subtotal: 290000,
    total: 290000,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00',
    stylistId: 'valeri',
    stylistName: 'Valeri Rossi',
    status: 'confirmada' as const,
    paymentMethod: 'transferencia' as const
  },
  {
    id: 'res-102',
    bookingCode: 'VAL-3194',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    clientName: 'Roberto Alvarado',
    clientPhone: '+57 318 789 1234',
    clientEmail: 'roberto.a@ejemplo.com',
    clientNotes: 'Por favor traer toallas adicionales.',
    modality: 'domicilio' as const,
    homeAddress: {
      street: 'Calle 127',
      number: '18A-45 Apto 502',
      neighborhood: 'Santa Bárbara Central',
      city: 'Bogotá',
      references: 'Frente al parque, edificio ladrillo a la vista.',
      zoneId: 'norte'
    },
    deliveryFee: 15000,
    services: [INITIAL_SERVICES[7], INITIAL_SERVICES[8]], // Corte + Barba Combo (58.000)
    totalDuration: 75,
    subtotal: 58000,
    total: 73000,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '15:30',
    stylistId: 'carlos',
    stylistName: 'Carlos Mendoza',
    status: 'en_proceso' as const,
    paymentMethod: 'efectivo' as const
  },
  {
    id: 'res-103',
    bookingCode: 'VAL-6721',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    clientName: 'Camila Torres',
    clientPhone: '+57 300 456 7890',
    clientEmail: 'camila.t@ejemplo.com',
    clientNotes: 'Para fiesta de graduación.',
    modality: 'presencial' as const,
    deliveryFee: 0,
    services: [INITIAL_SERVICES[5]], // Maquillaje social (180.000)
    totalDuration: 110,
    subtotal: 180000,
    total: 180000,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '11:00',
    stylistId: 'valeri',
    stylistName: 'Valeri Rossi',
    status: 'pendiente' as const,
    paymentMethod: 'tarjeta' as const
  }
];
