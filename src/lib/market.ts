/**
 * Checks if the Indian stock market (NSE/BSE) is currently open.
 * Market Hours: 9:15 AM - 3:30 PM (IST)
 * Working Days: Monday - Friday
 */
export const isMarketOpen = (): boolean => {
    // Get current time in UTC
    const now = new Date();

    // Convert to IST (UTC +5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);

    // Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const day = istTime.getUTCDay();
    const hours = istTime.getUTCHours();
    const minutes = istTime.getUTCMinutes();

    // Check if it's weekend
    if (day === 0 || day === 6) return false;

    // Convert hours and minutes to a single value for comparison
    const currentTimeValue = hours * 60 + minutes;
    const openTimeValue = 9 * 60 + 15; // 09:15
    const closeTimeValue = 15 * 60 + 30; // 15:30

    return currentTimeValue >= openTimeValue && currentTimeValue < closeTimeValue;
};
