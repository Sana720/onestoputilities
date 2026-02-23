import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const { password, adminId } = await request.json();

        if (!password || !adminId) {
            return NextResponse.json(
                { error: 'Password and Admin ID are required' },
                { status: 400 }
            );
        }

        // Verify that the user making the request is an admin
        const { data: adminUser, error: adminError } = await supabaseAdmin
            .from('users')
            .select('role')
            .eq('id', adminId)
            .single();

        if (adminError || adminUser?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized: Only admins can change passwords' },
                { status: 403 }
            );
        }

        // Update the user's password in Supabase Auth
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            params.id,
            { password }
        );

        if (updateError) {
            console.error('Error updating password:', updateError);
            return NextResponse.json(
                { error: updateError.message || 'Failed to update password' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error in change password API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
