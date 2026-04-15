"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError("Şifre yanlış.");
        return;
      }

      router.push("/admin/new-article");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl bg-white/90 p-6 shadow-[0_10px_32px_rgba(30,64,175,0.1)] ring-1 ring-blue-100 dark:bg-white/[0.03] dark:ring-white/10"
    >
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Admin Şifresi
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}
      </button>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
    </form>
  );
}
