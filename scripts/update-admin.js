const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// New admin credentials - customize these
const NEW_ADMIN_EMAIL = 'admin@toolmaster.com';
const NEW_ADMIN_PASSWORD = 'Admin123!@#';

async function updateAdminCredentials() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Find the current admin user
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .single();

    if (profileError) {
      throw profileError;
    }

    if (!profiles) {
      throw new Error('No admin user found');
    }

    // Update the admin's email and password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      profiles.id,
      {
        email: NEW_ADMIN_EMAIL,
        password: NEW_ADMIN_PASSWORD,
      }
    );

    if (updateError) {
      throw updateError;
    }

    console.log('Admin credentials updated successfully!');
    console.log('New Email:', NEW_ADMIN_EMAIL);
    console.log('New Password:', NEW_ADMIN_PASSWORD);

  } catch (error) {
    console.error('Error updating admin credentials:', error);
    process.exit(1);
  }
}

updateAdminCredentials();
