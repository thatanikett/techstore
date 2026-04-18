CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL
);

INSERT INTO products (sku, name, category, price, image, description)
VALUES
  (
    'MON-4K-001',
    '32" Ultra-Wide 4K Monitor',
    'Monitors',
    549.99,
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    'Experience crystal-clear visuals with our ultra-wide 4K HDR monitor, perfect for developers and designers.'
  ),
  (
    'KBD-MECH-002',
    'RGB Mechanical Keyboard',
    'Keyboards',
    129.00,
    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    'Professional-grade mechanical keyboard with tactile blue switches and custom RGB lighting.'
  ),
  (
    'MOBO-Z790-003',
    'Z790 Gaming Motherboard',
    'Components',
    299.00,
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    'High-performance Z790 chipset supporting the latest Intel 13th and 14th Gen processors.'
  ),
  (
    'MOUSE-WL-004',
    'Wireless Gaming Mouse',
    'Accessories',
    89.50,
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
    'Lightweight ergonomic design with ultra-fast 1ms response time and long-lasting battery life.'
  ),
  (
    'SSD-NVME-005',
    '2TB NVMe PCIe 5.0 SSD',
    'Storage',
    189.00,
    'https://images.unsplash.com/photo-1597872200370-499df515a442?auto=format&fit=crop&w=900&q=80',
    'Unmatched read/write speeds up to 10,000 MB/s for lightning-fast boot times and data access.'
  ),
  (
    'GPU-RTX-006',
    'GeForce RTX 4080 Super',
    'Components',
    1199.99,
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80',
    'Power your AI development and gaming with the latest NVIDIA architecture and 16GB VRAM.'
  )
ON CONFLICT (sku) DO NOTHING;
