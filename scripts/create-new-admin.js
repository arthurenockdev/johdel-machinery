require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const email = 'admin2@toolmaster.com';
  const password = 'Admin@123456'; // New password

  try {
    // Create new user
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return;
    }

    // Set admin role in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userData.user.id,
        role: 'admin',
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error setting profile:', profileError);
      return;
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
