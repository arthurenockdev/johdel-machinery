-- Add featured column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Update some products to be featured
UPDATE products 
SET featured = true 
WHERE id IN (
    SELECT id 
    FROM products 
    ORDER BY created_at DESC 
    LIMIT 3
);
