import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { data: records } = await request.json();

        if (!Array.isArray(records)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        const results = {
            success: 0,
            failed: 0,
            errors: [] as any[]
        };

        const normalizeGender = (gender: string) => {
            const g = (gender || '').trim().toLowerCase();
            if (g.startsWith('m')) return 'Male';
            if (g.startsWith('f')) return 'Female';
            if (g.startsWith('o')) return 'Other';
            return 'Male'; // Default
        };

        const generateCode = () => {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        for (const record of records) {
            try {
                // Check if user already exists
                const { data: existingUser } = await supabaseAdmin
                    .from('users')
                    .select('id')
                    .eq('email', record.email)
                    .single();

                let userId = existingUser?.id;

                if (!userId) {
                    // Create user with Supabase Auth
                    const sanitizedPhone = (record.contactNumber || '').replace(/\D/g, '');
                    const tempPassword = sanitizedPhone.slice(-6) || '123456';

                    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                        email: record.email,
                        password: tempPassword,
                        email_confirm: true,
                        user_metadata: {
                            role: 'client',
                            name: record.fullName
                        }
                    });

                    if (authError) throw new Error(`Auth Error: ${authError.message}`);
                    userId = authData.user.id;

                    // Handle referral code (referred_by)
                    let referredBy = record.referralCode || 'ADMIN';
                    if (record.referralCode) {
                        const { data: referee } = await supabaseAdmin
                            .from('users')
                            .select('referral_code')
                            .eq('referral_code', record.referralCode)
                            .single();
                        if (!referee) {
                            referredBy = 'ADMIN';
                        }
                    }

                    // Create user record in users table
                    const { error: userError } = await supabaseAdmin
                        .from('users')
                        .insert({
                            id: userId,
                            email: record.email,
                            role: 'client',
                            name: record.fullName,
                            referral_code: generateCode(),
                            referred_by_code: referredBy,
                            password_reset_required: true
                        });

                    if (userError) {
                        await supabaseAdmin.auth.admin.deleteUser(userId);
                        throw new Error(`User Table Error: ${userError.message}`);
                    }
                }

                // Prepare investment data
                const isUnlisted = record.productName === 'Unlisted Shares';
                const lockInPeriod = isUnlisted ? 3 : 0;
                const lockInStartDate = new Date(record.paymentDate);
                const lockInEndDate = new Date(lockInStartDate);
                if (isUnlisted) {
                    lockInEndDate.setFullYear(lockInEndDate.getFullYear() + 3);
                }

                const { error: invError } = await supabaseAdmin
                    .from('investments')
                    .insert({
                        user_id: userId,
                        full_name: record.fullName,
                        father_name: record.fatherName || 'N/A',
                        dob: record.dob || '1990-01-01',
                        age: parseInt(record.age) || 0,
                        gender: normalizeGender(record.gender),
                        occupation: record.occupation || 'N/A',
                        permanent_address: record.permanentAddress || 'N/A',
                        contact_number: record.contactNumber || 'N/A',
                        email: record.email,
                        marital_status: record.maritalStatus || 'Single',
                        pan_number: record.panNumber || null,
                        aadhar_number: record.aadharNumber || null,
                        pan_url: record.panUrl || null,
                        aadhar_url: record.aadharUrl || null,
                        bank_cheque_url: record.bankChequeUrl || null,
                        client_signature_url: record.clientSignatureUrl || null,
                        nominee: {
                            name: record.nomineeName || 'N/A',
                            relation: record.nomineeRelation || 'N/A',
                            dob: record.nomineeDob || '1990-01-01',
                            address: record.nomineeAddress || 'N/A',
                        },
                        bank_details: {
                            accountNumber: record.accountNumber || 'N/A',
                            bankName: record.bankName || 'N/A',
                            branch: record.branch || 'N/A',
                            ifscCode: record.ifscCode || 'N/A',
                            micrCode: record.micrCode || null,
                            accountType: record.accountType || 'Savings'
                        },
                        investment_amount: parseFloat(record.investmentAmount) || 0,
                        number_of_shares: parseInt(record.numberOfShares) || 0,
                        face_value_per_share: 100,
                        payment_mode: record.paymentMode || 'NEFT',
                        payment_reference: record.paymentReference || 'BULK_IMPORT',
                        payment_date: record.paymentDate,
                        product_name: record.productName || 'Unlisted Shares',
                        demat_account: record.dematAccount || null,
                        broker_id: record.brokerId || null,
                        broker_name: record.brokerName || null,
                        lock_in_period: lockInPeriod,
                        lock_in_start_date: lockInStartDate.toISOString().split('T')[0],
                        lock_in_end_date: lockInEndDate.toISOString().split('T')[0],
                        dividend_rate: isUnlisted ? 18 : 0,
                        status: record.status || 'active',
                        payment_verified: true, // Bulk imports are assumed verified
                        admin_signed_at: new Date().toISOString(), // Bulk imports are assumed approved
                        dividends: []
                    });

                if (invError) throw new Error(`Investment Error: ${invError.message}`);

                results.success++;
            } catch (err: any) {
                results.failed++;
                results.errors.push({ email: record.email, error: err.message });
            }
        }

        return NextResponse.json(results);
    } catch (error: any) {
        console.error('Bulk Import API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
