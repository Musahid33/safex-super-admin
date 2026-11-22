"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function LogoutButton({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [signedOut, setSignedOut] = useState(false);

  if (signedOut) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-white/5 text-primary ring-1 ring-white/10">
          <ShieldCheck className="size-6" />
        </span>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-white">You have been signed out</h2>
          <p className="text-[13px] text-slate-400">Your SAFEX Super Admin session ended securely.</p>
        </div>
        <Button onClick={() => setSignedOut(false)} className="mt-1">
          Sign in again
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="size-4 text-muted-foreground" />
            Sign out of SAFEX?
          </DialogTitle>
          <DialogDescription>
            You will need to authenticate again with your Super Admin credentials to access tenant data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setOpen(false);
              setSignedOut(true);
            }}
          >
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
