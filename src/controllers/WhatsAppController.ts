import { Booking, HomeAddress, Service } from '../models/types';
import { SALON_INFO, SURCHARGE_ZONES, formatCOP } from '../models/initialData';

/**
 * WhatsApp Message Generator for Salón de Belleza Valeri (Colombia)
 */
export class WhatsAppController {
  
  /**
   * Builds the client booking confirmation message
   */
  public static generateBookingMessage(booking: Booking): string {
    const isDomicilio = booking.modality === 'domicilio';
    const zone = booking.homeAddress?.zoneId 
      ? SURCHARGE_ZONES.find(z => z.id === booking.homeAddress?.zoneId)?.name 
      : 'Zona estándar';

    const servicesList = booking.services
      .map(s => `  • *${s.name}* (${s.durationMinutes} min) - ${formatCOP(s.price)}`)
      .join('\n');

    let addressSection = '';
    if (isDomicilio && booking.homeAddress) {
      addressSection = `
📍 *MODALIDAD: SERVICIO A DOMICILIO VIP*
🏡 *Dirección:* ${booking.homeAddress.street} #${booking.homeAddress.number}
🏙️ *Barrio / Sector:* ${booking.homeAddress.neighborhood}, ${booking.homeAddress.city}
🗺️ *Zona:* ${zone} (Recargo traslado: ${formatCOP(booking.deliveryFee)})
${booking.homeAddress.references ? `📌 *Referencias:* ${booking.homeAddress.references}` : ''}`;
    } else {
      addressSection = `
📍 *MODALIDAD: EN SALÓN VALERI*
🏢 *Dirección:* ${SALON_INFO.address}`;
    }

    const lookbookSection = booking.selectedLookbook
      ? `\n🎨 *Estilo de inspiración seleccionado:* ${booking.selectedLookbook.title}`
      : '';

    const notesSection = booking.clientNotes
      ? `\n📝 *Notas especiales:* ${booking.clientNotes}`
      : '';

    const message = `✨ *SOLICITUD DE RESERVA - SALÓN DE BELLEZA VALERI* ✨
━━━━━━━━━━━━━━━━━━━━━
🔖 *Código de Cita:* #${booking.bookingCode}
👤 *Cliente:* ${booking.clientName}
📱 *Teléfono:* ${booking.clientPhone}
${booking.clientEmail ? `📧 *Email:* ${booking.clientEmail}` : ''}

💇‍♀️ *SERVICIOS SOLICITADOS:*
${servicesList}

⏱️ *Duración estimada:* ${booking.totalDuration} min
✂️ *Estilista:* ${booking.stylistName}
📅 *Fecha:* ${booking.date}
⏰ *Hora:* ${booking.timeSlot} hrs
${addressSection}
${lookbookSection}
${notesSection}

💳 *DETALLE DE PAGO (PESOS COLOMBIANOS):*
• Subtotal servicios: ${formatCOP(booking.subtotal)}
${isDomicilio ? `• Recargo a domicilio: ${formatCOP(booking.deliveryFee)}\n` : ''}• *TOTAL ESTIMADO:* ${formatCOP(booking.total, true)}
• Método de pago: ${booking.paymentMethod.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━
_Hola Salón Valeri, acabo de generar mi solicitud de cita a través de su plataforma en línea en Pesos Colombianos (COP). Quedo atento(a) a su confirmación. ¡Muchas gracias!_ ✨`;

    return message;
  }

  /**
   * Creates a direct WhatsApp click-to-chat URL for client confirmation
   */
  public static getClientConfirmationUrl(booking: Booking): string {
    const rawMessage = this.generateBookingMessage(booking);
    const encoded = encodeURIComponent(rawMessage);
    return `https://wa.me/${SALON_INFO.whatsappNumber}?text=${encoded}`;
  }

  /**
   * Creates an Admin-to-Client WhatsApp notification URL
   */
  public static getAdminToClientUrl(booking: Booking, type: 'confirm' | 'on_way' | 'reminder'): string {
    const cleanPhone = booking.clientPhone.replace(/\D/g, '');
    let text = '';

    if (type === 'confirm') {
      text = `Hola ${booking.clientName} ✨ Te saluda el equipo de *Salón de Belleza Valeri*. Te confirmamos con gusto tu cita (#${booking.bookingCode}) para el día *${booking.date}* a las *${booking.timeSlot} hrs* con *${booking.stylistName}*. Total: *${formatCOP(booking.total, true)}*. ¡Te esperamos!`;
    } else if (type === 'on_way') {
      text = `Hola ${booking.clientName} 🚗✨ Nuestro estilista *${booking.stylistName}* ya va en camino a tu domicilio para tu servicio (#${booking.bookingCode}). Por favor ten listo el espacio. ¡Nos vemos en breve!`;
    } else {
      text = `Hola ${booking.clientName} 🌸 Recordatorio de tu cita en *Salón de Belleza Valeri* programada para hoy/mañana a las *${booking.timeSlot} hrs*. Total a cancelar: *${formatCOP(booking.total, true)}*. Si requieres algún cambio, avísanos con anticipación. ¡Será un placer atenderte!`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  }
}
