
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual env loading
const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
        env[key.trim()] = value.join('=').trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking schema for table: investments...');

    // We can use a query to check for columns
    const { data, error } = await supabase
        .from('investments')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching investments:', error);
        // Sometimes selection fails if columns are missing or if table doesn't exist
        return;
    }

    if (data && data.length > 0) {
        console.log('Columns found in record:', Object.keys(data[0]));
    } else {
        console.log('No records found. Trying another method to check columns...');
        // Try to get one specific new column
        const { error: colError } = await supabase
            .from('investments')
            .select('aadhar_url')
            .limit(1);

        if (colError) {
            console.log('Column aadhar_url NOT found in schema.');
            console.error(colError.message);
        } else {
            console.log('Column aadhar_url FOUND in schema.');
        }
    }
}

checkSchema().catch(console.error);
