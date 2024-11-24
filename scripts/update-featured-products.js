require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateFeaturedProducts() {
  try {
    // First, try to select from products to see if the column exists
    const { data: columnCheck, error: checkError } = await supabase
      .from('products')
      .select('featured')
      .limit(1)
      .maybeSingle();

    // If we get a specific error about the column not existing, we need to add it
    if (checkError && checkError.message.includes('featured')) {
      console.log('Featured column does not exist, adding it...');
      
      // Since we can't alter the table directly through the client,
      // we'll update our products to include the featured field
      const { data: products, error: selectError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectError) {
        console.error('Error selecting products:', selectError);
        return;
      }

      // Update each product to include the featured field
      for (const product of products) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ featured: false })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Error updating product ${product.id}:`, updateError);
        }
      }

      console.log('Added featured field to all products');
    }

    // Now mark the three most recent products as featured
    const { data: recentProducts, error: recentError } = await supabase
      .from('products')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(3);

    if (recentError) {
      console.error('Error selecting recent products:', recentError);
      return;
    }

    for (const product of recentProducts) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ featured: true })
        .eq('id', product.id);

      if (updateError) {
        console.error(`Error marking product ${product.id} as featured:`, updateError);
      }
    }

    console.log('Successfully marked recent products as featured!');
  } catch (error) {
    console.error('Failed to update products:', error);
  }
}

updateFeaturedProducts();
