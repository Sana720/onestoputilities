import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Sanitize contact number (only digits)
        const sanitizedPhone = data.contactNumber.replace(/\D/g, '');

        // Generate temporary password (last 6 digits of contact number)
        const tempPassword = sanitizedPhone.slice(-6);

        // Create user with Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            password: tempPassword,
            email_confirm: true, // Auto-confirm email
        });

        if (authError) {
            console.error('Auth error:', authError);
            return NextResponse.json(
                { error: 'Failed to create user account' },
                { status: 400 }
            );
        }

        // Create user record in users table
        const { error: userError } = await supabaseAdmin
            .from('users')
            .insert({
                id: authData.user.id,
                email: data.email,
                role: 'client',
                name: data.fullName,
            });

        if (userError) {
            console.error('User insert error:', userError);
            // Rollback: delete auth user if user table insert fails
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            return NextResponse.json(
                { error: 'Failed to create user record' },
                { status: 500 }
            );
        }

        // Calculate lock-in dates
        const lockInStartDate = new Date(data.paymentDate);
        const lockInEndDate = new Date(lockInStartDate);
        lockInEndDate.setFullYear(lockInEndDate.getFullYear() + 3);

        // Create investment record
        const { data: investmentData, error: investmentError } = await supabaseAdmin
            .from('investments')
            .insert({
                user_id: authData.user.id,
                full_name: data.fullName,
                father_name: data.fatherName,
                dob: data.dob,
                age: data.age,
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
                investment_amount: data.investmentAmount,
                number_of_shares: data.numberOfShares,
                face_value_per_share: 100,
                payment_mode: data.paymentMode,
                payment_reference: data.paymentReference,
                payment_date: data.paymentDate,
                lock_in_period: 3,
                lock_in_start_date: lockInStartDate.toISOString().split('T')[0],
                lock_in_end_date: lockInEndDate.toISOString().split('T')[0],
                dividend_rate: 0,
                status: 'pending',
                dividends: [],
            })
            .select()
            .single();

        if (investmentError) {
            console.error('Investment insert error:', investmentError);
            return NextResponse.json(
                { error: 'Failed to create investment record' },
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
