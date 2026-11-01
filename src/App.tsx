export default function App() {
  return (
    <div className="min-h-screen bg-amber-50/30 text-stone-900">
      <header className="border-b border-amber-200/70 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/30 text-2xl" aria-hidden="true">
              🪔
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-amber-100 sm:text-2xl">
                തിരുവിതാംകൂർ ദേവസ്വം ബോർഡ്
              </h1>
              <p className="text-xs font-medium tracking-wide text-amber-200/90 sm:text-sm">
                Travancore Devaswom Board • Vazhipadu Booking System
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm text-center">
          <p className="text-stone-600">
            Welcome to the TDB Vazhipadu Booking Portal. Select a temple to view ritual offerings.
          </p>
        </div>
      </main>
    </div>
  );
}
