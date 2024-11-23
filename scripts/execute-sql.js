require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSQL() {
  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync(
      path.join(__dirname, 'create-orders-table.sql'),
      'utf8'
    )

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', {
      query: sqlContent
    })

    if (error) {
      console.error('Error executing SQL:', error)
      return
    }

    console.log('Successfully created orders table!')

    // Verify the table exists
    const { data, error: verifyError } = await supabase
      .from('orders')
      .select('id')
      .limit(1)

    if (verifyError) {
      console.error('Error verifying table:', verifyError)
      return
    }

    console.log('Orders table verified successfully!')
  } catch (error) {
    console.error('Failed to execute SQL:', error)
  }
}

executeSQL()
