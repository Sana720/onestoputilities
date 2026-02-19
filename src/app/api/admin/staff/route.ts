import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { data: staff, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .in('role', ['admin', 'manager'])
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ staff });
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { email, password, name, role } = data;

        if (!['admin', 'manager'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role, name }
        });

        if (authError) {
            console.error('Auth error:', authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        // Create user in users table
        const { error: userError } = await supabaseAdmin
            .from('users')
            .insert({
                id: authData.user.id,
                email,
                role,
                name,
                password_reset_required: true
            });

        if (userError) {
            console.error('User insert error:', userError);
            // Cleanup auth user if table insert fails
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            return NextResponse.json({ error: 'Failed to create user record' }, { status: 500 });
        }

        return NextResponse.json({ success: true, user: authData.user });
    } catch (error) {
        console.error('Staff creation error:', error);
        return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
    }
}
