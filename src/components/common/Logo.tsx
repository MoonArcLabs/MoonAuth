interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MoonAuth logo"
    >
      <rect width="100" height="100" fill="#000000" />
      <g transform="rotate(15 50 50)">
        <circle cx="42" cy="50" r="26" fill="white" />
        <circle cx="57" cy="50" r="22" fill="#000000" />
        <circle cx="42" cy="50" r="26" fill="white" fillOpacity="0.03" />
      </g>
    </svg>
  )
}

export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo size={32} />
      <span className="font-sora font-semibold text-lg text-white tracking-tight">MoonAuth</span>
    </div>
  )
}
