import "./App.css";

function App() {
  return (
    <main className="app-container">
      <div className="hero-card">
        <div className="brand-badge">
          <span className="status-dot" aria-hidden="true" />
          <span>Foundation Ready</span>
        </div>

        <div className="logo-wrapper">
          <img
            src="/favicon.svg"
            alt="PlyWise Knight Mark"
            className="brand-logo"
          />
        </div>

        <h1 className="brand-title">PlyWise</h1>
        <p className="brand-tagline">The Interactive Chess Mentor</p>

        <div className="divider" aria-hidden="true" />

        <div className="features-grid">
          <div className="feature-item">
            <span className="feature-icon" aria-hidden="true">⚡</span>
            <h2 className="feature-title">Engine Intelligence</h2>
            <p className="feature-desc">Sub-second minimax analysis with alpha-beta pruning &amp; move ordering.</p>
          </div>

          <div className="feature-item">
            <span className="feature-icon" aria-hidden="true">♟️</span>
            <h2 className="feature-title">Adaptive Bots</h2>
            <p className="feature-desc">Easy, Medium, and Hard AI sparring partners tailored to your strength.</p>
          </div>

          <div className="feature-item">
            <span className="feature-icon" aria-hidden="true">🔍</span>
            <h2 className="feature-title">Tactical Mastery</h2>
            <p className="feature-desc">Deep position evaluation, safety checks, and mobility metrics.</p>
          </div>
        </div>

        <p className="footer-info">
          Cinzel &amp; Inter Typography • Dark Gold Theme
        </p>
      </div>
    </main>
  );
}

export default App;
