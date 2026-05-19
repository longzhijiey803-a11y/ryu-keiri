-- ============================================================================
-- Ryu Keiri（竜之介 経理） スキーマ（土台 / 未適用）
-- 想定: Supabase (PostgreSQL)。アプリは現状ダミーデータで稼働中。
-- 文字列リテラル union は CHECK 制約で表現（必要に応じ ENUM 化）。
-- マルチテナント: 全テーブルに org_id を持たせ RLS でテナント分離。
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── 組織・ユーザー ─────────────────────────────────────────────
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  registration_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- users は Supabase Auth の auth.users と 1:1（id = auth.uid()）。
create table users (
  id uuid primary key references auth.users (id) on delete cascade,
  org_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'accounting'
    check (role in ('admin','accounting_manager','accounting','applicant','viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on users (org_id);

-- ── 取引先 ─────────────────────────────────────────────────────
create table partners (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  registration_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on partners (org_id);

-- ── 取引（中核ハブ） ───────────────────────────────────────────
create table transactions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  kind text not null check (kind in
    ('sales','purchase','expense','payment','deposit','transfer')),
  status text not null check (status in
    ('draft','review','approval','scheduled_payment','awaiting_deposit','done','rejected')),
  partner_id uuid references partners (id),
  amount bigint not null,
  tax_category text not null,
  transaction_date date not null,
  due_date date,
  assignee_id uuid references users (id),
  department text,
  project text,
  memo text,
  journal_status text not null default 'unposted'
    check (journal_status in ('unposted','draft','posted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on transactions (org_id, status);

-- ── 仕訳 ───────────────────────────────────────────────────────
create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  entry_date date not null,
  description text not null,
  status text not null check (status in
    ('draft','review','confirmed','revised','voided')),
  debit_total bigint not null default 0,
  credit_total bigint not null default 0,
  related_transaction_id uuid references transactions (id),
  memo text,
  created_by uuid not null references users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- 複式簿記の不変条件
  constraint journal_balanced check (debit_total = credit_total)
);
create table journal_lines (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references journal_entries (id) on delete cascade,
  side text not null check (side in ('debit','credit')),
  account_code text not null,
  account_name text not null,
  sub_account text,
  amount bigint not null,
  tax_category text not null,
  tax_amount bigint not null default 0,
  department text,
  project text
);
create index on journal_lines (entry_id);

-- ── 請求（発行/受領） ──────────────────────────────────────────
create table invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  direction text not null check (direction in ('issued','received')),
  number text not null,
  partner_id uuid not null references partners (id),
  subject text not null,
  issue_date date,
  receipt_date date,
  due_date date not null,
  subtotal bigint not null,
  tax bigint not null,
  total bigint not null,
  status text not null,
  payment_state text not null
    check (payment_state in ('unpaid','partial','scheduled','paid')),
  assignee_id uuid references users (id),
  related_transaction_id uuid references transactions (id),
  related_journal_id uuid references journal_entries (id),
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on invoices (org_id, direction, status);

-- ── 経費申請 ───────────────────────────────────────────────────
create table expense_claims (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  subject text not null,
  applicant_id uuid not null references users (id),
  department text not null,
  claim_date date not null,
  status text not null check (status in
    ('draft','submitted','pending_approval','returned','approved','scheduled','settled','rejected')),
  pay_state text not null check (pay_state in ('unpaid','scheduled','settled')),
  total bigint not null default 0,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table expense_lines (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references expense_claims (id) on delete cascade,
  used_on date not null,
  payee text not null,
  amount bigint not null,
  tax_category text not null,
  account_hint text,
  note text
);

-- ── 承認ステップ（汎用） ───────────────────────────────────────
create table approvals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  subject_type text not null
    check (subject_type in ('expense_claim','invoice','transaction')),
  subject_id uuid not null,
  step_order int not null,
  approver_id uuid not null references users (id),
  role text not null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','skipped')),
  acted_at timestamptz,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on approvals (subject_type, subject_id);
create index on approvals (approver_id, status);

-- ── 銀行口座・入出金 ───────────────────────────────────────────
create table bank_accounts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  name text not null,
  bank_name text not null,
  branch text not null,
  account_type text not null check (account_type in ('ordinary','current','savings')),
  last4 text not null,
  balance bigint not null default 0,
  last_synced_at timestamptz,
  status text not null default 'active'
    check (status in ('active','syncing','error','closed'))
);
create table bank_transactions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  account_id uuid not null references bank_accounts (id) on delete cascade,
  txn_date date not null,
  dir text not null check (dir in ('in','out')),
  description text not null,
  partner_guess text,
  deposit bigint not null default 0,
  withdrawal bigint not null default 0,
  balance bigint not null default 0,
  recon_status text not null default 'unreconciled'
    check (recon_status in ('unreconciled','candidate','reconciled','discrepancy','pending')),
  related_invoice_id uuid references invoices (id),
  related_transaction_id uuid references transactions (id),
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on bank_transactions (org_id, recon_status);

-- ── 証憑（電帳法メタ） ─────────────────────────────────────────
create table attachments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  storage_path text not null, -- Supabase Storage オブジェクトキー
  doc_type text not null check (doc_type in
    ('receipt','invoice','contract','purchase_order','delivery_note','other')),
  status text not null default 'unlinked'
    check (status in ('unlinked','reviewing','linked','archived')),
  partner_name text,
  amount bigint,
  transaction_date date,            -- 電帳法 検索要件
  registration_number text,         -- 適格請求書 登録番号
  related_transaction_id uuid references transactions (id),
  related_journal_id uuid references journal_entries (id),
  uploaded_by uuid not null references users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- 電帳法の検索要件（日付・金額・取引先）に対応するインデックス
create index on attachments (org_id, transaction_date);
create index on attachments (org_id, amount);
create index on attachments (org_id, partner_name);

-- ── 監査ログ（追記専用） ───────────────────────────────────────
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  at timestamptz not null default now(),
  user_id uuid references users (id),
  action text not null,
  target text not null,
  changes jsonb not null default '[]'::jsonb,
  ip inet,
  detail text
);
create index on audit_logs (org_id, at desc);

-- ============================================================================
-- RLS 方針
--   * 全テーブルで RLS 有効。テナント分離は org_id = 現在ユーザーの org。
--   * users から org_id を引くヘルパ関数 current_org() を使用。
--   * 監査ログは INSERT のみ許可（UPDATE/DELETE 不可＝改ざん防止）。
--   * ロール別の細分化（applicant は自分の経費のみ 等）は今後追加。
-- ============================================================================
create or replace function current_org() returns uuid
language sql stable security definer as $$
  select org_id from public.users where id = auth.uid()
$$;

-- 例: 主要テーブルに「同一テナントのみ」ポリシーを適用するパターン
--   alter table transactions enable row level security;
--   create policy tenant_isolation on transactions
--     using (org_id = current_org()) with check (org_id = current_org());
-- 上記を organizations 以外の全テーブルへ展開する（apply は実接続時）。

-- 監査ログ（改ざん防止）:
--   alter table audit_logs enable row level security;
--   create policy audit_insert on audit_logs for insert
--     with check (org_id = current_org());
--   create policy audit_select on audit_logs for select
--     using (org_id = current_org());
--   -- UPDATE / DELETE ポリシーは作成しない（=不可）。
