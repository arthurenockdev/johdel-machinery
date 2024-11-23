const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to add this to your .env.local

async function setupSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Create admin user
    const adminEmail = 'admin@example.com'; // Replace with your admin email
    const adminPassword = 'your-secure-password'; // Replace with your admin password

    // Create the user
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });

    if (userError) {
      throw userError;
    }

    console.log('User created successfully');

    // Create profiles table if it doesn't exist
    const { error: tableError } = await supabase
      .from('profiles')
      .select()
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      // Table doesn't exist, create it
      const { error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userData.user.id,
            role: 'admin',
          }
        ]);

      if (createError) {
        throw createError;
      }
      console.log('Profiles table created and admin user added successfully');
    } else {
      // Table exists, just update the user role
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userData.user.id);

      if (updateError) {
        throw updateError;
      }
      console.log('Admin user role updated successfully');
    }

  } catch (error) {
    console.error('Error setting up Supabase:', error);
    process.exit(1);
  }
}

setupSupabase();
