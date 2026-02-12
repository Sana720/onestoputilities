import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { amount } = await request.json();

        // Get current investment
        const { data: investment, error: fetchError } = await supabaseAdmin
            .from('investments')
            .select('dividends')
            .eq('id', id)
            .single();

        if (fetchError || !investment) {
            console.error('Fetch Error adding dividend:', fetchError);
            return NextResponse.json(
                { error: fetchError?.message || 'Investment not found' },
                { status: 404 }
            );
        }

        // Add new dividend to the array
        const currentDividends = investment.dividends || [];
        const newDividend = {
            amount,
            date: new Date().toISOString(),
            status: 'pending',
        };

        const { data: updatedInvestment, error: updateError } = await supabaseAdmin
            .from('investments')
            .update({
                dividends: [...currentDividends, newDividend],
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Error adding dividend:', updateError);
            return NextResponse.json(
                { error: 'Failed to add dividend' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            investment: updatedInvestment,
        });

    } catch (error) {
        console.error('Error adding dividend:', error);
        return NextResponse.json(
            { error: 'Failed to add dividend' },
            { status: 500 }
        );
    }
}
