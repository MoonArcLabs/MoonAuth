import Link from 'next/link'
import { LogoFull } from '@/components/common/Logo'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-6 px-6 text-center bg-black">
      <LogoFull />
      <div>
        <h1 className="font-sora font-bold text-4xl text-white">404</h1>
        <p className="text-gray-500 text-sm mt-2">Page not found</p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 bg-[#7c5cfc] text-white font-medium rounded-[12px] text-sm hover:bg-[#8d6ffd] transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
