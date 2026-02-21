import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.tradergwealth.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: (process.env.SMTP_PORT || '465') === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'connect@tradergwealth.com',
        pass: process.env.SMTP_PASS || 'connect@123456',
    },
});

interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    console.log(`[EMAIL] Attempting to send to: ${to} | Subject: ${subject}`);

    // If no password, we just log to console (development/placeholder mode)
    if (!process.env.SMTP_PASS) {
        console.warn('[EMAIL] SMTP_PASS is missing. Email will NOT be sent (Simulation mode).');
        console.log('--- EMAIL SIMULATION ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('------------------------');
        return { success: true, simulated: true };
    }

    try {
        const fromEmail = process.env.SMTP_USER || 'connect@tradergwealth.com';
        const info = await transporter.sendMail({
            from: `"TraderG Wealth" <${fromEmail}>`,
            to,
            subject,
            html,
        });
        console.log(`[EMAIL] Success! Message ID: ${info.messageId} | Recipient: ${to}`);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error(`[EMAIL] FAILED for ${to}:`, error.message);
        console.error('[EMAIL] Full Error Details:', JSON.stringify(error, null, 2));
        return { success: false, error };
    }
}

export const ADMIN_EMAILS = [
    'connect@tradergwealth.com',
    'admin@tradergwealth.com',
    'manager@tradergwealth.com'
];

export function getWelcomeEmailTemplate(name: string, email: string, password: string, loginUrl: string) {
    const logoUrl = `${process.env.NEXTAUTH_URL || 'https://tradergwealth.com'}/logo.png`;
    return `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="TraderG Wealth" style="max-height: 80px;" />
        </div>
        <h2 style="color: #1B8A9F; text-align: center;">Welcome to TraderG Wealth!</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your account has been successfully created. We are excited to have you as part of our investment community.</p>
        
        <div style="background-color: #f0f7f8; padding: 25px; border-radius: 12px; margin: 20px 0; border: 1px solid #1B8A9F20;">
            <h3 style="margin-top: 0; color: #1B8A9F; font-size: 16px;">Access Credentials</h3>
            <p style="margin: 10px 0;"><strong>User ID (Email):</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Temporary Password:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 6px; border: 1px solid #ddd; font-weight: bold; color: #1B8A9F;">${password}</code></p>
            <p style="font-size: 11px; color: #666; font-style: italic; margin-top: 15px;">Note: If the password above says "Last 6 digits of your mobile", please use those digits to login. For your security, please change your password after your first login.</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>How to get started:</strong></p>
            <ol>
                <li>Visit our portal: <a href="${loginUrl}" style="color: #1B8A9F; font-weight: bold;">${loginUrl}</a></li>
                <li>Login with the credentials provided above.</li>
                <li>Access your dashboard to track your investments and dividends.</li>
            </ol>
        </div>
        <p>If you have any questions, feel free to contact us at connect@tradergwealth.com.</p>
        <p>Best Regards,<br><strong>TraderG Wealth Team</strong></p>
    </div>
    `;
}

export function getInvestmentApprovedTemplate(name: string, pName: string, amount: number, lockInEndDate: string, loginUrl: string) {
    const logoUrl = `${process.env.NEXTAUTH_URL || 'https://tradergwealth.com'}/logo.png`;
    const isUnlisted = pName === 'Unlisted Shares';

    return `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="TraderG Wealth" style="max-height: 80px;" />
        </div>
        <h2 style="color: #28a745; text-align: center;">Investment Approved!</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Congratulations! Your investment application has been reviewed and approved by our management team.</p>
        
        <div style="background-color: #f8fff9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #28a74520;">
            <h3 style="margin-top: 0; color: #28a745; font-size: 16px;">Investment Details</h3>
            <p style="margin: 10px 0;"><strong>Product:</strong> ${pName}</p>
            <p style="margin: 10px 0;"><strong>Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
            ${isUnlisted ? `<p style="margin: 10px 0;"><strong>Estimated Maturity:</strong> ${new Date(lockInEndDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>` : ''}
        </div>

        <p>Your digital investment agreement is now signed and available for download in your dashboard.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background-color: #1B8A9F; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Login to Download Agreement</a>
        </div>

        <p>Thank you for choosing TraderG Wealth for your financial growth.</p>
        <p>Best Regards,<br><strong>TraderG Wealth Team</strong></p>
    </div>
    `;
}

export function getReferralAppliedTemplate(referrerName: string, applicantName: string) {
    const logoUrl = `${process.env.NEXTAUTH_URL || 'https://tradergwealth.com'}/logo.png`;
    return `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="TraderG Wealth" style="max-height: 80px;" />
        </div>
        <h2 style="color: #1B8A9F; text-align: center;">New Referral Activity!</h2>
        <p>Hello <strong>${referrerName}</strong>,</p>
        <p>Exciting news! <strong>${applicantName}</strong> has just applied to TraderG Wealth using your referral code.</p>
        <p>We will notify you once their application is reviewed and their account is fully onboarded.</p>
        <p>Keep sharing and growing with us!</p>
        <p>Best Regards,<br><strong>TraderG Wealth Team</strong></p>
    </div>
    `;
}

export function getReferralOnboardedTemplate(referrerName: string, referredName: string, amount: number) {
    const logoUrl = `${process.env.NEXTAUTH_URL || 'https://tradergwealth.com'}/logo.png`;
    return `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="TraderG Wealth" style="max-height: 80px;" />
        </div>
        <h2 style="color: #1B8A9F; text-align: center;">Referral Onboarded Successfully!</h2>
        <p>Hello <strong>${referrerName}</strong>,</p>
        <p>Great news! Your referral <strong>${referredName}</strong> has been successfully onboarded and their investment of <strong>₹${amount.toLocaleString('en-IN')}</strong> has been approved.</p>
        <p>Thank you for helping us grow our community. You can track all your referrals in your dashboard.</p>
        <p>Best Regards,<br><strong>TraderG Wealth Team</strong></p>
    </div>
    `;
}

export function getAdminNotificationTemplate(userName: string, userEmail: string) {
    return `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h3 style="color: #d9534f;">New Registration Alert</h3>
        <p>A new user has registered/been onboarded to the system.</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px;">
            <p style="margin: 0;"><strong>User Details:</strong></p>
            <p style="margin: 5px 0;">Name: ${userName}</p>
            <p style="margin: 5px 0;">Email: ${userEmail}</p>
        </div>
        <p>Please check the admin dashboard to review and approve their application.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/admin/dashboard" style="display: inline-block; background-color: #1B8A9F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Admin Dashboard</a></p>
    </div>
    `;
}

export function getOTPEmailTemplate(otp: string, investmentId: string, managerName: string) {
    const logoUrl = `${process.env.NEXTAUTH_URL || 'https://tradergwealth.com'}/logo.png`;
    return `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="TraderG Wealth" style="max-height: 80px;" />
        </div>
        <h2 style="color: #d9534f; text-align: center;">Security: Payment Verification OTP</h2>
        <p>Hello Admin,</p>
        <p>A manager (<strong>${managerName}</strong>) is attempting to verify a payment for Investment ID: <strong>${investmentId}</strong>.</p>
        
        <div style="background-color: #fff5f5; padding: 25px; border-radius: 12px; margin: 20px 0; border: 1px solid #feb2b2; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #c53030; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Verification Code</p>
            <h1 style="margin: 0; color: #2d3748; font-size: 32px; letter-spacing: 5px; font-family: monospace;">${otp}</h1>
            <p style="margin: 10px 0 0 0; font-size: 11px; color: #666; font-style: italic;">This code will expire in 10 minutes.</p>
        </div>

        <p>If you did not expect this request, please ignore this email or contact the technical team.</p>
        <p>Best Regards,<br><strong>TraderG Wealth Security</strong></p>
    </div>
    `;
}
