import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendEmail, getInvestmentApprovedTemplate, getReferralOnboardedTemplate } from '@/lib/email';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        // Fetch current investment to check status change and user details
        const { data: currentInv } = await supabaseAdmin
            .from('investments')
            .select('*, users!inner(email, name, referred_by_code)')
            .eq('id', id)
            .single();

        console.log(`[ADMIN_INV_UPDATE] Found investment ${id}. Current Status: ${currentInv?.status} | New Status: ${data.status}`);

        const { data: investment, error } = await supabaseAdmin
            .from('investments')
            .update({
                dividend_rate: data.dividend_rate,
                status: data.status,
                fees: data.fees, // Support fee updates
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Database Error updating investment:', error);
            return NextResponse.json(
                { error: error.message || 'Failed to update investment' },
                { status: 500 }
            );
        }

        // Check if status changed to approved/active
        const oldStatus = currentInv?.status;
        const newStatus = data.status;
        const isNowApproved = (newStatus === 'approved' || newStatus === 'active') && (oldStatus !== 'approved' && oldStatus !== 'active');

        if (isNowApproved && currentInv) {
            console.log(`[ADMIN_INV_UPDATE] Triggering approval emails for ${id}`);

            // Generate Login URL dynamically
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const loginUrl = `${protocol}://${host}/login`;

            console.log(`[ADMIN_INV_UPDATE] Dynamic Login URL: ${loginUrl}`);

            const clientEmail = (currentInv.users as any)?.email;
            if (clientEmail) {
                await sendEmail({
                    to: clientEmail,
                    subject: 'Investment Approved - TraderG Wealth',
                    html: getInvestmentApprovedTemplate(
                        currentInv.full_name,
                        currentInv.product_name || 'Unlisted Shares',
                        currentInv.investment_amount,
                        currentInv.lock_in_end_date,
                        loginUrl
                    )
                });
            } else {
                console.error(`[ADMIN_INV_UPDATE] ERROR: Client email not found in currentInv for ${id}`);
            }

            // 2. Send Referral Onboarded Email to Referrer (if exists and not ADMIN)
            if (currentInv.users.referred_by_code && currentInv.users.referred_by_code !== 'ADMIN') {
                // Fetch referrer details
                const { data: referrer } = await supabaseAdmin
                    .from('users')
                    .select('email, name')
                    .eq('referral_code', currentInv.users.referred_by_code)
                    .single();

                if (referrer) {
                    await sendEmail({
                        to: referrer.email,
                        subject: 'Your Referral has been Onboarded!',
                        html: getReferralOnboardedTemplate(
                            referrer.name,
                            currentInv.full_name,
                            currentInv.investment_amount
                        )
                    });
                }
            }
        }

        return NextResponse.json({
            success: true,
            investment,
        });

    } catch (error) {
        console.error('Error updating investment:', error);
        return NextResponse.json(
            { error: 'Failed to update investment' },
            { status: 500 }
        );
    }
}
