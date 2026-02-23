import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const normalizedEmail = (email || '').trim().toLowerCase();

        // Fetch investments for the user
        const { data: investments, error, count } = await supabaseAdmin
            .from('investments')
            .select('*, users(kyc_verified)', { count: 'exact' })
            .ilike('email', normalizedEmail)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error('Error fetching investments:', error);
            return NextResponse.json(
                { error: 'Failed to fetch investments' },
                { status: 500 }
            );
        }

        // Fetch admin signature URL (using supabaseAdmin to bypass RLS)
        const { data: adminData } = await supabaseAdmin
            .from('users')
            .select('signature_url')
            .eq('role', 'admin')
            .limit(1)
            .single();

        return NextResponse.json({
            success: true,
            investments: investments || [],
            total: count || 0,
            page,
            limit,
            admin_signature_url: adminData?.signature_url || null
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch investments' },
            { status: 500 }
        );
    }
}
