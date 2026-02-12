import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
    try {
        // In production, verify admin authentication here
        const { data: investments, error } = await supabaseAdmin
            .from('investments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching investments:', error);
            return NextResponse.json(
                { error: 'Failed to fetch investments' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            investments: investments || [],
        });

    } catch (error) {
        console.error('Error fetching investments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch investments' },
            { status: 500 }
        );
    }
}
