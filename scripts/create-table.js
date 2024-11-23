require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Using service role key for database operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createOrdersTable() {
  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync(
      path.join(__dirname, 'create-orders-table.sql'),
      'utf8'
    )

    // Execute the SQL commands
    const { data, error } = await supabase
      .rpc('exec_sql', { sql_query: sqlContent })

    if (error) {
      console.error('Error creating table:', error.message)
      return
    }

    console.log('Orders table created successfully!')
  } catch (error) {
    console.error('Failed to create table:', error)
  }
}

createOrdersTable()
