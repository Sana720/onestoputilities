
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

        // Check if user is kyc_verified
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('kyc_verified')
            .eq('email', email)
            .single();

        if (fetchError) {
            console.error('Error fetching user status:', fetchError);
        }

        const isKycVerified = user?.kyc_verified || false;

        // 1. Update the users table (name)
        // Only update name if NOT kyc_verified
        if (profileData.full_name && !isKycVerified) {
            const { error: userError } = await supabase
                .from('users')
                .update({ name: profileData.full_name })
                .eq('email', email);

            if (userError) {
                console.error('User update error:', userError);
            }
        }

        // Prepare the update object
        const updateData: any = {
            father_name: profileData.father_name,
            dob: profileData.dob,
            gender: profileData.gender,
            occupation: profileData.occupation,
            permanent_address: profileData.permanent_address,
            contact_number: profileData.contact_number,
            nominee: profileData.nominee,
            bank_details: profileData.bank_details,
            client_signature_url: profileData.client_signature_url // Added signature URL
        };

        // Only include kyc-sensitive fields if NOT verified
        if (!isKycVerified) {
            updateData.full_name = profileData.full_name;
            updateData.pan_number = profileData.pan_number;
            updateData.aadhar_number = profileData.aadhar_number;
        }

        // 2. Update all investment records for this client
        const { error: investmentError } = await supabase
            .from('investments')
            .update(updateData)
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
