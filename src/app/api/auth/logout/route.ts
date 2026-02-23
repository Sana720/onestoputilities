import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { userId, email, role } = await request.json();

        if (!userId || !email) {
            return NextResponse.json({ error: 'Missing user details' }, { status: 400 });
        }

        // Record staff activity log for logout
        if (role === 'admin' || role === 'manager') {
            const userAgent = request.headers.get('user-agent') || 'unknown';
            const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

            await supabaseAdmin
                .from('staff_activity_logs')
                .insert({
                    user_id: userId,
                    email: email,
                    role: role,
                    action: 'LOGOUT',
                    user_agent: userAgent,
                    ip_address: ipAddress
                });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout logging error:', error);
        return NextResponse.json({ error: 'Failed to log logout' }, { status: 500 });
    }
}
