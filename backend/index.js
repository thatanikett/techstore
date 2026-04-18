const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const os = require("os");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const Redis = require("ioredis");

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/postgres";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

// Redis Client & Session Store
const redisClient = new Redis(REDIS_URL);
redisClient.on("error", (err) => console.error("Redis Client Error", err));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "bluegreen-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // In production behind a proxy, set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);

async function ensureConnection(retries = 10, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      console.log("Postgres connected");
      return;
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      console.log(
        `Postgres not ready yet (attempt ${attempt}/${retries}). Retrying in ${delayMs}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, sku, name, price, category, image, description
       FROM products
       ORDER BY category ASC, name ASC`,
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cart endpoints
app.get("/cart", (req, res) => {
  const cart = req.session.cart || [];
  res.json(cart);
});

app.post("/cart", (req, res) => {
  const product = req.body;
  if (!req.session.cart) {
    req.session.cart = [];
  }
  req.session.cart.push(product);
  res.json(req.session.cart);
});

app.delete("/cart", (req, res) => {
  req.session.cart = [];
  res.json([]);
});

// Orders endpoint
app.post("/orders", async (req, res) => {
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }
  const amount = cart.reduce((total, item) => total + Number(item.price), 0);
  const payment_method = req.body.payment_method || "online";
  const user_id = "demo-user"; // Simplified for demo
  const status = "completed";

  try {
    const result = await pool.query(
      `INSERT INTO orders (user_id, amount, status, payment_method) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [user_id, amount, status, payment_method],
    );
    req.session.cart = []; // clear cart
    res.json({ success: true, orderId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/info", (req, res) => {
  res.json({
    version: process.env.APP_VERSION || "V1",
    hostname: os.hostname() || "localhost",
  });
});

async function start() {
  try {
    await ensureConnection();

    // Flyway handles migrations but let's make sure products exist (simplification for missing inserts)
    try {
      const counts = await pool.query("SELECT COUNT(*) FROM products");
      if (counts.rows[0].count == 0) {
        await pool.query(`INSERT INTO products (id, sku, name, price, category, image, description) VALUES 
          (1, 'MON-001', 'UltraWide Pro Display', 899.99, 'Monitors', '/image copy.png', '34-inch curved professional display'),
          (2, 'CHAS-001', 'Open Frame Chassis', 249.99, 'Case', '/image copy 4.png', 'Premium open-air desktop chassis')
        ON CONFLICT DO NOTHING;`);
      }
    } catch (err) {}

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
