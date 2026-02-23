import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const { data: logs, error, count } = await supabaseAdmin
            .from('staff_activity_logs')
            .select('*, users(name)', { count: 'exact' })
            .neq('role', 'admin')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Error fetching logs:', error);
            return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            logs,
            total: count
        });
    } catch (error) {
        console.error('Logs API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
