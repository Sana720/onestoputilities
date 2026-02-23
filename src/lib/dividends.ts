export function calculateDividendsForInvestment(investment: any) {
    const dividends = [...(investment.dividends || [])];

    // Optimization: Create a Set of existing "Month-Year" keys for O(1) lookup
    const existingPeriods = new Set(
        dividends.map((d: any) => {
            const dDate = new Date(d.date);
            return `${dDate.getFullYear()}-${dDate.getMonth()}`;
        })
    );

    const paymentDate = new Date(investment.payment_date);
    const today = new Date();

    // Monthly rate calculation based on ₹1,500 per Lakh rule
    const monthlyRate = (investment.investment_amount / 100000) * 1500;
    const DAILY_RATE = monthlyRate / 30;

    // Find the starting payout cycle (the first 10th after investment)
    let currentGenDate = new Date(paymentDate);
    if (currentGenDate.getDate() >= 10) {
        currentGenDate.setMonth(currentGenDate.getMonth() + 1);
    }
    currentGenDate.setDate(10);
    currentGenDate.setHours(0, 0, 0, 0); // Reset time for cleaner comparison

    let lastCycleEndDate = new Date(paymentDate);

    // safety limit: don't generate more than 10 years of dividends
    let loopSafety = 0;
    while (currentGenDate <= today && loopSafety < 500) {
        loopSafety++;
        const periodKey = `${currentGenDate.getFullYear()}-${currentGenDate.getMonth()}`;

        if (!existingPeriods.has(periodKey)) {
            let amount = monthlyRate;

            // Calculation logic for the very first dividend (pro-rata)
            // We treat it as first if there were no previous dividends in the array
            const isFirstInArray = dividends.length === 0;
            if (isFirstInArray) {
                const diffTime = currentGenDate.getTime() - lastCycleEndDate.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 0) {
                    amount = diffDays * DAILY_RATE;
                }
            }

            dividends.push({
                amount: Math.round(amount),
                date: currentGenDate.toISOString(),
                status: 'pending',
                bank_name: investment.bank_details?.bankName || 'N/A',
                reference_no: 'AUTOMATED',
                payment_mode: 'NEFT'
            });

            existingPeriods.add(periodKey);
        }

        // Move to next month's 10th
        currentGenDate.setMonth(currentGenDate.getMonth() + 1);
        currentGenDate.setDate(10);
    }

    return dividends;
}
