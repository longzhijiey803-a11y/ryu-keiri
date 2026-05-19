/**
 * Supabase Database 型（手書きスケルトン）。
 * 実接続時は `supabase gen types typescript` で自動生成に置き換える想定。
 * 列は schema.sql と対応。enum はアプリ側の文字列リテラル union に対応。
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [k: string]: Json }
  | Json[];

interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: { id: string; name: string; registration_number: string | null } & Timestamps;
        Insert: { id?: string; name: string; registration_number?: string | null };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>;
      };
      users: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          email: string;
          role: string; // admin | accounting_manager | accounting | applicant | viewer
        } & Timestamps;
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          email: string;
          role?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      transactions: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          kind: string;
          status: string;
          partner_id: string | null;
          amount: number;
          tax_category: string;
          transaction_date: string;
          due_date: string | null;
          assignee_id: string | null;
          department: string | null;
          project: string | null;
          memo: string | null;
          journal_status: string;
        } & Timestamps;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      journal_entries: {
        Row: {
          id: string;
          org_id: string;
          entry_date: string;
          description: string;
          status: string;
          debit_total: number;
          credit_total: number;
          related_transaction_id: string | null;
          memo: string | null;
          created_by: string;
        } & Timestamps;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      invoices: {
        Row: {
          id: string;
          org_id: string;
          direction: string; // issued | received
          number: string;
          partner_id: string;
          subject: string;
          issue_date: string | null;
          receipt_date: string | null;
          due_date: string;
          subtotal: number;
          tax: number;
          total: number;
          status: string;
          payment_state: string;
          assignee_id: string | null;
        } & Timestamps;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      expense_claims: {
        Row: {
          id: string;
          org_id: string;
          subject: string;
          applicant_id: string;
          department: string;
          claim_date: string;
          status: string;
          pay_state: string;
          total: number;
          memo: string | null;
        } & Timestamps;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      approvals: {
        Row: {
          id: string;
          org_id: string;
          subject_type: string; // expense_claim | invoice | transaction
          subject_id: string;
          step_order: number;
          approver_id: string;
          role: string;
          status: string; // pending | approved | rejected | skipped
          acted_at: string | null;
          comment: string | null;
        } & Timestamps;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      bank_transactions: {
        Row: {
          id: string;
          org_id: string;
          account_id: string;
          txn_date: string;
          dir: string; // in | out
          description: string;
          partner_guess: string | null;
          deposit: number;
          withdrawal: number;
          balance: number;
          recon_status: string;
          related_invoice_id: string | null;
          related_transaction_id: string | null;
          memo: string | null;
        } & Timestamps;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      attachments: {
        Row: {
          id: string;
          org_id: string;
          file_name: string;
          mime_type: string;
          size_bytes: number;
          storage_path: string;
          doc_type: string;
          status: string;
          partner_name: string | null;
          amount: number | null;
          transaction_date: string | null;
          registration_number: string | null;
          related_transaction_id: string | null;
          related_journal_id: string | null;
          uploaded_by: string;
        } & Timestamps;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      audit_logs: {
        Row: {
          id: string;
          org_id: string;
          at: string;
          user_id: string;
          action: string;
          target: string;
          changes: Json;
          ip: string | null;
          detail: string | null;
        };
        Insert: Record<string, unknown>;
        Update: never; // 追記専用（更新・削除不可）
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
