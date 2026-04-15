"use client";

type TopMenuProps = {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchText: string;
  onSearchChange: (value: string) => void;
};

export function TopMenu({
  categories,
  activeCategory,
  onCategoryChange,
  searchText,
  onSearchChange,
}: TopMenuProps) {
  return (
    <section className="rounded-2xl bg-white/80 p-4 shadow-[0_8px_24px_rgba(30,64,175,0.08)] ring-1 ring-blue-100 backdrop-blur-sm dark:bg-white/[0.03] dark:shadow-[0_10px_30px_rgba(15,23,42,0.35)] dark:ring-white/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-blue-700 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/[0.06] dark:text-zinc-300 dark:hover:bg-white/[0.12]"
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
        <label className="w-full lg:max-w-sm">
          <span className="sr-only">Haberlerde ara</span>
          <input
            type="search"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Başlık veya içerik ara..."
            className="w-full rounded-full border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-blue-900/40"
          />
        </label>
      </div>
    </section>
  );
}
