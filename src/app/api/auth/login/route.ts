import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Get user role from users table using admin client to bypass RLS
        const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .select('role, name, email, password_reset_required')
            .eq('id', data.user.id)
            .single();

        if (userError || !userData) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Create the user object for response
        const responseUser = {
            id: data.user.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            passwordResetRequired: userData.password_reset_required
        };

        // Sync role to Supabase Auth metadata if missing or different
        if (!data.user.user_metadata?.role || data.user.user_metadata.role !== userData.role) {
            await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
                user_metadata: {
                    role: userData.role,
                    name: userData.name
                }
            });
        }

        // Record staff activity log
        if (userData.role === 'admin' || userData.role === 'manager') {
            const userAgent = request.headers.get('user-agent') || 'unknown';
            const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

            await supabaseAdmin
                .from('staff_activity_logs')
                .insert({
                    user_id: data.user.id,
                    email: userData.email,
                    role: userData.role,
                    action: 'LOGIN',
                    user_agent: userAgent,
                    ip_address: ipAddress
                });
        }

        return NextResponse.json({
            success: true,
            user: responseUser,
            session: data.session,
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
