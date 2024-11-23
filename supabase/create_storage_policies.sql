-- First, create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the buckets table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy for public download access
CREATE POLICY "Allow public download" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'products'
  );

-- Create policy for authenticated uploads
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products'
    AND auth.role() = 'authenticated'
  );

-- Create policy for admin operations (update, delete)
CREATE POLICY "Allow admin operations" ON storage.objects
  FOR ALL USING (
    bucket_id = 'products'
    AND auth.uid() IN (
      SELECT id 
      FROM public.profiles 
      WHERE role = 'admin'
    )
  );

-- Create policy for public list access
CREATE POLICY "Allow public list" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'products'
  );
