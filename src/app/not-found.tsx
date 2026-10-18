import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold font-mono text-[#FF7800] mb-4">404</h1>
      <p className="text-xl font-mono text-[#A0A0A0] mb-8 uppercase tracking-widest">Page Not Found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#FF7800] text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#FF9020] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7800]"
      >
        Return Home
      </Link>
    </div>
  );
}
