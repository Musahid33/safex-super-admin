"use client";

import {
  AlertTriangle,
  BadgeCheck,
  Check,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  Fingerprint,
  Globe2,
  KeyRound,
  Laptop,
  LogOut,
  Mail,
  MapPin,
  Monitor,
  Phone,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import { PasswordStrength } from "@/components/password-strength";
import { TabNav } from "@/components/tab-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { currentUser, loginHistory } from "@/lib/data";
import { formatDateTime, passwordChecks } from "@/lib/format";

const TABS = [
  { value: "profile", label: "Profile", icon: UserRound },
  { value: "security", label: "Security", icon: ShieldCheck },
  { value: "password", label: "Password", icon: KeyRound },
  { value: "history", label: "Login history", icon: Fingerprint },
];

export function ProfilePanel() {
  const [tab, setTab] = useState("profile");
  const [notified, setNotified] = useState<string | null>(null);
  const [mfa, setMfa] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("12 hours");
  const [sessions, setSessions] = useState([
    { id: "s1", device: "MacBook Pro", browser: "Chrome 142", location: "Bengaluru, IN", ip: "103.42.18.204", current: true, lastActive: "Active now" },
    { id: "s2", device: "iPhone 16 Pro", browser: "Safari", location: "Bengaluru, IN", ip: "49.207.18.62", current: false, lastActive: "2 hours ago" },
    { id: "s3", device: "Windows 11", browser: "Edge 142", location: "Mumbai, IN", ip: "103.42.18.209", current: false, lastActive: "2 days ago" },
  ]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const checks = passwordChecks(newPassword);
  const passwordValid = checks.every((check) => check.valid) && newPassword === confirmPassword;

  const notify = (message: string) => {
    setNotified(message);
    window.setTimeout(() => setNotified(null), 2600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-sm">
            {currentUser.initials}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-semibold tracking-tight text-foreground">{currentUser.name}</h1>
              <Badge variant="default">
                <BadgeCheck className="size-3" /> {currentUser.role}
              </Badge>
              <Badge variant="success">
                <CheckCircle2 className="size-3" /> MFA enabled
              </Badge>
            </div>
            <p className="mt-1 text-[12px] text-muted-foreground">
              SAFEX internal platform team · {currentUser.email}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Last sign-in {formatDateTime(currentUser.lastLogin)} · member since {formatDateTime(currentUser.joined)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
            <Download className="size-3.5" /> Download my data
          </Button>
          <Button
            variant="destructive-outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              setSessions((prev) => prev.filter((session) => session.current));
              notify("All other sessions signed out");
            }}
          >
            <LogOut className="size-3.5" /> Sign out other sessions
          </Button>
        </div>
      </div>

      {notified && (
        <div className="flex items-center gap-2 rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-[12px] font-medium text-success">
          <CheckCircle2 className="size-3.5" /> {notified}
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabNav tabs={TABS} />

        <TabsContent value="profile" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Personal information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Full name</Label>
                    <Input defaultValue={currentUser.name} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Job title</Label>
                    <Input defaultValue="Director, Platform Operations" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input defaultValue={currentUser.email} type="email" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input defaultValue={currentUser.phone} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Timezone</Label>
                    <Select defaultValue={currentUser.timezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Language</Label>
                    <Select defaultValue="en-IN">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-IN">English (India)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="hi-IN">हिन्दी</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Bio</Label>
                  <Textarea
                    defaultValue="Super Admin for the SAFEX platform. Owns tenant provisioning, commercial configuration and platform operations."
                    className="min-h-[76px]"
                  />
                </div>
                <div className="flex justify-end border-t border-border pt-3">
                  <Button size="sm" onClick={() => notify("Profile updated")}>
                    Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Access & permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {[
                    "Full platform administration",
                    "Create, edit and suspend tenants",
                    "Manage plans, add-ons and pricing",
                    "Configure SMTP, WhatsApp and payments",
                    "Read and export audit logs",
                  ].map((permission) => (
                    <p key={permission} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <Check className="mt-0.5 size-3 shrink-0 text-success" /> {permission}
                    </p>
                  ))}
                  <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2 text-[11px]">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium text-foreground">{currentUser.role}</span>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg border border-warning/25 bg-warning/10 px-3 py-2 text-[11px] text-warning">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    Super Admin is the highest privilege level on the platform.
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Contact & workspace</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0 text-[12px]">
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-3.5" /> {currentUser.email}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-3.5" /> {currentUser.phone}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Globe2 className="size-3.5" /> {currentUser.timezone}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-3.5" /> Bengaluru, India
                  </p>
                  <div className="mt-2 rounded-lg bg-muted/40 px-3 py-2 text-[11px]">
                    <p className="text-muted-foreground">Workspace</p>
                    <p className="mt-0.5 font-medium text-foreground">SAFEX Platform (production)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3">
                  <div>
                    <p className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                      <Fingerprint className="size-3.5 text-primary" /> Two-factor authentication
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      TOTP authenticator app · enrolled 12 Apr 2023
                    </p>
                  </div>
                  <Switch checked={mfa} onCheckedChange={setMfa} aria-label="Two-factor authentication" />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Session timeout</Label>
                    <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4 hours">4 hours</SelectItem>
                        <SelectItem value="8 hours">8 hours</SelectItem>
                        <SelectItem value="12 hours">12 hours</SelectItem>
                        <SelectItem value="24 hours">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Recovery email</Label>
                    <Input defaultValue="priya.backup@safex.app" type="email" />
                  </div>
                </div>
                <div className="space-y-2 border-t border-border/60 pt-3">
                  <p className="text-[12px] font-medium text-foreground">Notifications</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] text-muted-foreground">Security alerts for new sign-ins</span>
                    <Switch
                      checked={securityAlerts}
                      onCheckedChange={setSecurityAlerts}
                      aria-label="Security alerts"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] text-muted-foreground">Product and release updates</span>
                    <Switch
                      checked={productUpdates}
                      onCheckedChange={setProductUpdates}
                      aria-label="Product updates"
                    />
                  </div>
                </div>
                <div className="flex justify-end border-t border-border pt-3">
                  <Button size="sm" onClick={() => notify("Security preferences saved")}>
                    Save preferences
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Security score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-end justify-between">
                    <span className="text-[24px] font-semibold tabular text-foreground">92</span>
                    <span className="text-[11px] text-success">Strong</span>
                  </div>
                  <Progress value={92} indicatorClassName="bg-success" />
                  <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3 text-success" /> MFA enabled
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3 text-success" /> Password rotated 34 days ago
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3 text-success" /> No failed sign-ins this week
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Recovery codes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    8 of 10 recovery codes unused. Store them in the company password manager.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View codes
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="xl:col-span-3">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle>Active sessions</CardTitle>
                <Badge variant="muted">{sessions.length} sessions</Badge>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {sessions.map((session) => {
                  const DeviceIcon = session.device.includes("iPhone") ? Smartphone : session.device.includes("Mac") ? Laptop : Monitor;
                  return (
                    <div
                      key={session.id}
                      className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <DeviceIcon className="size-4" />
                        </span>
                        <div>
                          <p className="text-[12px] font-medium text-foreground">
                            {session.device} · {session.browser}
                            {session.current && (
                              <Badge variant="success" className="ml-2">
                                This device
                              </Badge>
                            )}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {session.location} · {session.ip} · {session.lastActive}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={session.current}
                        onClick={() => {
                          setSessions((prev) => prev.filter((item) => item.id !== session.id));
                          notify("Session revoked");
                        }}
                      >
                        Revoke
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Change password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-1.5">
                  <Label>Current password</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="Enter your current password"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>New password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="Create a strong password"
                        className="pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Confirm new password</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Re-enter the new password"
                    />
                    {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                      <p className="text-[11px] font-medium text-destructive">Passwords do not match</p>
                    )}
                  </div>
                </div>

                <PasswordStrength password={newPassword} marker="cross" />

                <div className="flex justify-end border-t border-border pt-3">
                  <Button
                    size="sm"
                    disabled={!currentPassword || !passwordValid}
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      notify("Password updated successfully");
                    }}
                  >
                    Update password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Password policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {[
                  "Minimum 8 and maximum 15 characters",
                  "At least one uppercase and one lowercase letter",
                  "At least one number and one special character",
                  "Cannot reuse the last 5 passwords",
                  "Automatically expires every 90 days",
                ].map((rule) => (
                  <p key={rule} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    <ShieldCheck className="mt-0.5 size-3 shrink-0 text-primary" /> {rule}
                  </p>
                ))}
                <div className="mt-2 rounded-lg border border-border bg-muted/30 p-3 text-[11px]">
                  <p className="text-muted-foreground">Last changed</p>
                  <p className="mt-0.5 font-medium text-foreground">19 Oct 2026</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle>Login history</CardTitle>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Successful and failed sign-in attempts for your account
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
                <Download className="size-3.5" /> Export
              </Button>
            </CardHeader>
            <CardContent className="px-0 pb-0 pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-5">Device</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>IP address</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="pr-5 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="pl-5">
                        <span className="flex items-center gap-2 text-[12px] font-medium text-foreground">
                          <Monitor className="size-3.5 text-muted-foreground" />
                          {record.device}
                          {record.current && <Badge variant="success">Current</Badge>}
                        </span>
                      </TableCell>
                      <TableCell className="text-[12px] text-muted-foreground">{record.browser}</TableCell>
                      <TableCell className="text-[12px] text-muted-foreground">{record.location}</TableCell>
                      <TableCell className="font-mono text-[11px] text-muted-foreground">{record.ip}</TableCell>
                      <TableCell className="text-[11px] tabular text-muted-foreground">
                        {formatDateTime(record.timestamp)}
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <Badge variant={record.status === "Success" ? "success" : "destructive"}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
