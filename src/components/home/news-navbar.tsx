"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
} from "react";

const PRIMARY_MENU = [
  { label: "Son Dakika", category: "Tüm" },
  { label: "Dünya", category: "Dünya" },
  { label: "Ekonomi", category: "Ekonomi" },
  { label: "Spor", category: "Spor" },
  { label: "Teknoloji", category: "Teknoloji" },
  { label: "Yaşam", category: "Yaşam" },
];

const DISTRICTS = [
  "Muratpaşa",
  "Konyaaltı",
  "Kepez",
  "Alanya",
  "Manavgat",
  "Kemer",
  "Kaş",
];

const DISTRICT_WEATHER: Record<string, string> = {
  Muratpaşa: "24°C",
  Konyaaltı: "23°C",
  Kepez: "25°C",
  Alanya: "26°C",
  Manavgat: "25°C",
  Kemer: "22°C",
  Kaş: "21°C",
};

const CURRENCIES = [
  { code: "USD", buy: "38,62", sell: "38,74" },
  { code: "EUR", buy: "42,15", sell: "42,32" },
  { code: "GBP", buy: "49,24", sell: "49,51" },
];

const CURRENCY_AUTO_ROTATE_MS = 3000;
const CURRENCY_MANUAL_PAUSE_MS = 10000;

let currentTime = Date.now();
const timeListeners = new Set<() => void>();
let timeIntervalStarted = false;

function subscribeClock(callback: () => void) {
  timeListeners.add(callback);

  if (!timeIntervalStarted) {
    timeIntervalStarted = true;
    setInterval(() => {
      currentTime = Date.now();
      timeListeners.forEach((listener) => listener());
    }, 1000);
  }

  return () => {
    timeListeners.delete(callback);
  };
}

function getClockSnapshot() {
  return currentTime;
}

export function NewsNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedDistrict, setSelectedDistrict] = useState("Alanya");
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(CURRENCIES[0].code);
  const [manualPauseUntil, setManualPauseUntil] = useState(0);
  const nowTimestamp = useSyncExternalStore(subscribeClock, getClockSnapshot, () => 0);
  const activeCategory = searchParams.get("kategori") ?? "Tüm";

  const currentWeather = DISTRICT_WEATHER[selectedDistrict] ?? "--";

  const onDistrictChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(event.target.value);
  };

  const onCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrencyCode(event.target.value);
    setManualPauseUntil(Date.now() + CURRENCY_MANUAL_PAUSE_MS);
  };

  const selectedCurrency =
    CURRENCIES.find((currency) => currency.code === selectedCurrencyCode) ?? CURRENCIES[0];

  const formattedDateTime = useMemo(() => {
    if (!nowTimestamp) {
      return "--.--.---- --:--:--";
    }
    const now = new Date(nowTimestamp);
    return now.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [nowTimestamp]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() < manualPauseUntil) {
        return;
      }

      setSelectedCurrencyCode((previousCode) => {
        const currentIndex = CURRENCIES.findIndex(
          (currency) => currency.code === previousCode,
        );
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % CURRENCIES.length;
        return CURRENCIES[nextIndex].code;
      });
    }, CURRENCY_AUTO_ROTATE_MS);

    return () => clearInterval(timer);
  }, [manualPauseUntil]);

  const getCategoryHref = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "Tüm") {
      params.delete("kategori");
    } else {
      params.set("kategori", category);
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <header className="sticky top-0 z-40 w-full overflow-hidden bg-white/90 shadow-[0_10px_30px_rgba(2,6,23,0.12)] ring-1 ring-blue-100 backdrop-blur-sm dark:bg-zinc-950/80 dark:ring-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 bg-zinc-900 px-4 py-2 text-xs text-zinc-200">
        <p className="truncate">Son Dakika: E-News canlı yayın akışı yayında</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-white/10 px-2 py-1">{formattedDateTime}</span>
          <span className="rounded-md bg-white/10 px-2 py-1">İl: Antalya</span>
          <span className="rounded-md bg-white/10 px-2 py-1">Hava: {currentWeather}</span>
          <select
            value={selectedDistrict}
            onChange={onDistrictChange}
            className="rounded-md bg-white/10 px-2 py-1 text-[11px] outline-none transition hover:bg-white/20"
          >
            {DISTRICTS.map((district) => (
              <option key={district}>{district}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-white">
        <Link href="/" className="text-2xl font-black tracking-tight">
          E-News
        </Link>
        <nav className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
          {PRIMARY_MENU.map((item) => (
            <Link
              key={item.label}
              href={getCategoryHref(item.category)}
              className={`rounded-md px-2 py-1 transition hover:bg-white/15 hover:text-white ${
                activeCategory === item.category ? "bg-white/20 text-white" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1 text-[11px] font-semibold ring-1 ring-white/20">
          <span className="text-white/85">Döviz:</span>
          <select
            value={selectedCurrencyCode}
            onChange={onCurrencyChange}
            className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] outline-none transition hover:bg-white/20"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code}
              </option>
            ))}
          </select>
          <span>
            {selectedCurrency.buy}/{selectedCurrency.sell}
          </span>
        </div>
      </div>

    </header>
  );
}
