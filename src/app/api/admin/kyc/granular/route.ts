import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { investmentId, field, verified } = await request.json();

        if (!investmentId || !field) {
            return NextResponse.json({ error: 'Investment ID and field are required' }, { status: 400 });
        }

        const validFields = ['pan', 'aadhar', 'bank_cheque'];
        if (!validFields.includes(field)) {
            return NextResponse.json({ error: 'Invalid field specified' }, { status: 400 });
        }

        const column = `${field}_verified`;

        const { error } = await supabaseAdmin
            .from('investments')
            .update({ [column]: verified })
            .eq('id', investmentId);

        if (error) {
            console.error(`Error updating ${field} verification:`, error);
            return NextResponse.json({
                error: `Failed to update ${field} verification. Ensure the ${column} column exists in the investments table.`
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `${field.toUpperCase()} ${verified ? 'verified' : 'unverified'} successfully`
        });
    } catch (error) {
        console.error('Granular KYC verify API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
