require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', 'admin@toolmaster.com')
      .single();

    if (error) throw error;

    console.log('Admin user found:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
