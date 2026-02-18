import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const referralCode = searchParams.get('code');

        if (!referralCode) {
            return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
        }

        // Fetch users who were referred by this code
        const { data: referredUsers, error } = await supabaseAdmin
            .from('users')
            .select('id, name, email, created_at, role')
            .eq('referred_by_code', referralCode)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching referred users:', error);
            return NextResponse.json({ error: 'Failed to fetch referred users' }, { status: 500 });
        }

        return NextResponse.json({ referrals: referredUsers });
    } catch (error) {
        console.error('Referrals API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
