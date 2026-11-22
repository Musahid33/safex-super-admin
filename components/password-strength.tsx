"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { passwordChecks, passwordStrength } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Password strength meter with the live policy checklist.
 * Shared by the create-company wizard and the profile password tab.
 */
export function PasswordStrength({
  password,
  marker = "dot",
}: {
  password: string;
  /** How an unmet rule is drawn: a hollow dot, or a muted cross. */
  marker?: "dot" | "cross";
}) {
  const strength = passwordStrength(password);
  const checks = passwordChecks(password);

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-foreground">Password strength</span>
        <span
          className={cn(
            "text-[11px] font-semibold",
            strength.score >= 3 ? "text-success" : strength.score >= 2 ? "text-warning" : "text-destructive",
          )}
        >
          {strength.label}
        </span>
      </div>
      <Progress
        value={(strength.score / 4) * 100}
        className="mt-2"
        indicatorClassName={cn(
          strength.score >= 3 ? "bg-success" : strength.score >= 2 ? "bg-warning" : "bg-destructive",
        )}
      />
      <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {checks.map((check) => (
          <li key={check.label} className="flex items-center gap-1.5 text-[11px]">
            {check.valid ? (
              <CheckCircle2 className="size-3 shrink-0 text-success" />
            ) : marker === "cross" ? (
              <XCircle className="size-3 shrink-0 text-muted-foreground/50" />
            ) : (
              <span className="flex size-3 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40" />
            )}
            <span className={check.valid || marker === "cross" ? "text-muted-foreground" : "text-muted-foreground/70"}>
              {check.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
