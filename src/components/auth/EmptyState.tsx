interface EmptyStateProps {
  onAdd: () => void
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <svg
        width="160" height="160" viewBox="0 0 200 200" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="60" y="20" width="80" height="140" rx="12" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
        <rect x="70" y="35" width="60" height="8" rx="4" fill="white" fillOpacity="0.1" />
        <rect x="70" y="50" width="40" height="6" rx="3" fill="white" fillOpacity="0.07" />
        <rect x="75" y="75" width="50" height="50" rx="4" stroke="white" strokeWidth="1.5" strokeOpacity="0.15" />
        <line x1="75" y1="75" x2="125" y2="125" stroke="white" strokeWidth="1.5" strokeOpacity="0.1" />
        <line x1="125" y1="75" x2="75" y2="125" stroke="white" strokeWidth="1.5" strokeOpacity="0.1" />
        <rect x="80" y="80" width="40" height="40" rx="2" stroke="#7c5cfc" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="80" y1="90" x2="120" y2="90" stroke="#7c5cfc" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="80" y1="100" x2="120" y2="100" stroke="#7c5cfc" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="80" y1="110" x2="120" y2="110" stroke="#7c5cfc" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="90" y1="80" x2="90" y2="120" stroke="#7c5cfc" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="100" y1="80" x2="100" y2="120" stroke="#7c5cfc" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="110" y1="80" x2="110" y2="120" stroke="#7c5cfc" strokeWidth="1" strokeOpacity="0.3" />
        <circle cx="148" cy="68" r="18" fill="#7c5cfc" fillOpacity="0.15" stroke="#7c5cfc" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M148 62v6m0 4v.5" stroke="#7c5cfc" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
      </svg>

      <h3 className="mt-4 font-sora font-semibold text-lg text-white">No accounts yet</h3>
      <p className="mt-2 text-sm text-gray-500">Tap + to add your first account</p>

      <button
        onClick={onAdd}
        className="mt-6 px-6 py-3 bg-[#7c5cfc] text-white font-medium rounded-[12px] text-sm hover:bg-[#8d6ffd] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5cfc]"
        aria-label="Add your first account"
      >
        Add Account
      </button>
    </div>
  )
}
