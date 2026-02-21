import { NextResponse } from 'next/server';
import { sendEmail, getWelcomeEmailTemplate } from '@/lib/email';

export async function GET() {
    try {
        const testEmail = process.env.SMTP_USER || 'connect@tradergwealth.com';

        const result = await sendEmail({
            to: testEmail,
            subject: 'Trader G Wealth - SMTP Test Email',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #1B8A9F;">SMTP Connection Successful!</h2>
                    <p>This is a test email to verify your GoDaddy cPanel SMTP settings in the investment portal.</p>
                    <p>If you are reading this, your email system is properly configured and ready to go.</p>
                    <hr />
                    <p style="font-size: 12px; color: #777;">Sent at: ${new Date().toLocaleString()}</p>
                </div>
            `
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Test email sent successfully to ${testEmail}`,
                simulated: result.simulated // Will be true if SMTP_PASS is missing
            });
        } else {
            return NextResponse.json({
                success: false,
                error: result.error
            }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
