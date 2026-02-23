import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { calculateDividendsForInvestment } from '@/lib/dividends';

export async function POST(request: NextRequest) {
    try {
        // Fetch all "Unlisted Shares" investments that are approved or active
        const { data: investments, error: fetchError } = await supabaseAdmin
            .from('investments')
            .select('*')
            .eq('product_name', 'Unlisted Shares')
            .in('status', ['approved', 'active']);

        if (fetchError) {
            console.error('Fetch Error:', fetchError);
            return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
        }
        const updatedInvestments = [];

        for (const investment of investments) {
            const dividends = calculateDividendsForInvestment(investment);

            if (JSON.stringify(dividends) !== JSON.stringify(investment.dividends)) {
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
