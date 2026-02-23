import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'all';
        const product = searchParams.get('product') || 'all';

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // In production, verify admin authentication here
        let query = supabaseAdmin
            .from('investments')
            .select('*, users(kyc_verified)', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (search) {
            query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,payment_reference.ilike.%${search}%,id.ilike.%${search}%`);
        }
        if (status !== 'all') {
            query = query.eq('status', status);
        }
        if (product !== 'all') {

            query = query.eq('product_name', product);

            // Handle null products aligning with "TRADERG ASSET" fallback on frontend
            if (product === 'TRADERG ASSET') {
                // Assuming TRADERG ASSET is represented by null or just not filtering explicitly
            }
        }

        const { data: investments, error, count } = await query.range(from, to);

        if (error) {
            console.error('Error fetching investments:', error);
            return NextResponse.json(
                { error: 'Failed to fetch investments' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            investments: investments || [],
            total: count || 0,
            page,
            limit
        });

    } catch (error) {
        console.error('Error fetching investments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch investments' },
            { status: 500 }
        );
    }
}
