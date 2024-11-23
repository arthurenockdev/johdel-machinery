-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create orders table
create table if not exists "public"."orders" (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null,  
    status text not null default 'pending',
    payment_reference text,
    total_amount integer not null,
    shipping_address jsonb,
    items jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    constraint orders_status_check check (status in ('pending', 'paid', 'cancelled'))
);

-- Set up RLS (Row Level Security)
alter table "public"."orders" enable row level security;

-- Create policies
create policy "Enable read access for all users"
    on orders for select
    using ( auth.uid()::uuid = user_id );

create policy "Enable insert access for authenticated users"
    on orders for insert
    with check ( auth.uid()::uuid = user_id );

create policy "Enable update access for users based on user_id"
    on orders for update
    using ( auth.uid()::uuid = user_id );

-- Create indexes
create index if not exists idx_orders_payment_reference on "public"."orders" using btree (payment_reference);
create index if not exists idx_orders_status on "public"."orders" using btree (status);
create index if not exists idx_orders_user_id on "public"."orders" using btree (user_id);

-- Create function to update timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for updating timestamp
drop trigger if exists on_orders_updated on public.orders;
create trigger on_orders_updated
    before update on public.orders
    for each row execute procedure public.handle_updated_at();
