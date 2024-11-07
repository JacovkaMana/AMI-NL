import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()

  return (
    <header className="bg-green h-20">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="text-gold font-cinzel text-2xl font-bold">
          D&D Companion
        </Link>
        <nav className="space-x-6">
          <Link href="/character-creation" className="text-white hover:text-gold transition-colors">
            Character Creation
          </Link>
          <Link href="/chat-room" className="text-white hover:text-gold transition-colors">
            Chat Room
          </Link>
        </nav>
      </div>
    </header>
  )
}
