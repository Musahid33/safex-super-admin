"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Filter,
  Headphones,
  LifeBuoy,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Send,
  Tags,
  Timer,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { PriorityBadge, TicketStatusBadge } from "@/components/status-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { tickets as seedTickets } from "@/lib/data";
import { relativeTime } from "@/lib/format";
import type { TicketMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

const kpis = [
  { label: "Open tickets", value: 3, hint: "2 urgent", icon: LifeBuoy, tone: "bg-info/10 text-info" },
  { label: "In progress", value: 2, hint: "Assigned to team", icon: Clock3, tone: "bg-warning/10 text-warning" },
  { label: "Resolved this week", value: 18, hint: "97% CSAT", icon: CheckCircle2, tone: "bg-success/10 text-success" },
  { label: "Avg. first response", value: "42m", hint: "SLA target 1h", icon: Timer, tone: "bg-primary/10 text-primary" },
];

export function SupportConsole() {
  const [tickets, setTickets] = useState(seedTickets);
  const [selectedId, setSelectedId] = useState(seedTickets[0].id);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [reply, setReply] = useState("");
  const [internalNote, setInternalNote] = useState(false);
  const [sent, setSent] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets
      .filter(
        (ticket) =>
          !q ||
          ticket.subject.toLowerCase().includes(q) ||
          ticket.company.toLowerCase().includes(q) ||
          ticket.id.toLowerCase().includes(q) ||
          ticket.requester.toLowerCase().includes(q),
      )
      .filter((ticket) => status === "all" || ticket.status === status)
      .filter((ticket) => priority === "all" || ticket.priority === priority);
  }, [tickets, query, status, priority]);

  const selected = tickets.find((ticket) => ticket.id === selectedId) ?? filtered[0] ?? tickets[0];

  const sendReply = () => {
    if (!reply.trim()) return;
    const message: TicketMessage = {
      id: `m_${Date.now()}`,
      author: "Priya Sharma",
      role: internalNote ? "Internal note" : "SAFEX Support",
      body: reply.trim(),
      timestamp: new Date("2026-11-22T14:32:00").toISOString(),
      internal: internalNote,
    };
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === selected.id
          ? {
              ...ticket,
              messages: [...ticket.messages, message],
              updatedAt: message.timestamp,
              status: ticket.status === "Open" ? "In progress" : ticket.status,
            }
          : ticket,
      ),
    );
    setReply("");
    setSent(true);
    window.setTimeout(() => setSent(false), 2400);
  };

  const updateStatus = (next: string) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === selected.id ? { ...ticket, status: next as never } : ticket)),
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support"
        description="Respond to company admin requests, track SLAs and keep every tenant unblocked."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
              <Headphones className="size-3.5" /> Canned responses
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="size-3.5" /> New ticket
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-medium text-muted-foreground">{kpi.label}</p>
                  <p className="mt-1.5 text-[22px] font-semibold leading-none tabular tracking-tight text-foreground">
                    {kpi.value}
                  </p>
                  <p className="mt-2 text-[11px] text-muted-foreground">{kpi.hint}</p>
                </div>
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", kpi.tone)}>
                  <Icon className="size-4" />
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[370px_1fr]">
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="space-y-2.5 border-b border-border p-3.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tickets, companies…"
                className="h-9 pl-8 text-[13px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-8 flex-1 text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In progress">In progress</SelectItem>
                  <SelectItem value="Waiting on company">Waiting on company</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-8 flex-1 text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon-sm" aria-label="Filter tickets">
                <Filter className="size-3.5" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {filtered.length} of {tickets.length} tickets
            </p>
          </div>

          <div className="max-h-[620px] flex-1 divide-y divide-border/60 overflow-y-auto scrollbar-thin">
            {filtered.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => setSelectedId(ticket.id)}
                className={cn(
                  "block w-full px-3.5 py-3 text-left transition-colors",
                  selected.id === ticket.id ? "bg-primary/[0.05]" : "hover:bg-muted/40",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-medium text-muted-foreground">{ticket.id}</span>
                  <span className="text-[10px] text-muted-foreground">{relativeTime(ticket.updatedAt)}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] font-medium text-foreground">{ticket.subject}</p>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">{ticket.company}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <PriorityBadge priority={ticket.priority} />
                  <TicketStatusBadge status={ticket.status} />
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MessageSquare className="size-3" />
                    {ticket.messages.length}
                  </span>
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-1.5 px-4 py-12 text-center">
                <LifeBuoy className="size-6 text-muted-foreground" />
                <p className="text-[12px] font-medium text-foreground">No tickets found</p>
                <p className="text-[11px] text-muted-foreground">Try a different search or filter.</p>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{selected.id}</span>
                <PriorityBadge priority={selected.priority} />
                <TicketStatusBadge status={selected.status} />
              </div>
              <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight text-foreground">
                {selected.subject}
              </h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {selected.company} · opened by {selected.requester} · {relativeTime(selected.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Select value={selected.status} onValueChange={updateStatus}>
                <SelectTrigger className="h-8 w-[150px] text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In progress">In progress</SelectItem>
                  <SelectItem value="Waiting on company">Waiting on company</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-muted/20">
            {[
              { label: "Category", value: selected.category, icon: Tags },
              { label: "Assigned to", value: selected.assignedTo, icon: UserRound },
              { label: "Last update", value: relativeTime(selected.updatedAt), icon: Clock3 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="px-4 py-2.5">
                  <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                    <Icon className="size-3" /> {item.label}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] font-medium text-foreground">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="max-h-[400px] space-y-4 overflow-y-auto p-4 scrollbar-thin">
            {selected.messages.map((message) => {
              const isSupport = message.role === "SAFEX Support";
              return (
                <div key={message.id} className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                      isSupport ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {message.author
                      .replace("Dr. ", "")
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[12px] font-semibold text-foreground">{message.author}</p>
                      <Badge variant={isSupport ? "default" : "muted"}>{message.role}</Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {relativeTime(message.timestamp)}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "mt-1.5 rounded-lg border px-3 py-2 text-[12px] leading-relaxed",
                        message.internal
                          ? "border-warning/25 bg-warning/10 text-foreground"
                          : "border-border bg-muted/30 text-foreground",
                      )}
                    >
                      {message.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border p-4">
            {sent && (
              <div className="mb-2 flex items-center gap-2 rounded-lg border border-success/25 bg-success/10 px-3 py-1.5 text-[11px] font-medium text-success">
                <CheckCircle2 className="size-3.5" />
                {internalNote ? "Internal note added" : "Reply sent to the company admin"}
              </div>
            )}
            <Textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder={internalNote ? "Add an internal note (not visible to the company)…" : "Write a reply to the company admin…"}
              className="min-h-[76px] bg-background text-[13px]"
            />
            <div className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                  <Paperclip className="size-3.5" /> Attach
                </Button>
                <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Switch checked={internalNote} onCheckedChange={setInternalNote} aria-label="Internal note" />
                  Internal note
                </label>
              </div>
              <Button size="sm" className="gap-2" onClick={sendReply} disabled={!reply.trim()}>
                <Send className="size-3.5" /> {internalNote ? "Add note" : "Send reply"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center">
        <p className="text-[12px] text-muted-foreground">
          First-response SLA is 1 hour for urgent tickets and 4 hours for high priority. Escalations route to the
          on-call support lead.
        </p>
        <Button variant="link" size="sm" className="gap-1 p-0 text-[12px]">
          View SLA policy <ArrowUpRight className="size-3" />
        </Button>
      </div>
    </div>
  );
}
