import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const product = searchParams.get('product') || 'all';

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const normalizedEmail = (email || '').trim().toLowerCase();

        // Fetch all investments for this user to calculate accurate stats
        let query = supabaseAdmin
            .from('investments')
            .select('product_name, status, investment_amount, number_of_shares, dividends, fees')
            .ilike('email', normalizedEmail);

        if (product !== 'all') {
            query = query.eq('product_name', product);
            if (product === 'TRADERG ASSET') {
                // Assuming TRADERG ASSET is represented by null or just not filtering explicitly depending on how its stored. But strictly `eq` will match exact text. 
            }
        }

        const { data: allInvestments, error } = await query;

        if (error) {
            console.error('Error fetching stats:', error);
            return NextResponse.json({ error: 'Failed to fetch overall statistics' }, { status: 500 });
        }

        // Initialize Stats
        let totalInvested = 0;
        let totalDividends = 0;
        let pendingGains = 0;
        let activeShares = 0;

        const investments = allInvestments || [];

        investments.forEach((inv) => {
            // Total Invested
            if (['active', 'approved'].includes(inv.status)) {
                totalInvested += Number(inv.investment_amount || 0);
            }

            // Unlisted Shares Stats
            if (inv.product_name === 'Unlisted Shares') {
                const dividends: any[] = inv.dividends || [];

                dividends.forEach(div => {
                    if (div.status === 'paid') {
                        totalDividends += Number(div.amount || 0);
                    } else if (div.status === 'pending') {
                        pendingGains += Number(div.amount || 0);
                    }
                });
            }

            // Active Shares
            if (['active', 'approved', 'pending'].includes(inv.status)) {
                activeShares += Number(inv.number_of_shares || 0);
            }
        });

        return NextResponse.json({
            success: true,
            totalInvested,
            totalDividends,
            pendingGains,
            activeShares
        });

    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
