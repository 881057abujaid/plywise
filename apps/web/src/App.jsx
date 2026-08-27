function App() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-bg text-text-primary font-sans">
      {/* Radial Gold Accent Glow */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,168,79,0.08)_0%,rgba(11,13,18,1)_70%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Chess Grid Overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(41,46,56,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(41,46,56,0.25)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_50%_50%,black_20%,transparent_75%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Hero Card */}
      <div className="relative z-10 max-w-2xl w-full bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl transition-all duration-300">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-success/10 border border-success/30 text-success mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_var(--color-success)]" aria-hidden="true" />
          <span>Foundation Ready</span>
        </div>

        {/* Brand Logo */}
        <div className="flex justify-center items-center mb-6">
          <img
            src="/favicon.svg"
            alt="PlyWise Knight Mark"
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_8px_24px_rgba(212,168,79,0.35)] transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_12px_32px_rgba(212,168,79,0.5)] cursor-pointer"
          />
        </div>

        {/* Brand Typography */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider uppercase bg-gradient-to-br from-[#FFF3B8] via-gold-primary to-gold-muted bg-clip-text text-transparent mb-2">
          PlyWise
        </h1>
        <p className="text-text-secondary text-base sm:text-lg font-normal tracking-normal mb-8">
          The Interactive Chess Mentor
        </p>

        {/* Gold Divider */}
        <div className="w-16 h-0.5 mx-auto mb-8 bg-gradient-to-r from-transparent via-gold-primary to-transparent" aria-hidden="true" />

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
          <div className="bg-surface-elevated border border-border rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-primary/40">
            <span className="text-xl mb-2 block" aria-hidden="true">⚡</span>
            <h2 className="font-semibold text-sm text-text-primary mb-1">Engine Intelligence</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Sub-second minimax analysis with alpha-beta pruning &amp; move ordering.
            </p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-primary/40">
            <span className="text-xl mb-2 block" aria-hidden="true">♟️</span>
            <h2 className="font-semibold text-sm text-text-primary mb-1">Adaptive Bots</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Easy, Medium, and Hard AI sparring partners tailored to your strength.
            </p>
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-primary/40">
            <span className="text-xl mb-2 block" aria-hidden="true">🔍</span>
            <h2 className="font-semibold text-sm text-text-primary mb-1">Tactical Mastery</h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Deep position evaluation, safety checks, and mobility metrics.
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-xs text-text-muted tracking-wide font-sans">
          Cinzel &amp; Inter Typography • Tailwind CSS v4 Theme
        </p>
      </div>
    </main>
  );
}

export default App;
