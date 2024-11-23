require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const email = 'admin@toolmaster.com';
  const password = 'Admin@123456'; // New password
  const userId = '7ab6c053-e9d5-40bf-9bd2-194769abe296';

  try {
    // Delete existing user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return;
    }
    console.log('Existing user deleted');

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

    console.log('User created:', userData.user.id);

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

    console.log('Success! Use these credentials to log in:');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
