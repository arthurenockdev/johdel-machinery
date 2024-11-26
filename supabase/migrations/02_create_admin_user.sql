-- Create a function to create an admin user
CREATE OR REPLACE FUNCTION create_admin_user(admin_email TEXT, admin_password TEXT)
RETURNS void AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Insert the user into auth.users
  INSERT INTO auth.users (
    email,
    raw_user_meta_data,
    email_confirmed_at,
    created_at,
    updated_at,
    is_sso_user,
    encrypted_password
  ) VALUES (
    admin_email,
    json_build_object('role', 'admin', 'name', 'Admin User'),
    NOW(),
    NOW(),
    NOW(),
    FALSE,
    crypt(admin_password, gen_salt('bf'))
  ) RETURNING id INTO user_id;

  -- The profile will be created automatically via the trigger
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
