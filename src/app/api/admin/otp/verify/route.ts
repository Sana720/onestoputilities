import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { investmentId, otp } = await request.json();

        if (!investmentId || !otp) {
            return NextResponse.json({ error: 'Investment ID and OTP are required' }, { status: 400 });
        }

        const adminEmail = process.env.COMPANY_EMAIL || 'info@shreeg.com';

        // Check if OTP is valid and not expired
        const { data: otpData, error: otpError } = await supabaseAdmin
            .from('otps')
            .select('*')
            .eq('email', adminEmail)
            .eq('otp', otp)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (otpError || !otpData) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        // OTP is valid, proceed to verify payment
        const { error: updateError } = await supabaseAdmin
            .from('investments')
            .update({ payment_verified: true })
            .eq('id', investmentId);

        if (updateError) {
            console.error('Error updating payment status:', updateError);
            return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
        }

        // Clean up: delete used OTP
        await supabaseAdmin.from('otps').delete().eq('id', otpData.id);

        return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } catch (error) {
        console.error('OTP Verify API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
