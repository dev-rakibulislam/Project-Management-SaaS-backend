export interface CancelBookingPayload {
	bookingId?: string;
	userId?: string; // Optional: Pass to ensure users can only cancel their own bookings
}
