"use client";

import { useSyncExternalStore } from "react";

const CONSENT_KEY = "enews-consent";

type ConsentState = "accepted" | "rejected" | null;

export function ConsentBanner() {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const consent = useSyncExternalStore(
    (callback) => {
      window.addEventListener("enews-consent-changed", callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener("enews-consent-changed", callback);
        window.removeEventListener("storage", callback);
      };
    },
    () => (window.localStorage.getItem(CONSENT_KEY) as ConsentState),
    () => null,
  );

  const setConsentValue = (value: Exclude<ConsentState, null>) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new Event("enews-consent-changed"));
  };

  if (!isClient || consent) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)] ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700 md:inset-x-auto md:right-6 md:w-[28rem]">
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        Size daha iyi bir deneyim ve reklam gösterimi sunmak için çerezler kullanıyoruz.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setConsentValue("rejected")}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Reddet
        </button>
        <button
          type="button"
          onClick={() => setConsentValue("accepted")}
          className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800"
        >
          Kabul Et
        </button>
      </div>
    </div>
  );
}
