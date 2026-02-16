import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const { userId, verified } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('users')
            .update({ kyc_verified: verified })
            .eq('id', userId);

        if (error) {
            console.error('Error updating KYC status:', error);
            // If the column doesn't exist yet, this will fail. 
            // The user needs to run the SQL in the implementation plan.
            return NextResponse.json({ error: 'Failed to update KYC status. Ensure the kyc_verified column exists in the users table.' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: `KYC ${verified ? 'verified' : 'unverified'} successfully` });
    } catch (error) {
        console.error('KYC verify API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
