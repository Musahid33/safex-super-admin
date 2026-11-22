export function formatCurrency(value: number, opts: { compact?: boolean; decimals?: number } = {}) {
  const { compact = false, decimals = 0 } = opts;
  if (compact && value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (compact && value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  if (compact && value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatNumber(value: number, compact = false) {
  if (compact && value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (compact && value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString("en-IN");
}

export function formatBytesFromGb(gb: number) {
  if (gb >= 1024) return `${(gb / 1024).toFixed(1)} TB`;
  return `${gb.toFixed(gb < 10 ? 1 : 0)} GB`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function daysUntil(date: string) {
  const diff = new Date(date).getTime() - new Date("2026-11-22").getTime();
  return Math.ceil(diff / 86400000);
}

export function relativeTime(date: string) {
  const diff = new Date("2026-11-22T14:30:00").getTime() - new Date(date).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

export function percent(used: number, limit: number) {
  if (!limit) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 32);
}

export function passwordChecks(password: string) {
  return [
    { label: "Minimum 8 characters", valid: password.length >= 8 },
    { label: "Maximum 15 characters", valid: password.length > 0 && password.length <= 15 },
    { label: "At least one uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "At least one lowercase letter", valid: /[a-z]/.test(password) },
    { label: "At least one number", valid: /[0-9]/.test(password) },
    { label: "At least one special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];
}

export function passwordStrength(password: string) {
  const passed = passwordChecks(password).filter((c) => c.valid).length;
  const score = password.length === 0 ? 0 : Math.round((passed / 6) * 4);
  const labels = ["Empty", "Weak", "Fair", "Good", "Strong"];
  return { score, passed, label: labels[score] ?? "Strong" };
}
