"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  UNIMPLEMENTED_TITLE,
  UnimplementedBadge,
} from "@/components/ui/unimplemented-badge";
import { PageHeader } from "@/components/layout/page-header";
import { formatJPY } from "@/lib/utils";
import { DEFAULT_RULE_SET, DEPARTMENTS } from "@/lib/workflow-data";
import {
  APPROVER_ROLE_LABEL,
  type ApproverRole,
} from "@/lib/types/workflow";
import { WorkflowNav } from "./workflow-nav";

const ROLES = Object.keys(APPROVER_ROLE_LABEL) as ApproverRole[];

function RoleSelect({
  value,
  onChange,
}: {
  value: ApproverRole;
  onChange: (v: ApproverRole) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ApproverRole)}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {APPROVER_ROLE_LABEL[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function WorkflowRules() {
  const [rules, setRules] = React.useState(DEFAULT_RULE_SET);

  return (
    <>
      <PageHeader
        title="承認ワークフロー"
        description="承認ルールを設定します（金額・部門・役職・経理確認・最終承認者）。"
        actions={
          <Button disabled title={UNIMPLEMENTED_TITLE}>
            設定を保存 <UnimplementedBadge />
          </Button>
        }
      />
      <WorkflowNav />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 金額別承認 */}
        <Card>
          <CardHeader>
            <CardTitle>金額別承認</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setRules((r) => ({
                  ...r,
                  amount_tiers: [
                    ...r.amount_tiers,
                    {
                      id: `AT-${Date.now()}`,
                      min_amount: 0,
                      approver_role: "manager",
                    },
                  ],
                }))
              }
            >
              <Plus /> 追加
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {rules.amount_tiers.map((t, i) => (
              <div key={t.id} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {formatJPY(t.min_amount)} 以上
                </span>
                <Input
                  type="number"
                  className="tabular w-32 text-right"
                  value={t.min_amount}
                  onChange={(e) =>
                    setRules((r) => {
                      const ts = [...r.amount_tiers];
                      ts[i] = {
                        ...ts[i],
                        min_amount: Number(e.target.value) || 0,
                      };
                      return { ...r, amount_tiers: ts };
                    })
                  }
                />
                <RoleSelect
                  value={t.approver_role}
                  onChange={(v) =>
                    setRules((r) => {
                      const ts = [...r.amount_tiers];
                      ts[i] = { ...ts[i], approver_role: v };
                      return { ...r, amount_tiers: ts };
                    })
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="削除"
                  onClick={() =>
                    setRules((r) => ({
                      ...r,
                      amount_tiers: r.amount_tiers.filter(
                        (_, x) => x !== i,
                      ),
                    }))
                  }
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 部門別承認 */}
        <Card>
          <CardHeader>
            <CardTitle>部門別承認</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEPARTMENTS.map((d) => {
              const rule = rules.department_rules.find(
                (x) => x.department === d,
              );
              return (
                <div key={d} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-foreground">{d}</span>
                  <RoleSelect
                    value={rule?.approver_role ?? "department_head"}
                    onChange={(v) =>
                      setRules((r) => {
                        const exists = r.department_rules.some(
                          (x) => x.department === d,
                        );
                        const department_rules = exists
                          ? r.department_rules.map((x) =>
                              x.department === d
                                ? { ...x, approver_role: v }
                                : x,
                            )
                          : [
                              ...r.department_rules,
                              {
                                id: `DR-${d}`,
                                department: d,
                                approver_role: v,
                              },
                            ];
                        return { ...r, department_rules };
                      })
                    }
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 役職別承認 */}
        <Card>
          <CardHeader>
            <CardTitle>役職別承認（単独承認の上限額）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rules.role_rules.map((rr, i) => (
              <div
                key={rr.id}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-sm text-foreground">
                  {APPROVER_ROLE_LABEL[rr.role]}
                </span>
                <Input
                  type="number"
                  className="tabular w-40 text-right"
                  value={rr.can_approve_up_to}
                  onChange={(e) =>
                    setRules((r) => {
                      const rs = [...r.role_rules];
                      rs[i] = {
                        ...rs[i],
                        can_approve_up_to: Number(e.target.value) || 0,
                      };
                      return { ...r, role_rules: rs };
                    })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 経理確認 / 最終承認者 */}
        <Card>
          <CardHeader>
            <CardTitle>経理確認・最終承認者</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  経理確認を必須にする
                </p>
                <p className="text-xs text-muted-foreground">
                  承認後に経理によるチェックを必須化します。
                </p>
              </div>
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={rules.require_accounting_check}
                onChange={(e) =>
                  setRules((r) => ({
                    ...r,
                    require_accounting_check: e.target.checked,
                  }))
                }
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <Label className="mb-0">最終承認者</Label>
              <RoleSelect
                value={rules.final_approver}
                onChange={(v) =>
                  setRules((r) => ({ ...r, final_approver: v }))
                }
              />
            </div>
            <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              ※ 設定の保存および承認経路への反映は現在ご利用いただけません。
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
