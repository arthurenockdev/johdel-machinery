require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  try {
    // Create products table
    const { error: createError } = await supabase.rpc('create_products_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          category VARCHAR(100) NOT NULL,
          stock INTEGER NOT NULL DEFAULT 0,
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
        );

        -- Create index for faster searches
        CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin (name gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
      `
    });

    if (createError) {
      console.error('Error creating products table:', createError);
      return;
    }

    console.log('Products table created successfully!');

    // Insert sample products
    const sampleProducts = [
      {
        name: 'Power Drill Set',
        description: 'Professional-grade power drill with multiple attachments',
        price: 199.99,
        category: 'Tools',
        stock: 50,
        image_url: 'https://example.com/images/power-drill.jpg'
      },
      {
        name: 'Safety Goggles',
        description: 'Impact-resistant safety goggles with UV protection',
        price: 29.99,
        category: 'Safety Equipment',
        stock: 200,
        image_url: 'https://example.com/images/safety-goggles.jpg'
      },
      {
        name: 'Industrial Lathe Machine',
        description: 'High-precision metal lathe for professional use',
        price: 2499.99,
        category: 'Machinery',
        stock: 5,
        image_url: 'https://example.com/images/lathe-machine.jpg'
      }
    ];

    const { error: insertError } = await supabase
      .from('products')
      .insert(sampleProducts);

    if (insertError) {
      console.error('Error inserting sample products:', insertError);
      return;
    }

    console.log('Sample products inserted successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
