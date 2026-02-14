import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { amount, bank_name, reference_no, payment_mode, status } = await request.json();

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
            bank_name: bank_name || 'N/A',
            reference_no: reference_no || 'N/A',
            payment_mode: payment_mode || 'NEFT',
            date: new Date().toISOString(),
            status: status || 'paid',
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

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { dividendIndex, dividend } = await request.json();

        // Get current investment
        const { data: investment, error: fetchError } = await supabaseAdmin
            .from('investments')
            .select('dividends')
            .eq('id', id)
            .single();

        if (fetchError || !investment) {
            console.error('Fetch Error updating dividend:', fetchError);
            return NextResponse.json(
                { error: fetchError?.message || 'Investment not found' },
                { status: 404 }
            );
        }

        // Update the specific dividend in the array
        const updatedDividends = [...(investment.dividends || [])];
        if (dividendIndex < 0 || dividendIndex >= updatedDividends.length) {
            return NextResponse.json(
                { error: 'Invalid dividend index' },
                { status: 400 }
            );
        }

        updatedDividends[dividendIndex] = {
            ...updatedDividends[dividendIndex],
            ...dividend,
        };

        const { data: updatedInvestment, error: updateError } = await supabaseAdmin
            .from('investments')
            .update({
                dividends: updatedDividends,
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating dividend:', updateError);
            return NextResponse.json(
                { error: 'Failed to update dividend' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            investment: updatedInvestment,
        });

    } catch (error) {
        console.error('Error updating dividend:', error);
        return NextResponse.json(
            { error: 'Failed to update dividend' },
            { status: 500 }
        );
    }
}
