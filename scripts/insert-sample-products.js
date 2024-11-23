require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const sampleProducts = [
    {
      name: 'Power Drill Set',
      description: 'Professional-grade power drill with multiple attachments',
      price: 199.99,
      category: 'Tools',
      stock: 50,
      image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400'
    },
    {
      name: 'Safety Goggles',
      description: 'Impact-resistant safety goggles with UV protection',
      price: 29.99,
      category: 'Safety Equipment',
      stock: 200,
      image_url: 'https://images.unsplash.com/photo-1583624049251-096ea3fc59b9?w=400'
    },
    {
      name: 'Industrial Lathe Machine',
      description: 'High-precision metal lathe for professional use',
      price: 2499.99,
      category: 'Machinery',
      stock: 5,
      image_url: 'https://images.unsplash.com/photo-1617781377265-e4122e34db4a?w=400'
    },
    {
      name: 'Digital Multimeter',
      description: 'Professional digital multimeter for electrical measurements',
      price: 79.99,
      category: 'Electronics',
      stock: 30,
      image_url: 'https://images.unsplash.com/photo-1598994392875-3f65e82437b7?w=400'
    }
  ];

  try {
    const { error } = await supabase
      .from('products')
      .insert(sampleProducts);

    if (error) {
      console.error('Error inserting sample products:', error);
      return;
    }

    console.log('Sample products inserted successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
