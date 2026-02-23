
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

        // Check if user is kyc_verified or already has a signature
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('kyc_verified, signature_url')
            .eq('email', email)
            .single();

        if (fetchError) {
            console.error('Error fetching user status:', fetchError);
        }

        const isKycVerified = user?.kyc_verified || false;
        const existingGlobalSignature = user?.signature_url;

        // Fetch existing documents from investments
        const { data: investment, error: invFetchError } = await supabase
            .from('investments')
            .select('client_signature_url, pan_url, aadhar_url, bank_cheque_url, pan_number, aadhar_number')
            .eq('email', email)
            .limit(1)
            .maybeSingle();

        if (invFetchError) {
            console.error('Error fetching investment docs:', invFetchError);
        }

        const hasExistingSignature = !!(existingGlobalSignature || investment?.client_signature_url);
        const hasExistingPanUrl = !!investment?.pan_url;
        const hasExistingAadharUrl = !!investment?.aadhar_url;
        const hasExistingChequeUrl = !!investment?.bank_cheque_url;

        // Use "Not Provided" check for numbers as well
        const hasExistingPanNumber = !!(investment?.pan_number && investment.pan_number !== 'Not Provided' && investment.pan_number !== '—');
        const hasExistingAadharNumber = !!(investment?.aadhar_number && investment.aadhar_number !== 'Not Provided' && investment.aadhar_number !== '—');

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
            bank_details: profileData.bank_details
        };

        // Only allow signature update if NO signature exists yet
        if (profileData.client_signature_url && !hasExistingSignature) {
            updateData.client_signature_url = profileData.client_signature_url;

            // Also update the users table signature if it's the first time
            await supabase
                .from('users')
                .update({ signature_url: profileData.client_signature_url })
                .eq('email', email);
        }

        // One-time update for KYC document URLs
        if (profileData.pan_url && !hasExistingPanUrl) {
            updateData.pan_url = profileData.pan_url;
        }
        if (profileData.aadhar_url && !hasExistingAadharUrl) {
            updateData.aadhar_url = profileData.aadhar_url;
        }
        if (profileData.bank_cheque_url && !hasExistingChequeUrl) {
            updateData.bank_cheque_url = profileData.bank_cheque_url;
        }

        // Only include kyc-sensitive fields if NOT verified OR if missing
        if (!isKycVerified) {
            updateData.full_name = profileData.full_name;

            // Allow updating number if missing, even if we don't know kyc status strictly 
            // but usually verified users will already have these.
            if (!hasExistingPanNumber) {
                updateData.pan_number = profileData.pan_number;
            }
            if (!hasExistingAadharNumber) {
                updateData.aadhar_number = profileData.aadhar_number;
            }
        } else {
            // If verified, still allow one-time update of numbers if they are missing
            if (profileData.pan_number && !hasExistingPanNumber) {
                updateData.pan_number = profileData.pan_number;
            }
            if (profileData.aadhar_number && !hasExistingAadharNumber) {
                updateData.aadhar_number = profileData.aadhar_number;
            }
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
