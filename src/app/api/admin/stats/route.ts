import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'all';
        const product = searchParams.get('product') || 'all';

        let query = supabaseAdmin
            .from('investments')
            .select('investment_amount, status, product_name, email, id, dividends(amount, status), historical_dividends(amount, status)');

        if (search) {
            query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,payment_reference.ilike.%${search}%,id.ilike.%${search}%`);
        }
        if (status !== 'all') {
            query = query.eq('status', status);
        }
        if (product !== 'all') {
            if (product === 'TRADERG ASSET') {
                // Assuming TRADERG ASSET maps to null or other default
            } else {
                query = query.eq('product_name', product);
            }
        }

        const { data: investments, error } = await query;

        if (error) {
            throw error;
        }

        const totalInvestment = investments.reduce((sum, inv) => sum + Number(inv.investment_amount), 0);
        const totalClients = new Set(investments.map((inv: any) => inv.email)).size;
        const activeInvestmentsCount = investments.filter((inv: any) => inv.status === 'active').length;

        let totalDividendsPaid = 0;
        investments.forEach((inv: any) => {
            const divs = [...(inv.dividends || []), ...(inv.historical_dividends || [])];
            divs.forEach((d: any) => {
                if (d.status === 'paid') totalDividendsPaid += Number(d.amount || 0);
            });
        });

        const products = Array.from(new Set(investments.map((inv: any) => inv.product_name || 'TRADERG ASSET')));

        return NextResponse.json({
            success: true,
            stats: {
                totalInvestment,
                totalClients,
                activeInvestmentsCount,
                totalDividendsPaid
            },
            products
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
