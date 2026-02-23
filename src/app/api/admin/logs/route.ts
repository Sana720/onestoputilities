import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const search = searchParams.get('search') || '';

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabaseAdmin
            .from('staff_activity_logs')
            .select('*, users(name)', { count: 'exact' })
            .neq('role', 'admin')
            .order('created_at', { ascending: false });

        if (search) {
            query = query.or(`action.ilike.%${search}%,details.ilike.%${search}%`);
        }

        const { data: logs, error, count } = await query.range(from, to);

        if (error) {
            console.error('Error fetching logs:', error);
            return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            logs,
            total: count || 0,
            page,
            limit
        });
    } catch (error) {
        console.error('Logs API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
