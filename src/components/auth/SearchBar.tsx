'use client'

interface SearchBarProps {
  query: string
  onChange: (q: string) => void
  onClear: () => void
}

export function SearchBar({ query, onChange, onClear }: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <svg
        className="absolute left-3 text-gray-500 pointer-events-none"
        width="16" height="16" viewBox="0 0 16 16" fill="currentColor"
      >
        <path d="M6.5 1a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm4.768 9.676 2.778 2.777a.75.75 0 0 1-1.06 1.06l-2.778-2.777A6.998 6.998 0 0 1 6.5 13 6.5 6.5 0 1 1 13 6.5c0 1.875-.786 3.565-2.049 4.772h.317v.404z" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search accounts..."
        className="w-full bg-[#0f0f0f] border border-white/[0.06] rounded-[10px] py-3 pl-9 pr-9 text-sm text-[#f0f0f0] placeholder-gray-600 focus:outline-none focus:border-white/[0.15] transition-colors"
        aria-label="Search accounts"
      />
      {query && (
        <button
          onClick={onClear}
          className="absolute right-3 text-gray-500 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M7 5.586L11.293 1.293a1 1 0 1 1 1.414 1.414L8.414 7l4.293 4.293a1 1 0 0 1-1.414 1.414L7 8.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L5.586 7 1.293 2.707A1 1 0 0 1 2.707 1.293L7 5.586z" />
          </svg>
        </button>
      )}
    </div>
  )
}
