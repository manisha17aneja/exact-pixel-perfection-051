create or replace function public.gen_code(prefix text) returns text language sql volatile set search_path = public as $$
  select prefix || '-' || upper(substr(md5(random()::text), 1, 6))
$$;

create table public.leads (id text primary key default public.gen_code('LD'), name text not null, company text not null default '', source text not null default 'Manual', route text not null default '', value numeric not null default 0, status text not null default 'New', owner text not null default '', created_at timestamptz not null default now());
create table public.customers (id text primary key default public.gen_code('CU'), name text not null, contact text not null default '', city text not null default '', shipments int not null default 0, revenue numeric not null default 0, outstanding numeric not null default 0, status text not null default 'Active', created_at timestamptz not null default now());
create table public.contacts (id text primary key default public.gen_code('CT'), name text not null, role text not null default '', company text not null default '', phone text not null default '', email text not null default '', created_at timestamptz not null default now());
create table public.followups (id text primary key default public.gen_code('FU'), subject text not null, with_name text not null default '', due text not null default '', owner text not null default '', status text not null default 'Scheduled', created_at timestamptz not null default now());
create table public.quotations (id text primary key default public.gen_code('QT'), customer text not null, lane text not null default '', vehicle text not null default '', amount numeric not null default 0, valid text not null default '', status text not null default 'Draft', created_at timestamptz not null default now());
create table public.bookings (id text primary key default public.gen_code('BK'), customer text not null, lane text not null default '', pickup text not null default '', material text not null default '', weight text not null default '', status text not null default 'Pending', created_at timestamptz not null default now());
create table public.shipments (id text primary key default public.gen_code('SH'), customer text not null, origin text not null default '', dest text not null default '', vehicle text not null default '—', driver text not null default '—', eta text not null default '', weight text not null default '', status text not null default 'Booked', progress int not null default 0, created_at timestamptz not null default now());
create table public.vehicles (reg text primary key, type text not null default '', capacity text not null default '', driver text not null default '—', location text not null default '', service text not null default '', status text not null default 'Available', created_at timestamptz not null default now());
create table public.trips (id text primary key default public.gen_code('TR'), route text not null, km int not null default 0, vehicle text not null default '—', driver text not null default '—', start text not null default '', fuel numeric not null default 0, status text not null default 'Planned', created_at timestamptz not null default now());
create table public.expenses (id text primary key default public.gen_code('EX'), date text not null default '', category text not null, trip text not null default '—', vendor text not null default '', amount numeric not null default 0, status text not null default 'Submitted', created_at timestamptz not null default now());
create table public.invoices (id text primary key default public.gen_code('INV'), customer text not null, shipment text not null default '', issued text not null default '', due text not null default '', amount numeric not null default 0, status text not null default 'Draft', created_at timestamptz not null default now());

do $$ declare t text; begin
  foreach t in array array['leads','customers','contacts','followups','quotations','bookings','shipments','vehicles','trips','expenses','invoices'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "Team members manage %1$s" on public.%1$I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

create type public.app_role as enum ('admin', 'manager', 'dispatcher', 'accountant');
create table public.profiles (id uuid primary key, name text not null default '', email text not null default '', created_at timestamptz not null default now());
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Team can view profiles" on public.profiles for select to authenticated using (true);
create policy "Users update own profile" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid not null, role public.app_role not null, unique (user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create policy "Team can view roles" on public.user_roles for select to authenticated using (true);
create policy "Admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
grant insert, update, delete on public.user_roles to authenticated;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.email);
  insert into public.user_roles (user_id, role) values (new.id, case when (select count(*) from public.user_roles) = 0 then 'admin'::public.app_role else 'dispatcher'::public.app_role end);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

insert into public.leads (id,name,company,source,route,value,status,owner) values
('LD-1042','Rohit Mehra','Mehra Agro Exports','Website','Ludhiana → Mumbai',185000,'New','Ankit S.'),
('LD-1041','Priya Nair','Coastline Pharma','Referral','Kochi → Delhi',420000,'Qualified','Neha R.'),
('LD-1040','Sandeep Gill','Gill Steel Works','Cold call','Jamshedpur → Pune',760000,'Negotiation','Ankit S.'),
('LD-1039','Farah Khan','Urban Retail Co.','LinkedIn','Delhi → Jaipur',95000,'Contacted','Vikas T.'),
('LD-1038','Arjun Rao','Deccan Textiles','Website','Surat → Chennai',310000,'Lost','Neha R.'),
('LD-1037','Kavita Joshi','FreshFarm Foods','Trade show','Nashik → Kolkata',540000,'Qualified','Vikas T.'),
('LD-1036','Imran Sheikh','Sheikh Electricals','Referral','Ahmedabad → Indore',128000,'New','Ankit S.');
insert into public.customers (id,name,contact,city,shipments,revenue,outstanding,status) values
('CU-210','Coastline Pharma','Priya Nair','Kochi',48,3820000,240000,'Active'),
('CU-209','Gill Steel Works','Sandeep Gill','Jamshedpur',112,9150000,0,'Active'),
('CU-208','FreshFarm Foods','Kavita Joshi','Nashik',31,1640000,185000,'Active'),
('CU-207','Urban Retail Co.','Farah Khan','Delhi',9,410000,62000,'On hold'),
('CU-206','Deccan Textiles','Arjun Rao','Surat',67,4270000,0,'Inactive'),
('CU-205','Bharat Cement Ltd.','Mohan Das','Raipur',154,12400000,910000,'Active');
insert into public.contacts (id,name,role,company,phone,email) values
('CT-501','Priya Nair','Logistics Head','Coastline Pharma','+91 98470 11223','priya@coastline.in'),
('CT-502','Sandeep Gill','Owner','Gill Steel Works','+91 98150 44567','sandeep@gillsteel.com'),
('CT-503','Kavita Joshi','Supply Chain Mgr','FreshFarm Foods','+91 98220 77881','kavita@freshfarm.in'),
('CT-504','Mohan Das','Procurement','Bharat Cement Ltd.','+91 94252 33190','mohan@bharatcement.com'),
('CT-505','Farah Khan','Ops Manager','Urban Retail Co.','+91 98110 55602','farah@urbanretail.in');
insert into public.followups (id,subject,with_name,due,owner,status) values
('FU-81','Rate revision call','Gill Steel Works','Today, 15:00','Ankit S.','Today'),
('FU-80','Send reefer quote','FreshFarm Foods','Oct 3','Vikas T.','Scheduled'),
('FU-79','Payment reminder INV-3390','Coastline Pharma','Today, 11:00','Neha R.','Today'),
('FU-78','Contract renewal meeting','Bharat Cement Ltd.','Oct 7','Manisha A.','Scheduled'),
('FU-77','Feedback after delivery','Urban Retail Co.','Oct 1','Vikas T.','Done');
insert into public.quotations (id,customer,lane,vehicle,amount,valid,status) values
('QT-2207','Gill Steel Works','Jamshedpur → Pune','32 ft MXL',148000,'Oct 10','Sent'),
('QT-2206','FreshFarm Foods','Nashik → Kolkata','Reefer 32 ft',212000,'Oct 8','Draft'),
('QT-2205','Coastline Pharma','Kochi → Delhi','Reefer 24 ft',186000,'Oct 5','Accepted'),
('QT-2204','Deccan Textiles','Surat → Chennai','32 ft MXL',132000,'Sep 30','Rejected'),
('QT-2203','Bharat Cement Ltd.','Raipur → Hyderabad','Trailer 40 ft',165000,'Oct 12','Accepted');
insert into public.bookings (id,customer,lane,pickup,material,weight,status) values
('BK-9031','Bharat Cement Ltd.','Raipur → Hyderabad','Oct 4, 08:00','Cement bags','28 t','Confirmed'),
('BK-9030','FreshFarm Foods','Nashik → Kolkata','Oct 2, 06:00','Grapes (chilled)','12 t','Confirmed'),
('BK-9029','Coastline Pharma','Kochi → Delhi','Sep 30, 10:00','Medicines','8 t','Completed'),
('BK-9028','Urban Retail Co.','Delhi → Lucknow','Oct 6, 09:00','Apparel cartons','5 t','Pending'),
('BK-9027','Deccan Textiles','Surat → Chennai','Sep 28, 07:00','Fabric rolls','18 t','Cancelled');
insert into public.shipments (id,customer,origin,dest,vehicle,driver,eta,weight,status,progress) values
('SH-58213','Gill Steel Works','Jamshedpur','Pune','MH12 AB 4521','Ramesh Yadav','Oct 3, 18:00','24 t','In transit',62),
('SH-58212','Coastline Pharma','Kochi','Delhi','KL07 CD 9910','Suresh Pillai','Oct 5, 09:00','8 t','In transit',28),
('SH-58211','Bharat Cement Ltd.','Raipur','Nagpur','CG04 EF 3302','Ajay Verma','Oct 2, 14:30','30 t','Delayed',71),
('SH-58210','FreshFarm Foods','Nashik','Kolkata','MH15 GH 7788','Prakash Jadhav','Oct 4, 22:00','12 t','Loading',5),
('SH-58209','Urban Retail Co.','Delhi','Jaipur','DL01 JK 1204','Manoj Kumar','Oct 1, 16:00','4 t','Delivered',100),
('SH-58208','Bharat Cement Ltd.','Raipur','Hyderabad','—','—','Oct 6, 12:00','28 t','Booked',0);
insert into public.vehicles (reg,type,capacity,driver,location,service,status) values
('MH12 AB 4521','32 ft MXL','24 t','Ramesh Yadav','Near Nagpur','Nov 12','On trip'),
('KL07 CD 9910','Reefer 24 ft','10 t','Suresh Pillai','Bengaluru bypass','Oct 28','On trip'),
('CG04 EF 3302','Trailer 40 ft','32 t','Ajay Verma','Bhandara','Oct 9','On trip'),
('DL01 JK 1204','19 ft Container','6 t','Manoj Kumar','Jaipur hub','Dec 2','Available'),
('MH15 GH 7788','Reefer 32 ft','14 t','Prakash Jadhav','Nashik yard','Nov 20','Available'),
('GJ01 LM 5566','Trailer 40 ft','32 t','—','Ahmedabad workshop','Due now','Maintenance');
insert into public.trips (id,route,km,vehicle,driver,start,fuel,status) values
('TR-4412','Jamshedpur → Pune',1640,'MH12 AB 4521','Ramesh Yadav','Sep 30',52000,'In transit'),
('TR-4411','Kochi → Delhi',2690,'KL07 CD 9910','Suresh Pillai','Oct 1',86000,'In transit'),
('TR-4410','Raipur → Nagpur',290,'CG04 EF 3302','Ajay Verma','Oct 1',11000,'Delayed'),
('TR-4409','Delhi → Jaipur',280,'DL01 JK 1204','Manoj Kumar','Oct 1',8200,'Completed'),
('TR-4408','Raipur → Hyderabad',780,'—','—','Oct 4',0,'Planned');
insert into public.expenses (id,date,category,trip,vendor,amount,status) values
('EX-711','Oct 1','Fuel','TR-4411','IOCL Thrissur',38400,'Approved'),
('EX-710','Oct 1','Toll','TR-4412','FASTag',6200,'Approved'),
('EX-709','Sep 30','Repair','—','Shree Auto Works',42500,'Submitted'),
('EX-708','Sep 30','Driver allowance','TR-4410','Ajay Verma',3000,'Submitted'),
('EX-707','Sep 29','Loading labour','TR-4409','Delhi Hub Crew',4500,'Rejected');
insert into public.invoices (id,customer,shipment,issued,due,amount,status) values
('INV-3391','Bharat Cement Ltd.','SH-58190','Sep 18','Oct 3',910000,'Pending'),
('INV-3390','Coastline Pharma','SH-58184','Sep 10','Sep 25',240000,'Overdue'),
('INV-3389','Gill Steel Works','SH-58180','Sep 8','Sep 23',612000,'Paid'),
('INV-3388','FreshFarm Foods','SH-58177','Sep 5','Sep 20',185000,'Overdue'),
('INV-3387','Urban Retail Co.','SH-58209','Oct 1','Oct 16',62000,'Draft'),
('INV-3386','Deccan Textiles','SH-58170','Aug 30','Sep 14',338000,'Paid');