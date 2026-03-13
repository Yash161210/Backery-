import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/40 bg-white/60">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 text-sm text-zinc-700 sm:grid-cols-3 sm:px-6">
        <div>
          <div className="text-base font-semibold text-zinc-900">Sweet Crumbs Bakery</div>
          <div className="mt-2">Freshly Baked Happiness Every Day</div>
          <div className="mt-3 text-xs text-zinc-600">© {new Date().getFullYear()} Sweet Crumbs Bakery</div>
        </div>
        <div>
          <div className="font-semibold text-zinc-900">Visit us</div>
          <div className="mt-2">
            CS-10 Supertech Capetown, Sector 74
            <br />
            Noida, Uttar Pradesh 201301
          </div>
          <div className="mt-2">
            Phone: <a className="font-semibold text-zinc-900" href="tel:+919315473497">+91 9315473497</a>
          </div>
        </div>
        <div>
          <div className="font-semibold text-zinc-900">Quick links</div>
          <div className="mt-2 flex flex-col gap-2">
            <Link className="hover:text-zinc-900" href="/menu">Menu</Link>
            <Link className="hover:text-zinc-900" href="/ai-recommendation">AI Recommendation</Link>
            <Link className="hover:text-zinc-900" href="/gallery">Gallery</Link>
            <Link className="hover:text-zinc-900" href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

