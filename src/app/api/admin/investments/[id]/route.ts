import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        const { data: investment, error } = await supabaseAdmin
            .from('investments')
            .update({
                dividend_rate: data.dividend_rate,
                status: data.status,
                fees: data.fees, // Support fee updates
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Database Error updating investment:', error);
            return NextResponse.json(
                { error: error.message || 'Failed to update investment' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            investment,
        });

    } catch (error) {
        console.error('Error updating investment:', error);
        return NextResponse.json(
            { error: 'Failed to update investment' },
            { status: 500 }
        );
    }
}
