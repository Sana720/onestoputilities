import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const referralCode = searchParams.get('code');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        if (!referralCode) {
            return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
        }

        // Fetch users who were referred by this code
        const { data: referredUsers, error, count } = await supabaseAdmin
            .from('users')
            .select('id, name, email, created_at, role', { count: 'exact' })
            .eq('referred_by_code', referralCode)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            console.error('Error fetching referred users:', error);
            return NextResponse.json({ error: 'Failed to fetch referred users' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            referrals: referredUsers || [],
            total: count || 0,
            page,
            limit
        });
    } catch (error) {
        console.error('Referrals API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
