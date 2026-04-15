export type StandingRow = {
  team: string;
  logoText: string;
  logoClassName: string;
  played: number;
  points: number;
};

export type MatchResult = {
  homeTeam: string;
  awayTeam: string;
  score: string;
};

export type MatchFixture = {
  homeTeam: string;
  awayTeam: string;
  day: string;
  time: string;
};

export const superLigStandings: StandingRow[] = [
  { team: "Galatasaray", logoText: "GS", logoClassName: "bg-yellow-400 text-red-700", played: 31, points: 84 },
  { team: "Fenerbahçe", logoText: "FB", logoClassName: "bg-yellow-300 text-blue-800", played: 31, points: 82 },
  { team: "Beşiktaş", logoText: "BJK", logoClassName: "bg-zinc-200 text-zinc-900", played: 31, points: 61 },
  { team: "Trabzonspor", logoText: "TS", logoClassName: "bg-blue-950 text-red-300", played: 31, points: 55 },
  { team: "Başakşehir", logoText: "BŞK", logoClassName: "bg-orange-400 text-blue-900", played: 31, points: 52 },
  { team: "Kasımpaşa", logoText: "KPA", logoClassName: "bg-blue-500 text-white", played: 31, points: 48 },
  { team: "Sivasspor", logoText: "SVS", logoClassName: "bg-red-600 text-white", played: 31, points: 46 },
  { team: "Antalyaspor", logoText: "ANT", logoClassName: "bg-red-500 text-white", played: 31, points: 45 },
  { team: "Adana Demirspor", logoText: "ADS", logoClassName: "bg-sky-500 text-white", played: 31, points: 44 },
  { team: "Samsunspor", logoText: "SAM", logoClassName: "bg-red-500 text-white", played: 31, points: 43 },
  { team: "Alanyaspor", logoText: "ALN", logoClassName: "bg-green-600 text-white", played: 31, points: 42 },
  { team: "Rizespor", logoText: "RZE", logoClassName: "bg-emerald-600 text-white", played: 31, points: 40 },
  { team: "Konyaspor", logoText: "KON", logoClassName: "bg-green-700 text-white", played: 31, points: 39 },
  { team: "Gaziantep FK", logoText: "GFK", logoClassName: "bg-red-700 text-white", played: 31, points: 38 },
  { team: "Kayserispor", logoText: "KYS", logoClassName: "bg-yellow-500 text-red-700", played: 31, points: 37 },
  { team: "Hatayspor", logoText: "HTY", logoClassName: "bg-red-800 text-white", played: 31, points: 34 },
  { team: "Ankaragücü", logoText: "ANK", logoClassName: "bg-yellow-400 text-blue-900", played: 31, points: 32 },
  { team: "Pendikspor", logoText: "PND", logoClassName: "bg-rose-600 text-white", played: 31, points: 30 },
];

export const weeklyResults: MatchResult[] = [
  { homeTeam: "Galatasaray", awayTeam: "Konyaspor", score: "3-1" },
  { homeTeam: "Fenerbahçe", awayTeam: "Adana Demirspor", score: "2-0" },
  { homeTeam: "Beşiktaş", awayTeam: "Alanyaspor", score: "1-1" },
  { homeTeam: "Trabzonspor", awayTeam: "Sivasspor", score: "2-1" },
];

export const nextWeekFixtures: MatchFixture[] = [
  { homeTeam: "Galatasaray", awayTeam: "Antalyaspor", day: "Cumartesi", time: "19:00" },
  { homeTeam: "Fenerbahçe", awayTeam: "Kasımpaşa", day: "Pazar", time: "19:00" },
  { homeTeam: "Beşiktaş", awayTeam: "Başakşehir", day: "Pazar", time: "21:45" },
  { homeTeam: "Trabzonspor", awayTeam: "Hatayspor", day: "Pazartesi", time: "20:00" },
];
