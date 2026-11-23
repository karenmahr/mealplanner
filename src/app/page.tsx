import Link from 'next/link';

export default function Home() {
  return (
    <main className="page-shell flex min-h-[70vh] items-center py-16 sm:py-24">
      <section className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#2E6F40]">
          MealPlanner
        </p>
        <h1 className="font-display mt-4 text-5xl font-bold tracking-tight text-[#1F2937] sm:text-6xl">
          Save recipes. Plan meals. Cook with confidence.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          Build a personal collection of recipes and prepare your week one meal
          at a time.
        </p>
        <Link
          className="mt-8 inline-flex rounded-lg bg-[#2E6F40] px-5 py-3 font-semibold text-white transition hover:bg-[#245a33] focus:outline-none focus:ring-2 focus:ring-[#2E6F40] focus:ring-offset-2"
          href="/recipes"
        >
          Explore recipes
        </Link>
      </section>
    </main>
  );
}
