import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || 'all';

        let query = supabaseAdmin
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (status !== 'all') {
            query = query.eq('status', status);
        }

        if (search) {
            query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Fetch leads error:', error);
            return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
        }

        return NextResponse.json({ leads: data });
    } catch (error) {
        console.error('Admin Leads API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const data = await request.json();
        const { id, status } = data;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing lead ID or status' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('leads')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Update lead error:', error);
            return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Admin Lead Update API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
