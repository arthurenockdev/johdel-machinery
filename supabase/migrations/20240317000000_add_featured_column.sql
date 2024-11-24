-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add featured column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'featured'
    ) THEN 
        ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Update three most recent products to be featured
WITH recent_products AS (
    SELECT id 
    FROM products 
    ORDER BY created_at DESC 
    LIMIT 3
)
UPDATE products 
SET featured = true 
WHERE id IN (SELECT id FROM recent_products);
