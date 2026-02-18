import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { investmentId, amount, payment_reference, payment_date } = data;

        if (!investmentId || !amount || !payment_reference) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Fetch current fees
        const { data: investment, error: fetchError } = await supabaseAdmin
            .from('investments')
            .select('fees')
            .eq('id', investmentId)
            .single();

        if (fetchError || !investment) {
            return NextResponse.json(
                { error: 'Investment not found' },
                { status: 404 }
            );
        }

        const currentFees = investment.fees || [];
        const newFeeEntry = {
            amount: Number(amount),
            payment_reference,
            payment_date: payment_date || new Date().toISOString(),
            status: 'pending',
            created_at: new Date().toISOString()
        };

        const updatedFees = [...currentFees, newFeeEntry];

        const { error: updateError } = await supabaseAdmin
            .from('investments')
            .update({ fees: updatedFees })
            .eq('id', investmentId);

        if (updateError) {
            console.error('Error recording fee payment:', updateError);
            return NextResponse.json(
                { error: 'Failed to record fee payment' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Fee payment recorded successfully and pending verification.'
        });

    } catch (error) {
        console.error('Error processing fee payment:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
