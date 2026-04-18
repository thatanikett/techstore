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

function LandingPage({ onExplore }) {
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
          <button
            type="button"
            className="landing-nav-link"
            onClick={onExplore}
          >
            Catalog
          </button>
          <button type="button" className="landing-nav-link">
            Builds
          </button>
        </nav>
        <div className="landing-nav-actions">
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
              <br />
              gear that
              <br />
              upgrades
              <br />
              your setup
            </h1>
            <p className="landing-subtitle">
              A more cinematic storefront for desktops, displays, and creative
              gear.
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

      <section
        className="landing-section landing-section-proof"
        id="collection"
      >
        <div className="section-intro">
          <p className="section-label">Testimonials</p>
          <h2>
            People remember the atmosphere first, then how easy it was to buy.
          </h2>
        </div>
        <div className="proof-layout">
          <div className="proof-visual">
            <div className="proof-badge">Trusted setups</div>
            <img
              src="/image copy.png"
              alt="Desktop monitor"
              className="proof-monitor"
            />
            <img
              src="/image copy 4.png"
              alt="Open chassis system"
              className="proof-chassis"
            />
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
    </div>
  );
}

function VersionBanner({ version }) {
  if (!version) return null;
  const isV1 = version.toLowerCase() === "v1";
  const bg = isV1 ? "#2563eb" : "#10b981"; // Blue for V1, Green for V2

  return (
    <div
      style={{
        backgroundColor: bg,
        color: "white",
        padding: "8px",
        textAlign: "center",
        fontWeight: "bold",
      }}
    >
      Running Version: {version}
    </div>
  );
}

function StatusWidget({ info }) {
  if (!info) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "rgba(0,0,0,0.8)",
        border: "1px solid rgba(255,255,255,0.1)",
        padding: "15px",
        borderRadius: "8px",
        color: "white",
        zIndex: 9999,
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#10b981",
            boxShadow: "0 0 10px #10b981",
          }}
        />
        <span style={{ fontWeight: "bold" }}>Live Traffic Shift Monitor</span>
      </div>
      <div>
        <strong>Hostname:</strong> {info.hostname}
      </div>
      <div>
        <strong>Version:</strong> {info.version}
      </div>
    </div>
  );
}

function CartModal({ cart, onClose, onCheckout }) {
  const [paymentMethod, setPaymentMethod] = useState("online");
  const total = cart.reduce((add, item) => add + Number(item.price), 0);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          padding: "20px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "400px",
          color: "var(--text-main)",
          border: "1px solid var(--border)",
        }}
      >
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <div style={{ margin: "20px 0" }}>
            {cart.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>{item.name}</span>
                <span>${item.price}</span>
              </div>
            ))}
            <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Payment Method:
            </label>
            <div style={{ display: "flex", gap: "16px" }}>
              <label>
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />{" "}
                Online
              </label>
              <label>
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />{" "}
                Cash on Delivery (COD)
              </label>
            </div>
          </div>
        )}

        <div
          style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
        >
          <button className="secondary-cta-button" onClick={onClose}>
            Close
          </button>
          {cart.length > 0 && (
            <button
              className="cta-button"
              onClick={() => onCheckout(paymentMethod)}
            >
              Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState(getViewFromPath);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [deployInfo, setDeployInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // Live polling every 1 second
  useEffect(() => {
    const fetchInfo = () => {
      fetch(`${BACKEND_URL}/info`)
        .then((res) => res.json())
        .then((data) => setDeployInfo(data))
        .catch((err) => console.error(err));
    };
    fetchInfo();
    const intv = setInterval(fetchInfo, 1000);
    return () => clearInterval(intv);
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

  const fetchCart = () => {
    fetch(`${BACKEND_URL}/cart`)
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error("Error fetching cart data:", err));
  };

  const addToCart = (product) => {
    fetch(`${BACKEND_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error("Error adding to cart:", err));
  };

  const handleCheckout = (paymentMethod) => {
    fetch(`${BACKEND_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_method: paymentMethod }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Checkout successful! Order ID: " + data.orderId);
          setCart([]);
          setShowCart(false);
        }
      })
      .catch((err) => alert("Checkout failed"));
  };

  return (
    <>
      <VersionBanner version={deployInfo?.version} />
      {view === "landing" ? (
        <LandingPage onExplore={() => navigateTo("catalog")} />
      ) : (
        <div className="layout">
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
              <button
                className="nav-link"
                onClick={() => setShowCart(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Cart ({cart.length})
              </button>
            </nav>
          </header>

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
            <div className="hero">
              <h1>
                Upgrade Your Desk. <br /> Elevate Your Performance.
              </h1>
              <p>
                Browse our curated collection of professional tech products.
                Free shipping on all orders over $99.
              </p>
            </div>

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
                    <button
                      className="add-btn"
                      onClick={() => addToCart(product)}
                    >
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
            </div>
          </main>

          {showCart && (
            <CartModal
              cart={cart}
              onClose={() => setShowCart(false)}
              onCheckout={handleCheckout}
            />
          )}
        </div>
      )}
      <StatusWidget info={deployInfo} />
    </>
  );
}

export default App;
