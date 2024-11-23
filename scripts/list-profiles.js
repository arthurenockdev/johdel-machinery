require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  try {
    // List all profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;

    console.log('Profiles:', data);

    // List all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    console.log('Users:', users);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
