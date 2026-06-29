import { ConfigService } from '@nestjs/config';
export interface BookingConfirmationEmailData {
    passengerEmail: string;
    passengerName: string;
    bookingReference: string;
    flightNo: string;
    origin: string;
    destination: string;
    travelDate: string;
    std?: string | null;
    sta?: string | null;
    totalAmount: number;
    isReturnTrip?: boolean;
}
export interface TicketEmailData {
    passengerEmail: string;
    passengerTitle?: string | null;
    passengerName: string;
    pnr?: string | null;
    ticketNumber: string;
    bookingReference: string;
    passengerType: string;
    flightNo: string;
    origin: string;
    originName?: string | null;
    destination: string;
    destinationName?: string | null;
    travelDate: string;
    std?: string | null;
    sta?: string | null;
    seatNumber?: string | null;
    fareAmount: number;
    paymentMethod?: string | null;
}
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private readonly resend;
    private readonly fromAddress;
    constructor(configService: ConfigService);
    sendBookingConfirmation(data: BookingConfirmationEmailData): Promise<void>;
    sendTicket(data: TicketEmailData): Promise<void>;
    private buildTicketHtml;
    private buildBookingConfirmationHtml;
}
