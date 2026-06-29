"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let MailService = MailService_1 = class MailService {
    configService;
    logger = new common_1.Logger(MailService_1.name);
    resend;
    fromAddress;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('RESEND_API_KEY');
        this.fromAddress = this.configService.get('MAIL_FROM') || 'Royal Air <onboarding@resend.dev>';
        this.resend = apiKey ? new resend_1.Resend(apiKey) : null;
        if (!this.resend) {
            this.logger.warn('RESEND_API_KEY not set — booking confirmation emails will be skipped.');
        }
    }
    async sendBookingConfirmation(data) {
        if (!this.resend)
            return;
        if (!data.passengerEmail)
            return;
        try {
            const result = await this.resend.emails.send({
                from: this.fromAddress,
                to: data.passengerEmail,
                subject: `Booking Confirmed — ${data.flightNo} · ${data.bookingReference}`,
                html: this.buildBookingConfirmationHtml(data),
            });
            if (result.error) {
                this.logger.error(`Resend rejected booking confirmation email to ${data.passengerEmail}: ${result.error.message}`);
                return;
            }
            this.logger.log(`✅ Booking confirmation email sent to ${data.passengerEmail} (ref: ${data.bookingReference}) — id: ${result.data?.id ?? 'n/a'}`);
        }
        catch (error) {
            this.logger.error(`Failed to send booking confirmation email to ${data.passengerEmail}: ${error?.message || error}`);
        }
    }
    async sendTicket(data) {
        if (!this.resend)
            return;
        if (!data.passengerEmail)
            return;
        try {
            const result = await this.resend.emails.send({
                from: this.fromAddress,
                to: data.passengerEmail,
                subject: `Ticket — ${data.flightNo} · ${data.ticketNumber}`,
                html: this.buildTicketHtml(data),
            });
            if (result.error) {
                this.logger.error(`Resend rejected ticket email to ${data.passengerEmail}: ${result.error.message}`);
                return;
            }
            this.logger.log(`✅ Ticket email sent to ${data.passengerEmail} (ticket: ${data.ticketNumber}) — id: ${result.data?.id ?? 'n/a'}`);
        }
        catch (error) {
            this.logger.error(`Failed to send ticket email to ${data.passengerEmail}: ${error?.message || error}`);
        }
    }
    buildTicketHtml(data) {
        const NAVY = '#1A3A8F';
        const GOLD = '#F0B429';
        const time = [data.std, data.sta].filter(Boolean).join(' → ');
        const fullName = `${data.passengerTitle ? `${data.passengerTitle} ` : ''}${data.passengerName}`;
        return `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: ${NAVY}; border-bottom: 3px solid ${GOLD}; padding: 18px 24px; text-align: center;">
          <p style="color: #ffffff; font-size: 16px; font-weight: bold; letter-spacing: 1px; margin: 0;">ROYAL AIR</p>
          <p style="color: #cfe0ff; font-size: 11px; margin: 2px 0 0;">Takes You Always Further</p>
          <p style="color: #ffffff; font-size: 13px; font-weight: bold; letter-spacing: 1px; margin: 10px 0 0;">E-TICKET / ITINERARY RECEIPT</p>
          <p style="color: #cfe0ff; font-size: 9px; margin: 2px 0 0;">THIS IS NOT A BOARDING PASS</p>
        </div>

        <div style="padding: 16px 24px; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
          <table style="width: 100%; font-size: 11px; color: #374151;">
            <tr>
              <td style="padding: 2px 0;"><span style="color: #9ca3af;">Ticket Number</span><br/><strong style="font-size: 13px;">${data.ticketNumber}</strong></td>
              <td style="padding: 2px 0; text-align: right;"><span style="color: #9ca3af;">Booking Ref (PNR)</span><br/><strong style="font-size: 13px;">${data.bookingReference}${data.pnr ? ` / ${data.pnr}` : ''}</strong></td>
            </tr>
          </table>
        </div>

        <div style="padding: 0;">
          <div style="background: ${NAVY}; color: #ffffff; font-size: 11px; font-weight: bold; letter-spacing: 0.5px; padding: 8px 24px;">PASSENGER INFORMATION</div>
          <table style="width: 100%; font-size: 12px; color: #111827; padding: 0 24px; border-collapse: collapse;">
            <tr><td style="padding: 8px 24px 0;color:#6b7280;width:50%;">Name</td><td style="padding: 8px 24px 0; font-weight: bold;">${fullName}</td></tr>
            <tr><td style="padding: 4px 24px 0;color:#6b7280;">Passenger Type</td><td style="padding: 4px 24px 0; font-weight: bold; text-transform: capitalize;">${data.passengerType}</td></tr>
            ${data.pnr ? `<tr><td style="padding: 4px 24px 12px;color:#6b7280;">Frequent Traveller No.</td><td style="padding: 4px 24px 12px; font-weight: bold;">${data.pnr}</td></tr>` : '<tr><td colspan="2" style="padding-bottom:12px;"></td></tr>'}
          </table>
        </div>

        <div>
          <div style="background: ${NAVY}; color: #ffffff; font-size: 11px; font-weight: bold; letter-spacing: 0.5px; padding: 8px 24px;">FLIGHT DETAILS</div>
          <div style="padding: 12px 24px;">
            <p style="font-size: 13px; font-weight: bold; color: #111827; margin: 0 0 8px;">${data.flightNo} <span style="background:#16a34a; color:#fff; font-size:9px; font-weight:bold; padding:2px 6px; border-radius:10px; margin-left:6px;">CONFIRMED</span></p>
            <table style="width: 100%; font-size: 12px; color: #111827; border-collapse: collapse;">
              <tr>
                <td style="padding: 2px 0; color: #6b7280;">From</td>
                <td style="padding: 2px 0; text-align: right;"><strong>${data.origin}</strong>${data.originName ? ` — ${data.originName}` : ''}</td>
              </tr>
              <tr>
                <td style="padding: 2px 0; color: #6b7280;">To</td>
                <td style="padding: 2px 0; text-align: right;"><strong>${data.destination}</strong>${data.destinationName ? ` — ${data.destinationName}` : ''}</td>
              </tr>
              <tr>
                <td style="padding: 2px 0; color: #6b7280;">Date</td>
                <td style="padding: 2px 0; text-align: right; font-weight: bold;">${data.travelDate}</td>
              </tr>
              ${time ? `<tr><td style="padding: 2px 0; color: #6b7280;">Departure / Arrival</td><td style="padding: 2px 0; text-align: right; font-weight: bold;">${time}</td></tr>` : ''}
              <tr>
                <td style="padding: 2px 0; color: #6b7280;">Class</td>
                <td style="padding: 2px 0; text-align: right; font-weight: bold;">Economy (Y)</td>
              </tr>
              ${data.seatNumber ? `<tr><td style="padding: 2px 0; color: #6b7280;">Seat</td><td style="padding: 2px 0; text-align: right; font-weight: bold;">${data.seatNumber}</td></tr>` : ''}
            </table>
          </div>
        </div>

        <div style="padding: 12px 24px; border-top: 1px solid #e5e7eb;">
          <table style="width: 100%; font-size: 12px;">
            <tr>
              <td style="color: #6b7280;">${data.paymentMethod ? `Paid via ${data.paymentMethod}` : 'Fare'}</td>
              <td style="text-align: right; font-size: 14px; font-weight: bold; color: #C0392B;">$${Number(data.fareAmount).toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div style="background: ${NAVY}; padding: 14px 24px; text-align: center;">
          <p style="color: #ffffff; font-size: 12px; font-weight: bold; margin: 0;">Safe Travels! ✈ Thank you for flying with us!</p>
          <p style="color: #cfe0ff; font-size: 9px; margin: 4px 0 0;">Ticket No. ${data.ticketNumber} · Please complete online check-in before arriving at the airport.</p>
        </div>
      </div>
    `;
    }
    buildBookingConfirmationHtml(data) {
        const time = [data.std, data.sta].filter(Boolean).join(' → ');
        return `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1c2e61 0%, #2a3f7f 100%); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; font-size: 18px; margin: 0; letter-spacing: 1px;">ROYAL AIR</h1>
          <p style="color: #cfe0ff; font-size: 12px; margin: 4px 0 0;">Booking Confirmation</p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
          <p style="font-size: 14px; color: #111827;">Dear ${data.passengerName || 'Passenger'},</p>
          <p style="font-size: 13px; color: #4b5563; line-height: 1.5;">
            Your booking ${data.isReturnTrip ? '(return trip leg)' : ''} has been confirmed. Here are your details:
          </p>
          <table style="width: 100%; font-size: 13px; color: #111827; margin-top: 12px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b7280;">Booking Reference</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">${data.bookingReference}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Flight</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">${data.flightNo}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Route</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">${data.origin} → ${data.destination}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Date</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">${data.travelDate}</td></tr>
            ${time ? `<tr><td style="padding: 6px 0; color: #6b7280;">Time</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">${time}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #6b7280;">Amount</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">$${Number(data.totalAmount).toFixed(2)}</td></tr>
          </table>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
            Please arrive at the airport at least 2 hours before departure. Thank you for flying with Royal Air.
          </p>
        </div>
      </div>
    `;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map