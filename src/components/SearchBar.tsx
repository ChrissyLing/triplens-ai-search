"use client";

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  sampleQueries: { query: string }[];
}

export default function SearchBar({ onSearch, loading, sampleQueries }: SearchBarProps) {
  return (
    <div className="w-full space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem("query") as HTMLInputElement;
          if (input.value.trim()) onSearch(input.value.trim());
        }}
        className="flex gap-2"
      >
        <input
          name="query"
          type="text"
          placeholder="搜索旅游攻略、探店、门票..."
          className="flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-white placeholder-zinc-500 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-pink-500 px-6 py-3 font-medium text-white transition hover:bg-pink-600 disabled:opacity-50"
        >
          {loading ? "搜索中..." : "搜索"}
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {sampleQueries.map(({ query }) => (
          <button
            key={query}
            type="button"
            onClick={() => onSearch(query)}
            disabled={loading}
            className="rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-pink-500/50 hover:text-pink-300 disabled:opacity-50"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
}
