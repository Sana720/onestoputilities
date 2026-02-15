import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { userId, newPassword } = await request.json();

        if (!userId || !newPassword) {
            return NextResponse.json(
                { error: 'User ID and new password are required' },
                { status: 400 }
            );
        }

        // Update password in Supabase Auth
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: newPassword
        });

        if (authError) {
            console.error('Auth update error:', authError);
            return NextResponse.json(
                { error: 'Failed to update password' },
                { status: 500 }
            );
        }

        // Update password_reset_required flag in users table
        const { error: userError } = await supabaseAdmin
            .from('users')
            .update({ password_reset_required: false })
            .eq('id', userId);

        if (userError) {
            console.error('User table update error:', userError);
            // We don't return error here because auth was successful
        }

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Update password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
