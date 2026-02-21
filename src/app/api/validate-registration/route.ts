import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { email, contactNumber, aadharNumber, panNumber, userId } = await request.json();

        const errors: Record<string, string> = {};

        // 1. Check Email in users table
        if (email) {
            const { data: userByEmail } = await supabaseAdmin
                .from('users')
                .select('id')
                .eq('email', email)
                .neq('id', userId || '')
                .maybeSingle();

            if (userByEmail) {
                errors.email = 'An account with this email already exists.';
            }
        }

        // 2. Check Contact Number in investments table
        if (contactNumber) {
            const cleanNumber = contactNumber.replace(/\D/g, '');
            const { data: invByPhone } = await supabaseAdmin
                .from('investments')
                .select('id')
                .neq('user_id', userId || '')
                .or(`contact_number.eq.${contactNumber},contact_number.eq.${cleanNumber}`)
                .maybeSingle();

            if (invByPhone) {
                errors.contactNumber = 'This contact number is already registered.';
            }
        }

        // 3. Check Aadhaar Number in investments table
        if (aadharNumber) {
            const { data: invByAadhar } = await supabaseAdmin
                .from('investments')
                .select('id')
                .eq('aadhar_number', aadharNumber)
                .neq('user_id', userId || '')
                .maybeSingle();

            if (invByAadhar) {
                errors.aadharNumber = 'This Aadhar number is already registered.';
            }
        }

        // 4. Check PAN Number in investments table
        if (panNumber) {
            const { data: invByPan } = await supabaseAdmin
                .from('investments')
                .select('id')
                .eq('pan_number', panNumber)
                .neq('user_id', userId || '')
                .maybeSingle();

            if (invByPan) {
                errors.panNumber = 'This PAN number is already registered.';
            }
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Validation error:', error);
        return NextResponse.json(
            { error: 'Failed to validate registration data' },
            { status: 500 }
        );
    }
}
