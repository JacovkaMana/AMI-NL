export default function Footer() {
  return (
    <footer className="bg-green h-15 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between text-white">
        <div className="text-sm">
          © 2024 D&D Companion. All rights reserved.
        </div>
        <div className="space-x-4 text-sm">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
