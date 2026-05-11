import Image from 'next/image'

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <Image
      src="/icons/icon-192x192.png"
      alt="MoonAuth"
      width={size}
      height={size}
      className={`rounded-xl ${className}`}
      priority
    />
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
