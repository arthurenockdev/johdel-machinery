require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const email = 'admin@toolmaster.com';
  
  try {
    // Update user's email confirmation status
    const { data, error } = await supabase.auth.admin.updateUserById(
      '7ab6c053-e9d5-40bf-9bd2-194769abe296',
      { email_confirm: true }
    );

    if (error) {
      return;
    }

    

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
