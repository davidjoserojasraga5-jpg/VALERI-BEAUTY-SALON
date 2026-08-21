# Salón de Belleza Valeri - Plataforma de Reservas y Gestión

Aplicación web integral para la gestión, catálogo interactivo y agendamiento de citas presenciales y a domicilio del **Salón de Belleza Valeri**, optimizada para el mercado de Colombia con precios en Pesos Colombianos (COP), confirmación instantánea vía WhatsApp y panel administrativo en tiempo real.

---

## 1. Tecnologías y Stack Técnico

### Lenguajes de Programación
- **TypeScript (v5.8+)**: Tipado estático estricto para modelos de datos (`Booking`, `Service`, `Stylist`, `HomeAddress`), controladores y servicios.
- **HTML5 & CSS3 Moderno**: Semántica web accesible y maquetación responsiva.
- **ES Modules (ESM)**: Módulos estándar de JavaScript modernos.

### Frameworks y Librerías Frontend
- **React (v19.0.x)**: Biblioteca principal para la interfaz basada en componentes funcionales y Hooks personalizados (`useState`, `useEffect`, `useMemo`).
- **Vite (v6.2.x)**: Entorno de desarrollo de ultra-alta velocidad y empaquetador para producción con soporte para HMR y alias de rutas.
- **Tailwind CSS (v4.1.x)**: Framework utilitario de estilos con la nueva arquitectura `@tailwindcss/vite` e importación nativa `@import "tailwindcss";`.
- **Lucide React (v0.546.x)**: Iconografía vectorial para acciones, estados y navegación.
- **Canvas Confetti**: Animación de celebración al confirmar agendamientos.

### Base de Datos y Backend as a Service (BaaS)
- **Google Cloud Firestore (Firebase SDK v12.18.x)**: Base de datos NoSQL documental en la nube con sincronización en tiempo real (`onSnapshot`), persistencia híbrida y soporte con fallback a almacenamiento local en caso de desconexión.
- **Firebase Authentication**: Módulo para autenticación y control de acceso.

---

## 2. Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado en tu entorno:
- **Node.js**: Versión 18.0.0 o superior (recomendado Node.js 20 LTS o 22).
- **Gestor de paquetes**: `npm` (v9+) o `bun` / `pnpm` / `yarn`.

---

## 3. Configuración Inicial del Proyecto

### Paso 1: Clonar o descargar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd salon-valeri
```

### Paso 2: Instalación de dependencias
Instala todas las dependencias requeridas ejecutando:
```bash
npm install
```

### Paso 3: Variables de Entorno (Opcional según entorno)
Crea un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:
```bash
cp .env.example .env
```
Contenido de referencia:
```env
GEMINI_API_KEY="TU_CLAVE_DE_GEMINI_OPCIONAL"
APP_URL="http://localhost:3000"
```

---

## 4. Configuración de la Base de Datos (Firebase Firestore)

El proyecto utiliza un archivo de configuración centralizado `firebase-applet-config.json` en la raíz del proyecto:

### Estructura de `firebase-applet-config.json`:
```json
{
  "projectId": "ai-studio-07b25c97-710f-481a-87dc-0a8547473227",
  "appId": "1:425808575122:web:xxxxxx",
  "apiKey": "AIzaSy...",
  "authDomain": "ai-studio-07b25c97-710f-481a-87dc-0a8547473227.firebaseapp.com",
  "storageBucket": "ai-studio-07b25c97-710f-481a-87dc-0a8547473227.firebasestorage.app",
  "messagingSenderId": "425808575122",
  "firestoreDatabaseId": "(default)"
}
```

### Reglas de Seguridad de Firestore (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de citas: Creación, consulta y actualización
    match /bookings/{bookingId} {
      allow read, write: if true;
    }
    
    // Servicios y estilistas
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /stylists/{stylistId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 5. Scripts Disponibles

En el archivo `package.json` se definen los siguientes comandos:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local en `http://localhost:3000` con bind a `0.0.0.0`. |
| `npm run build` | Compila TypeScript y genera el bundle optimizado para producción en la carpeta `dist/`. |
| `npm run preview` | Previsualiza localmente el build de producción generado en `dist/`. |
| `npm run lint` | Ejecuta el análisis de tipos de TypeScript sin emitir archivos (`tsc --noEmit`). |
| `npm run clean` | Limpia los directorios generados de compilación (`dist/`). |

---

## 6. Configuración Global y Reglas de Negocio

### Localización y Precios en Pesos Colombianos (COP)
- **Moneda**: Todos los precios de los servicios y recargos de traslado están expresados en **Pesos Colombianos (COP)**.
- **Formateador Central**: Se implementó `formatCOP(monto)` en `src/models/initialData.ts` para renderizar números con separador de miles colombiano (ej. `$ 180.000 COP`).
- **Zonas de Domicilio**:
  - **Zona Centro / Chapinero:** $ 12.000 COP
  - **Zona Norte / Chicó / Usaquén:** $ 15.000 COP
  - **Zona Sur / Salitre / Colinas:** $ 18.000 COP
  - **Periferia / Chía / Cota / La Calera:** $ 28.000 COP

### Métodos de Pago Habilitados
- **Efectivo COP**
- **Transferencia Bancaria / PSE**
- **Datafono / Tarjeta de Crédito y Débito**
- **Nequi / Daviplata**

### Integración con WhatsApp API
- Genera enlaces `https://wa.me/57...` con el formato internacional de Colombia (+57).
- Construye resúmenes estructurados con ticket, desglose de servicios, dirección a domicilio y total en COP para confirmación del cliente y notificaciones del salón.

### Acceso Administrativo
- **PIN por defecto**: `1234`
- Permite gestionar estados de citas (*Pendiente*, *Confirmada*, *En Proceso*, *Completada*, *Cancelada*), registrar citas presenciales rápidas (*Walk-ins*), consultar métricas de ingresos diarios y enviar recordatorios directos por WhatsApp.

---

## 7. Estructura del Código

```text
├── src/
│   ├── App.tsx                     # Componente principal y enrutador de vistas
│   ├── main.tsx                    # Punto de entrada de React 19
│   ├── index.css                   # Importación de Tailwind CSS y fuentes
│   ├── models/
│   │   ├── types.ts                # Interfaces y tipos TypeScript
│   │   └── initialData.ts          # Catálogo de servicios, estilistas, zonas y formato COP
│   ├── controllers/
│   │   ├── BookingController.ts    # Lógica del asistente y validación de agendamiento
│   │   ├── WhatsAppController.ts   # Generación de mensajes y enlaces para WhatsApp
│   │   └── AdminController.ts      # Autenticación por PIN y filtros del panel admin
│   ├── services/
│   │   ├── firebase.ts             # Inicialización de Firebase App, Auth y Firestore
│   │   └── firestoreService.ts     # CRUD de reservas y sincronización en tiempo real
│   └── views/
│       └── components/
│           ├── Navbar.tsx                  # Barra superior de navegación y accesos
│           ├── HeroBanner.tsx              # Portada principal con llamadas a la acción
│           ├── ServiceCatalogView.tsx      # Catálogo por categorías (Damas, Caballeros, etc.)
│           ├── ServiceCard.tsx             # Tarjeta de servicio con precio COP y selector
│           ├── ServiceDetailModal.tsx      # Vista detallada de beneficios e incluye
│           ├── BookingWizardView.tsx       # Asistente de 4 pasos de reserva
│           ├── ModalitySelector.tsx        # Selección entre Salón y Domicilio VIP
│           ├── CalendarPicker.tsx          # Selector de fechas y turnos horarios
│           ├── ClientForm.tsx              # Datos de contacto y medios de pago
│           ├── BookingSummaryModal.tsx     # Ticket digital y confirmación WhatsApp
│           ├── AppointmentLookupView.tsx   # Buscador público de citas por código/teléfono
│           ├── AdminDashboardView.tsx      # Panel administrativo, métricas y walk-ins
│           ├── StylistsShowcase.tsx        # Perfiles del equipo de estilistas
│           ├── LookbookModal.tsx           # Galería de tendencias y fotos
│           └── SalonInfoFooter.tsx         # Horarios, ubicación y pie de página
├── firebase-applet-config.json     # Configuración activa de Firebase
├── firestore.rules                 # Reglas de seguridad de Firestore
├── package.json                    # Dependencias y scripts
├── tsconfig.json                   # Configuración del compilador TypeScript
└── vite.config.ts                  # Configuración de plugins y servidor Vite
```

---

## 8. Verificación y Despliegue

Para comprobar que el proyecto no presenta errores de tipado o compilación:
```bash
# Validar tipos
npm run lint

# Generar compilación para producción
npm run build
```

El proyecto está preparado para ejecutarse en entornos locales, contenedores Docker o servicios Cloud como Google Cloud Run / Vercel / Netlify.
