"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "enews-consent";

type AdSlotProps = {
  label: string;
  className?: string;
};

export function AdSlot({ label, className = "" }: AdSlotProps) {
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      const value = window.localStorage.getItem(CONSENT_KEY);
      setConsentAccepted(value === "accepted");
      setReady(true);
    };

    syncConsent();
    window.addEventListener("enews-consent-changed", syncConsent);
    return () => window.removeEventListener("enews-consent-changed", syncConsent);
  }, []);

  if (!ready) {
    return (
      <div className={`rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 ${className}`} />
    );
  }

  return (
    <div
      className={`rounded-2xl border border-dashed p-4 text-center ${
        consentAccepted
          ? "border-blue-300 bg-blue-50/60 text-blue-900 dark:border-blue-500/40 dark:bg-blue-900/20 dark:text-blue-200"
          : "border-zinc-300 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
      } ${className}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide">Reklam Alanı</p>
      <p className="mt-1 text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs">
        {consentAccepted ? "Reklam gösterimine hazır" : "Reklam için çerez izni bekleniyor"}
      </p>
    </div>
  );
}
