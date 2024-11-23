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
    console.log('Setting up storage...');

    // First, create the exec_sql function
    console.log('Creating exec_sql function...');
    const execSqlPath = path.join(__dirname, '..', 'supabase', 'create_exec_sql_function.sql');
    const execSqlContent = fs.readFileSync(execSqlPath, 'utf8');
    
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: execSqlContent
    });

    if (functionError) {
      console.error('Error creating exec_sql function:', functionError);
      return;
    }

    // Then, create the storage bucket and policies
    console.log('Creating storage bucket and policies...');
    const storagePath = path.join(__dirname, '..', 'supabase', 'create_storage_policies.sql');
    const storageContent = fs.readFileSync(storagePath, 'utf8');

    const { error: storageError } = await supabase.rpc('exec_sql', {
      sql: storageContent
    });

    if (storageError) {
      console.error('Error setting up storage:', storageError);
      return;
    }

    console.log('Storage setup completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupStorage();
