import { useState, useEffect } from "react";
import "./index.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "/api";
const getViewFromPath = () =>
  window.location.pathname.startsWith("/catalog") ? "catalog" : "landing";

const landingSignals = [
  "Curated desktop systems, monitors, and components",
  "Designed for creators, streamers, and builders",
  "Fast checkout, premium drops, live stock visibility",
];

const landingTestimonials = [
  {
    quote:
      "The whole store feels curated. I found a display and desk setup that looked editorial, not mass-market.",
    name: "Aarav Mehta",
    role: "Content creator",
  },
  {
    quote:
      "Fast, clean, and visually sharp. The catalog is easy to scan and the products actually feel premium.",
    name: "Nina Brooks",
    role: "Streaming setup builder",
  },
  {
    quote:
      "It has the confidence of a niche hardware brand, but the shopping flow stays simple and direct.",
    name: "Daniel Park",
    role: "PC enthusiast",
  },
];

const formatIsoTime = (value) => {
  if (!value) return "Waiting for request";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
};

function LandingPage({ onExplore, onCheckStatus, deployInfo, lastRequestInfo, loading }) {
  const [activeTrace, setActiveTrace] = useState("backend");

  const machineForNode = (nodeName) => {
    if (!nodeName) return "Unknown PVE";
    const mapping = [
      { host: "PVE1", nodes: ["vm1", "vm2"] },
      { host: "PVE2", nodes: ["vm3", "vm4"] },
      { host: "PVE3", nodes: ["vm5", "vm6"] },
    ];
    const normalized = nodeName.toLowerCase();
    const match = mapping.find((entry) =>
      entry.nodes.some((id) => normalized.includes(id))
    );
    return match ? match.host : "Unknown PVE";
  };

  const tracePresets = {
    backend: {
      label: "Backend",
      serviceName: "backend",
      info: lastRequestInfo,
    },
    frontend: {
      label: "Frontend",
      serviceName: "frontend",
      info: deployInfo
        ? {
            ...deployInfo,
            serviceName: "frontend",
            podName: "frontend-pod",
          }
        : null,
    },
    database: {
      label: "Database",
      serviceName: "postgres",
      info: deployInfo
        ? {
            ...deployInfo,
            serviceName: "postgres",
            podName: "postgres-stateful-pod",
          }
        : null,
    },
  };

  const activeTraceConfig = tracePresets[activeTrace];
  const activeTraceInfo = activeTraceConfig.info;
  const requestDetails = [
    ["Time", formatIsoTime(activeTraceInfo?.receivedAt)],
    ["Runtime mode", activeTraceInfo?.runtimeMode || "Pending"],
    ["Service", activeTraceInfo?.serviceName || activeTraceConfig.serviceName],
    ["K3s Node", activeTraceInfo?.nodeName || "Pending"],
    ["Machine", machineForNode(activeTraceInfo?.nodeName)],
    ["Pod", activeTraceInfo?.podName || "Pending"],
    ["Pod IP", activeTraceInfo?.podIp || "Pending"],
    ["Client IP", activeTraceInfo?.clientIp || "Pending"],
  ];

  return (
    <div className="landing-page">
      <div className="landing-noise" />
      <header className="landing-nav">
        <div className="landing-brandmark">
          <span className="brandmark-dot" />
          Tech Store
        </div>
        <nav className="landing-nav-links">
          <button type="button" className="landing-nav-link">
            Home
          </button>
          <button type="button" className="landing-nav-link" onClick={onExplore}>
            Catalog
          </button>
          <button type="button" className="landing-nav-link">
            Builds
          </button>
        </nav>
        <div className="landing-nav-actions">
          <button
            className="nav-status-button"
            onClick={onCheckStatus}
            type="button"
          >
            <span className={`status-dot ${deployInfo ? "is-live" : ""}`} />
            {loading ? "Checking..." : "Refresh trace"}
          </button>
          <button className="nav-cta" onClick={onExplore}>
            Enter store
          </button>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-stage">
          <div className="stage-halo stage-halo-one" />
          <div className="stage-halo stage-halo-two" />
          <div className="stage-halo stage-halo-three" />

          <img
            src="/image.png"
            alt="Retro display"
            className="floating-asset asset-display"
          />
          <img
            src="/image copy.png"
            alt="Blue desktop monitor"
            className="floating-asset asset-monitor"
          />
          <img
            src="/image copy 2.png"
            alt="Server rack"
            className="floating-asset asset-rack"
          />
          <img
            src="/image copy 4.png"
            alt="Open desktop chassis"
            className="floating-asset asset-chassis"
          />

          <div className="landing-hero-copy landing-hero-copy-centered">
            <h1 className="landing-title">
              Shop the
              <br/>
              gear that
              <br />
              upgrades
              <br />
              your setup
            </h1>
            <p className="landing-subtitle">
              A more cinematic storefront for desktops, displays, and creative
              gear, staged with depth, motion, and collectible energy.
            </p>
            <div className="landing-actions">
              <div className="catalog-invite">
                <img
                  src="/cursor.png"
                  alt="Cursor pointing at open catalog"
                  className="catalog-cursor"
                />
                <button className="cta-button" onClick={onExplore}>
                  Open Shop Catalog
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
              <a href="#collection" className="ghost-link">
                see testimonials
              </a>
            </div>
            <div className="landing-signal-list">
              {landingSignals.map((signal) => (
                <span key={signal}>{signal}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-proof" id="collection">
        <div className="section-intro">
          <p className="section-label">Testimonials</p>
          <h2>People remember the atmosphere first, then how easy it was to buy.</h2>
        </div>
        <div className="proof-layout">
          <div className="proof-visual">
            <div className="proof-badge">Trusted setups</div>
            <img src="/image copy.png" alt="Desktop monitor" className="proof-monitor" />
            <img src="/image copy 4.png" alt="Open chassis system" className="proof-chassis" />
          </div>
          <div className="testimonial-stack">
            {landingTestimonials.map((item) => (
              <article className="testimonial-card" key={item.name}>
                <p className="testimonial-quote">"{item.quote}"</p>
                <div className="testimonial-meta">
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-cta" id="cta">
        <p className="section-label">Last Request Trace</p>
        <h2>The latest service response shows which k3s node and pod handled the request.</h2>
        <p className="cta-copy">
          Toggle the service to inspect backend, frontend, and database request
          traces with pod, node, machine, and client metadata.
        </p>
        <div className="trace-toggle-group" role="tablist" aria-label="Trace service switcher">
          {Object.entries(tracePresets).map(([key, config]) => (
            <button
              key={key}
              type="button"
              className={`trace-toggle ${activeTrace === key ? "is-active" : ""}`}
              onClick={() => setActiveTrace(key)}
            >
              {config.label}
            </button>
          ))}
        </div>
        <div className="request-trace-panel">
          {requestDetails.map(([label, value]) => (
            <div className="request-trace-row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className="landing-cta-actions">
          <button className="cta-button" onClick={onCheckStatus}>
            Refresh trace
          </button>
          <button className="secondary-cta-button" onClick={onExplore}>
            Open catalog
          </button>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [view, setView] = useState(getViewFromPath);
  const [products, setProducts] = useState([]);
  const [deployInfo, setDeployInfo] = useState(null);
  const [lastRequestInfo, setLastRequestInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    getDeploymentInfo();
  }, []);

  useEffect(() => {
    const syncRoute = () => setView(getViewFromPath());

    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  const navigateTo = (nextView) => {
    const path = nextView === "catalog" ? "/catalog" : "/";
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setView(nextView);
  };

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Backend not available");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  };

  const getDeploymentInfo = () => {
    setStatusLoading(true);
    fetch(`${BACKEND_URL}/info`)
      .then((res) => res.json())
      .then((data) => {
        setDeployInfo(data);
        setLastRequestInfo(data);
        setStatusLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching info:", err);
        setStatusLoading(false);
      });
  };

  if (view === "landing") {
    return (
      <LandingPage
        onExplore={() => navigateTo("catalog")}
        onCheckStatus={getDeploymentInfo}
        deployInfo={deployInfo}
        lastRequestInfo={lastRequestInfo}
        loading={statusLoading}
      />
    );
  }

  return (
    <div className="layout">
      {/* Premium Header */}
      <header>
        <div
          className="brand"
          onClick={() => navigateTo("landing")}
          style={{ cursor: "pointer" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path
              d="M8 16H24M16 8V24"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          Tech Store
        </div>

        <div className="search-bar">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search products..." />
        </div>

        <nav className="nav-links">
          <span className="nav-link">Best Sellers</span>
          <span className="nav-link">New Arrivals</span>
          <div
            className="nav-link"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            onClick={getDeploymentInfo}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            Refresh trace
          </div>
        </nav>
      </header>

      {/* Categories Bar */}
      <div className="categories">
        <span className="category-item">Monitors</span>
        <span className="category-item">Keyboards</span>
        <span className="category-item">Components</span>
        <span className="category-item">Storage</span>
        <span className="category-item" style={{ color: "#2563eb" }}>
          Summer Deals
        </span>
      </div>

      <main className="container">
        {/* Improved Main View Banner */}
        <div className="hero">
          <h1>
            Upgrade Your Desk. <br /> Elevate Your Performance.
          </h1>
          <p>
            Browse our curated collection of professional tech products. Free
            shipping on all orders over $99.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              className="cta-button"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontSize: "0.95rem",
              }}
            >
              Shop Now
            </button>
            <button
              className="cta-button"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                fontSize: "0.95rem",
                background: "transparent",
                border: "1px solid var(--border)",
                boxShadow: "none",
                color: "var(--text-main)",
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id || product.sku} className="product-card">
              <div className="image-wrapper">
                <img src={product.image} alt={product.name} />
              </div>
              <span className="product-tag">{product.category}</span>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              <div className="price-row">
                <span className="price">${product.price}</span>
                <button className="add-btn">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && !loading && (
            <div
              style={{
                textAlign: "center",
                gridColumn: "1 / -1",
                padding: "6rem 2rem",
                background: "var(--card-bg)",
                borderRadius: "32px",
                border: "1px solid var(--border)",
              }}
            >
              <h2 style={{ color: "white", marginBottom: "1rem" }}>
                No signals detected.
              </h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
                Establish a database connection to restore the catalog link.
              </p>
              <button
                className="cta-button"
                onClick={fetchProducts}
                style={{
                  padding: "0.75rem 2rem",
                  fontSize: "0.95rem",
                }}
              >
                Reconnect
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Real-time Cluster Monitor Sticker */}
      {lastRequestInfo && (
        <div className="monitor-sticker">
          <div
            className="monitor-header"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <div
              className="node-chip"
              style={{
                background: "var(--primary)",
                padding: "2px 8px",
                borderRadius: "6px",
                fontSize: "0.7rem",
                fontWeight: "700",
              }}
            >
              CLUSTER MONITOR
            </div>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#10b981",
                boxShadow: "0 0 10px #10b981",
              }}
            ></div>
          </div>
          <div
            className="status-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.8rem",
            }}
          >
            <span
              className="status-label"
              style={{ color: "var(--text-muted)" }}
            >
              Node:
            </span>
            <span
              className="status-value"
              style={{
                fontFamily: "monospace",
                fontWeight: "600",
                color: "var(--text-main)",
              }}
            >
              {lastRequestInfo.nodeName}
            </span>
          </div>
          <div
            className="status-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.8rem",
            }}
          >
            <span
              className="status-label"
              style={{ color: "var(--text-muted)" }}
            >
              Pod:
            </span>
            <span
              className="status-value"
              style={{
                fontFamily: "monospace",
                fontWeight: "600",
                fontSize: "0.7rem",
                color: "var(--text-main)",
              }}
            >
              {lastRequestInfo.podName}
            </span>
          </div>
          <div
            className="status-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.8rem",
            }}
          >
            <span
              className="status-label"
              style={{ color: "var(--text-muted)" }}
            >
              Pod IP:
            </span>
            <span
              className="status-value"
              style={{
                fontFamily: "monospace",
                fontWeight: "600",
                color: "var(--text-main)",
              }}
            >
              {lastRequestInfo.podIp}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
