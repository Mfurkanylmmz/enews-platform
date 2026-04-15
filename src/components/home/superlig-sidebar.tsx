"use client";

import { useMemo, useState } from "react";
import {
  nextWeekFixtures,
  superLigStandings,
  weeklyResults,
} from "@/data/superlig";

const INITIAL_STANDINGS_COUNT = 8;

export function SuperLigSidebar() {
  const [showAllStandings, setShowAllStandings] = useState(false);

  const visibleStandings = useMemo(() => {
    if (showAllStandings) {
      return superLigStandings;
    }
    return superLigStandings.slice(0, INITIAL_STANDINGS_COUNT);
  }, [showAllStandings]);

  const fixturePairs = useMemo(() => {
    const pairs: Array<typeof nextWeekFixtures> = [];
    for (let index = 0; index < nextWeekFixtures.length; index += 2) {
      pairs.push(nextWeekFixtures.slice(index, index + 2));
    }
    return pairs;
  }, []);

  return (
    <aside className="space-y-5 xl:mt-16">
      <section className="rounded-2xl bg-white/85 p-4 shadow-[0_8px_24px_rgba(30,64,175,0.08)] ring-1 ring-blue-100 backdrop-blur-sm dark:bg-white/[0.03] dark:shadow-[0_10px_30px_rgba(15,23,42,0.35)] dark:ring-white/10">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Süper Lig Puan Durumu</h2>
        <div className="mt-3 space-y-1.5">
          {visibleStandings.map((row, index) => (
            <div
              key={row.team}
              className="grid grid-cols-[1.4rem_1fr_1.8rem_2rem] items-center gap-1 rounded-lg bg-zinc-50 px-2 py-1.5 text-xs dark:bg-white/[0.06]"
            >
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">{index + 1}</span>
              <span className="flex min-w-0 items-center gap-1.5">
                <span
                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${row.logoClassName}`}
                  aria-hidden
                >
                  {row.logoText}
                </span>
                <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">{row.team}</span>
              </span>
              <span className="text-right text-zinc-500 dark:text-zinc-400">{row.played}</span>
              <span className="text-right font-bold text-zinc-900 dark:text-zinc-100">{row.points}</span>
            </div>
          ))}
        </div>
        {superLigStandings.length > INITIAL_STANDINGS_COUNT ? (
          <button
            type="button"
            onClick={() => setShowAllStandings((previous) => !previous)}
            className="mt-3 w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-white/15 dark:text-zinc-300 dark:hover:bg-white/[0.1]"
          >
            {showAllStandings ? "Daha az göster" : "Daha fazla göster"}
          </button>
        ) : null}
      </section>

      <section className="rounded-2xl bg-white/85 p-4 shadow-[0_8px_24px_rgba(30,64,175,0.08)] ring-1 ring-blue-100 backdrop-blur-sm dark:bg-white/[0.03] dark:shadow-[0_10px_30px_rgba(15,23,42,0.35)] dark:ring-white/10">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Haftalık Maç Sonuçları</h3>
        <div className="mt-3 space-y-1.5">
          {weeklyResults.map((match) => (
            <div
              key={`${match.homeTeam}-${match.awayTeam}`}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 rounded-lg bg-zinc-50 px-2 py-1.5 text-xs dark:bg-white/[0.06]"
            >
              <span className="truncate text-right text-zinc-700 dark:text-zinc-300">{match.homeTeam}</span>
              <span className="rounded-md bg-zinc-200 px-1.5 py-0.5 text-[11px] font-bold text-zinc-900 dark:bg-white/[0.12] dark:text-zinc-100">
                {match.score}
              </span>
              <span className="truncate text-zinc-700 dark:text-zinc-300">{match.awayTeam}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white/85 p-4 shadow-[0_8px_24px_rgba(30,64,175,0.08)] ring-1 ring-blue-100 backdrop-blur-sm dark:bg-white/[0.03] dark:shadow-[0_10px_30px_rgba(15,23,42,0.35)] dark:ring-white/10">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Gelecek Hafta Eşleşmeleri</h3>
        <div className="mt-3 space-y-1.5">
          {fixturePairs.map((pair, pairIndex) => (
            <div key={`pair-${pairIndex}`} className="relative grid grid-cols-2 gap-1.5">
              <div
                key={`${pair[0].homeTeam}-${pair[0].awayTeam}`}
                className="flex min-h-14 flex-col justify-center rounded-lg bg-zinc-50 px-2 py-1.5 text-center text-xs dark:bg-white/[0.06]"
              >
                <p className="h-4 truncate font-medium leading-4 text-zinc-800 dark:text-zinc-200">
                  {pair[0].homeTeam} - {pair[0].awayTeam}
                </p>
                <p className="mt-1 h-3 text-[11px] leading-3 text-zinc-500 dark:text-zinc-400">
                  {pair[0].day} - {pair[0].time}
                </p>
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center">
                <span className="rounded bg-white px-1 text-xs font-semibold text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                  |
                </span>
              </div>
              {pair[1] ? (
                <div
                  key={`${pair[1].homeTeam}-${pair[1].awayTeam}`}
                  className="flex min-h-14 flex-col justify-center rounded-lg bg-zinc-50 px-2 py-1.5 text-center text-xs dark:bg-white/[0.06]"
                >
                  <p className="h-4 truncate font-medium leading-4 text-zinc-800 dark:text-zinc-200">
                    {pair[1].homeTeam} - {pair[1].awayTeam}
                  </p>
                  <p className="mt-1 h-3 text-[11px] leading-3 text-zinc-500 dark:text-zinc-400">
                    {pair[1].day} - {pair[1].time}
                  </p>
                </div>
              ) : (
                <div className="min-h-14 rounded-lg bg-zinc-50 dark:bg-white/[0.06]" />
              )}
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
