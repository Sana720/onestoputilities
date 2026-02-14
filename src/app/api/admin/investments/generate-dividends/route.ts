import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        // Fetch all active "Unlisted Shares" investments
        const { data: investments, error: fetchError } = await supabaseAdmin
            .from('investments')
            .select('*')
            .eq('product_name', 'Unlisted Shares')
            .eq('status', 'active');

        if (fetchError) {
            console.error('Fetch Error:', fetchError);
            return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
        }

        const DAILY_RATE = 7500 / 30; // ₹250 per day
        const updatedInvestments = [];

        for (const investment of investments) {
            const dividends = investment.dividends || [];
            const paymentDate = new Date(investment.payment_date);
            const today = new Date();

            // We generate dividends for every 10th from the investment date until today
            let currentGenDate = new Date(paymentDate);

            // Move to the first 10th after or on the payment date
            if (currentGenDate.getDate() > 10) {
                // Move to 10th of next month
                currentGenDate.setMonth(currentGenDate.getMonth() + 1);
            }
            currentGenDate.setDate(10);

            let hasChanges = false;
            let lastCycleEndDate = new Date(paymentDate);

            // While generated 10th is in the past or today
            while (currentGenDate <= today) {
                const dateString = currentGenDate.toISOString().split('T')[0];

                // Check if dividend already exists for this cycle (approximate check by month/year)
                const alreadyExists = dividends.some((d: any) => {
                    const dDate = new Date(d.date);
                    return dDate.getMonth() === currentGenDate.getMonth() &&
                        dDate.getFullYear() === currentGenDate.getFullYear();
                });

                if (!alreadyExists) {
                    let amount = 7500;

                    // Calculation logic for the very first dividend
                    const isFirstDividend = dividends.length === 0;
                    if (isFirstDividend) {
                        // Calculate days from paymentDate to this first 10th
                        const diffTime = Math.abs(currentGenDate.getTime() - lastCycleEndDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        amount = diffDays * DAILY_RATE;
                    }

                    dividends.push({
                        amount: Math.round(amount),
                        date: currentGenDate.toISOString(),
                        status: 'pending',
                        bank_name: investment.bank_details?.bankName || 'N/A',
                        reference_no: 'AUTOMATED',
                        payment_mode: 'NEFT'
                    });
                    hasChanges = true;
                }

                // Move to next month's 10th
                currentGenDate.setMonth(currentGenDate.getMonth() + 1);
                currentGenDate.setDate(10); // Ensure it stays on the 10th
            }

            if (hasChanges) {
                const { error: updateError } = await supabaseAdmin
                    .from('investments')
                    .update({ dividends })
                    .eq('id', investment.id);

                if (!updateError) {
                    updatedInvestments.push(investment.id);
                }
            }
        }

        return NextResponse.json({
            success: true,
            updatedCount: updatedInvestments.length,
            ids: updatedInvestments
        });

    } catch (error) {
        console.error('Sync Error:', error);
        return NextResponse.json({ error: 'Failed to sync dividends' }, { status: 500 });
    }
}
