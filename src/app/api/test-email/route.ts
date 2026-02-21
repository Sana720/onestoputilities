import { NextRequest, NextResponse } from 'next/server';
import {
    sendEmail,
    getWelcomeEmailTemplate,
    getInvestmentApprovedTemplate,
    getReferralAppliedTemplate,
    getReferralOnboardedTemplate,
    getOTPEmailTemplate
} from '@/lib/email';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const to = searchParams.get('to') || process.env.SMTP_USER || 'connect@tradergwealth.com';
        const type = searchParams.get('type') || 'generic';

        // Generate Login URL dynamically for testing
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const loginUrl = `${protocol}://${host}/login`;

        let subject = 'Trader G Wealth - SMTP Test';
        let html = '';

        switch (type) {
            case 'welcome':
                subject = 'Welcome to Trader G Wealth - Application Received';
                html = getWelcomeEmailTemplate('Test User', to, 'Last 6 digits of your mobile', loginUrl);
                break;
            case 'approved':
                subject = 'Investment Approved - Trader G Wealth';
                html = getInvestmentApprovedTemplate('Test User', 'Unlisted Shares', 500000, new Date().toISOString(), loginUrl);
                break;
            case 'referral_applied':
                subject = 'New Referral Activity at Trader G Wealth';
                html = getReferralAppliedTemplate('Referrer Name', 'Applicant Name');
                break;
            case 'referral_onboarded':
                subject = 'Your Referral has been Onboarded!';
                html = getReferralOnboardedTemplate('Referrer Name', 'Referred Name', 500000);
                break;
            case 'otp':
                subject = 'Security: Payment Verification OTP';
                html = getOTPEmailTemplate('123456', 'INV123', 'Manager Name');
                break;
            default:
                html = `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #1B8A9F;">SMTP Connection Successful!</h2>
                        <p>This is a GENERIC test email to verify your GoDaddy cPanel SMTP settings.</p>
                        <p>To test specific templates, use: <code>?to=YOUR_EMAIL&type=welcome</code> (or approved, otp, referral_applied, referral_onboarded)</p>
                        <hr />
                        <p style="font-size: 12px; color: #777;">Sent at: ${new Date().toLocaleString()}</p>
                    </div>
                `;
        }

        const result = await sendEmail({ to, subject, html });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Test email (${type}) sent successfully to ${to}`,
                simulated: result.simulated
            });
        } else {
            return NextResponse.json({
                success: false,
                error: result.error
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('[TEST_EMAIL_API] Error:', error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
