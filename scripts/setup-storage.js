require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupStorage() {
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase', 'create_storage_policies.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL commands
    const { error } = await supabase.rpc('exec_sql', {
      sql: sqlContent
    });

    if (error) {
      console.error('Error setting up storage:', error);
      return;
    }

    console.log('Storage bucket and policies created successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupStorage();
