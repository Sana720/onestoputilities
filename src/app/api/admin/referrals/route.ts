import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
    try {
        // Fetch all users who have a referred_by_code
        // We also want to get the name of the referrer if possible
        const { data: referrals, error } = await supabaseAdmin
            .from('users')
            .select(`
                id,
                name,
                email,
                created_at,
                referred_by_code
            `)
            .not('referred_by_code', 'is', null)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching admin referrals:', error);
            return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
        }

        // Get unique referrer codes to fetch their names
        const referrerCodes = [...new Set(referrals.map(r => r.referred_by_code))];

        const { data: referrers, error: referrerError } = await supabaseAdmin
            .from('users')
            .select('referral_code, name, email')
            .in('referral_code', referrerCodes);

        if (referrerError) {
            console.error('Error fetching referrer details:', referrerError);
            // We can still continue with just the codes
        }

        const referrerMap = new Map();
        referrers?.forEach(r => referrerMap.set(r.referral_code, r));

        const enrichedReferrals = referrals.map(ref => ({
            ...ref,
            referrer: referrerMap.get(ref.referred_by_code) || { name: 'Unknown', referral_code: ref.referred_by_code }
        }));

        return NextResponse.json({ referrals: enrichedReferrals });
    } catch (error) {
        console.error('Admin Referrals API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
