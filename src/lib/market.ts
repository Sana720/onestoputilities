/**
 * NSE/BSE Trading Holidays for 2026
 * Format: 'YYYY-MM-DD'
 */
const MARKET_HOLIDAYS_2026 = [
    '2026-01-26', // Republic Day
    '2026-03-03', // Holi
    '2026-03-26', // Shri Ram Navami
    '2026-03-31', // Shri Mahavir Jayanti
    '2026-04-03', // Good Friday
    '2026-04-14', // Ambedkar Jayanti
    '2026-05-01', // Maharashtra Day
    '2026-05-28', // Bakri Id
    '2026-06-26', // Muharram
    '2026-09-14', // Ganesh Chaturthi
    '2026-10-02', // Gandhi Jayanti
    '2026-10-20', // Dussehra
    '2026-11-10', // Diwali-Balipratipada
    '2026-11-24', // Guru Nanak Jayanti
    '2026-12-25', // Christmas
];

/**
 * Checks if the Indian stock market (NSE/BSE) is currently open.
 * Market Hours: 9:15 AM - 3:30 PM (IST)
 * Working Days: Monday - Friday (Excluding Holidays)
 */
export const isMarketOpen = (): boolean => {
    // Get current time
    const now = new Date();

    // Convert to IST (UTC +5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);

    // Format IST date as YYYY-MM-DD for holiday check
    const istDateString = istTime.toISOString().split('T')[0];

    // Check if it's a scheduled holiday
    if (MARKET_HOLIDAYS_2026.includes(istDateString)) return false;

    // Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const day = istTime.getUTCDay();
    const hours = istTime.getUTCHours();
    const minutes = istTime.getUTCMinutes();

    // Check if it's weekend
    if (day === 0 || day === 6) {
        // Special case: Muhurat Trading 2026 (Sunday, Nov 8)
        // Usually 1 hour session around evening. Timing to be notified by exchanges.
        // For now, keeping it closed as it's a special exception.
        if (istDateString === '2026-11-08') {
            // Placeholder: return true if within specific Muhurat hour
            return false;
        }
        return false;
    }

    // Convert hours and minutes to a single value for comparison
    const currentTimeValue = hours * 60 + minutes;
    const openTimeValue = 9 * 60 + 15; // 09:15
    const closeTimeValue = 15 * 60 + 30; // 15:30

    return currentTimeValue >= openTimeValue && currentTimeValue < closeTimeValue;
};
