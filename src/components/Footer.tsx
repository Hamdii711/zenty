import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Zenty. Tous droits réservés.
            </span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-gray-500 hover:text-purple-600 transition">
              Mentions légales
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-purple-600 transition">
              CGU
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-purple-600 transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
