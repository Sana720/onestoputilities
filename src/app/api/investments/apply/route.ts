import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', data.email)
            .single();

        let userId = existingUser?.id;
        let tempPassword = '';

        if (!userId) {
            // Create user with Supabase Auth
            const sanitizedPhone = data.contactNumber.replace(/\D/g, '');
            tempPassword = sanitizedPhone.slice(-6);

            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: data.email,
                password: tempPassword,
                email_confirm: true,
                user_metadata: {
                    role: 'client',
                    name: data.fullName
                }
            });

            if (authError) {
                console.error('Auth error:', authError);
                return NextResponse.json(
                    { error: 'Failed to create user account' },
                    { status: 400 }
                );
            }

            userId = authData.user.id;

            // Create user record in users table
            const { error: userError } = await supabaseAdmin
                .from('users')
                .insert({
                    id: userId,
                    email: data.email,
                    role: 'client',
                    name: data.fullName,
                });

            if (userError) {
                console.error('User insert error:', userError);
                await supabaseAdmin.auth.admin.deleteUser(userId);
                return NextResponse.json(
                    { error: 'Failed to create user record' },
                    { status: 500 }
                );
            }
        }

        // Calculate lock-in dates
        const lockInStartDate = new Date(data.paymentDate);
        const lockInEndDate = new Date(lockInStartDate);
        lockInEndDate.setFullYear(lockInEndDate.getFullYear() + 3);

        // Create investment record
        const { data: investmentData, error: investmentError } = await supabaseAdmin
            .from('investments')
            .insert({
                user_id: userId,
                full_name: data.fullName,
                father_name: data.fatherName,
                dob: data.dob,
                age: parseInt(data.age) || 0,
                gender: data.gender,
                occupation: data.occupation,
                permanent_address: data.permanentAddress,
                contact_number: data.contactNumber,
                email: data.email,
                nominee: {
                    name: data.nomineeName,
                    relation: data.nomineeRelation,
                    dob: data.nomineeDob,
                    address: data.nomineeAddress,
                },
                bank_details: {
                    accountNumber: data.accountNumber,
                    bankName: data.bankName,
                    branch: data.branch,
                    ifscCode: data.ifscCode,
                    micrCode: data.micrCode,
                    accountType: data.accountType,
                },
                pan_number: data.panNumber,
                marital_status: data.maritalStatus,
                aadhar_number: data.aadharNumber,
                investment_amount: parseFloat(data.investmentAmount) || 0,
                number_of_shares: parseInt(data.numberOfShares) || 0,
                face_value_per_share: 100,
                payment_mode: data.paymentMode,
                payment_reference: data.paymentReference,
                payment_date: data.paymentDate,
                pan_url: data.panUrl,
                aadhar_url: data.aadharUrl,
                bank_cheque_url: data.bankChequeUrl,
                product_name: data.productName,
                broker_id: data.brokerId,
                broker_name: data.brokerName,
                lock_in_period: 3,
                lock_in_start_date: lockInStartDate.toISOString().split('T')[0],
                lock_in_end_date: lockInEndDate.toISOString().split('T')[0],
                dividend_rate: 0,
                status: 'pending',
                client_signature_url: data.clientSignatureUrl,
                client_signed_at: data.clientSignatureUrl ? new Date().toISOString() : null,
                dividends: [],
            })
            .select()
            .single();

        if (investmentError) {
            console.error('Investment insert error details:', JSON.stringify(investmentError, null, 2));
            return NextResponse.json(
                { error: `Failed to create investment record: ${investmentError.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Application submitted successfully',
            applicationId: investmentData.id,
            credentials: {
                email: data.email,
                tempPassword: tempPassword,
            },
        });

    } catch (error) {
        console.error('Application error:', error);
        return NextResponse.json(
            { error: 'Failed to process application' },
            { status: 500 }
        );
    }
}
