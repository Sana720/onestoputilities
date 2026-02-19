import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Fetch investments for the user
        const { data: investments, error } = await supabaseAdmin
            .from('investments')
            .select('*, users(kyc_verified)')
            .eq('email', email)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching investments:', error);
            return NextResponse.json(
                { error: 'Failed to fetch investments' },
                { status: 500 }
            );
        }

        // Fetch admin signature URL (using supabaseAdmin to bypass RLS)
        const { data: adminData } = await supabaseAdmin
            .from('users')
            .select('signature_url')
            .eq('role', 'admin')
            .limit(1)
            .single();

        return NextResponse.json({
            success: true,
            investments: investments || [],
            admin_signature_url: adminData?.signature_url || null
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch investments' },
            { status: 500 }
        );
    }
}
