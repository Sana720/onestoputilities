import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.name || !data.email || !data.phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('leads')
            .insert({
                full_name: data.name,
                email: data.email.toLowerCase().trim(),
                phone: data.phone,
                postcode: data.postcode,
                services: data.services || [],
                status: 'new'
            });

        if (error) {
            console.error('Lead insert error:', error);
            return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Leads API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
