require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Using service role key for database operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyOrdersTable() {
  try {
    // Query the orders table structure
    const { data, error } = await supabase
      .from('orders')
      .select()
      .limit(1)

    if (error) {
      console.error('Error querying orders table:', error.message)
      return
    }

    console.log('Successfully connected to orders table')

    // Test inserting a sample order
    const testOrder = {
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      status: 'pending',
      payment_reference: 'test-reference',
      total_amount: 1000,
      shipping_address: { address: 'Test Address' },
      items: [{ id: 1, name: 'Test Item' }]
    }

    const { error: insertError } = await supabase
      .from('orders')
      .insert([testOrder])
      .select()

    if (insertError) {
      console.error('Error inserting test order:', insertError.message)
      return
    }

    console.log('Successfully inserted test order')

    // Clean up test order
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('payment_reference', 'test-reference')

    if (deleteError) {
      console.error('Error cleaning up test order:', deleteError.message)
      return
    }

    console.log('Successfully cleaned up test order')
    console.log('Table verification completed successfully!')
  } catch (error) {
    console.error('Verification failed:', error)
  } finally {
    process.exit(0)
  }
}

verifyOrdersTable()
