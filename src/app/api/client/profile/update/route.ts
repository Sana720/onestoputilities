
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { email, ...profileData } = data;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Update the users table (name)
        if (profileData.full_name) {
            const { error: userError } = await supabase
                .from('users')
                .update({ name: profileData.full_name })
                .eq('email', email);

            if (userError) {
                console.error('User update error:', userError);
                // Continue anyway as name update is secondary to investment record update
            }
        }

        // 2. Update all investment records for this client
        const { error: investmentError } = await supabase
            .from('investments')
            .update({
                full_name: profileData.full_name,
                father_name: profileData.father_name,
                dob: profileData.dob,
                gender: profileData.gender,
                occupation: profileData.occupation,
                permanent_address: profileData.permanent_address,
                contact_number: profileData.contact_number,
                nominee: profileData.nominee,
                bank_details: profileData.bank_details
            })
            .eq('email', email);

        if (investmentError) {
            console.error('Investment profile update error:', investmentError);
            return NextResponse.json({ error: 'Failed to update investment records' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Profile updated successfully across all records' });
    } catch (error: any) {
        console.error('Profile update catch error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
