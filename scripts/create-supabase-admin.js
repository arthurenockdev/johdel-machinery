require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const email = 'admin@toolmaster.com';
  const password = 'Admin@123'; // More secure password
  const userId = '7ab6c053-e9d5-40bf-9bd2-194769abe296';

  try {
    // Update user's password
    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      { password: password }
    );

    if (authError) {
      console.error('Error updating password:', authError.message);
      return;
    }

    console.log('Password updated successfully!');
    console.log('Email:', email);
    console.log('Password:', password);

    // Ensure admin role is set
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        role: 'admin',
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error updating profile:', profileError.message);
      return;
    }

    console.log('Admin role confirmed!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
