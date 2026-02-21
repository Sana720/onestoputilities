import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendEmail, getOTPEmailTemplate } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { investmentId, managerName } = await request.json();

        if (!investmentId || !managerName) {
            return NextResponse.json({ error: 'Investment ID and Manager Name are required' }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes from now

        const adminEmail = process.env.COMPANY_EMAIL || 'info@shreeg.com';

        // Store OTP in database
        const { error: dbError } = await supabaseAdmin
            .from('otps')
            .insert({
                email: adminEmail,
                otp,
                expires_at: expiresAt
            });

        if (dbError) {
            console.error('Error storing OTP:', dbError);
            return NextResponse.json({
                error: 'Failed to generate OTP. Please ensure the "otps" table exists in your database.'
            }, { status: 500 });
        }

        // Send OTP via email
        const emailResult = await sendEmail({
            to: adminEmail,
            subject: 'Security: Payment Verification OTP',
            html: getOTPEmailTemplate(otp, investmentId, managerName)
        });

        if (!emailResult.success) {
            return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'OTP sent to Admin' });
    } catch (error) {
        console.error('OTP Send API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
