const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing env variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkShares() {
  const { data, error } = await supabase
    .from('investments')
    .select('id, full_name, investment_amount, number_of_shares, product_name')
    .limit(10);

  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
}

checkShares();
