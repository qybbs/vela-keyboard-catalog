'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
  image: string;
  description: string;
}

export default function CatalogPage() {
  // Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 3; // 3 columns layout fits perfectly

  // UI States
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch logic
  const fetchProducts = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (search.trim()) {
        queryParams.append('search', search.trim());
      }
      if (category !== 'all') {
        queryParams.append('category', category);
      }
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      const res = await fetch(`/product-service/products?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.content || []);
        setTotal(data.pageable?.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  }, [search, category, page]);

  // Fetch on state change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page to 1 when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  // Subscription Submit
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  // Pagination bounds
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      {/* Top Navigation */}
      <header className={`navbar ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
        <a href="#" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
          {/* Asymmetric geometric sharp V logo */}
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 3h5.5L12 15l4.5-12H22L14 21h-4L2 3z" />
          </svg>
          Vela
        </a>
        <div className="nav-right-group">
          <ul className="nav-links">
            <li><a href="#design">Design</a></li>
            <li><a href="#feel">Feel</a></li>
            <li><a href="#sound">Sound</a></li>
            <li><a href="#specs">Specs</a></li>
          </ul>
          <div className="nav-actions">
            <button className="btn-buy" onClick={() => setIsBuyModalOpen(true)}>Buy</button>
          </div>
        </div>
        
        {/* Mobile Actions */}
        <div className="nav-mobile-actions">
          <button className="btn-buy-mobile" onClick={() => { setIsBuyModalOpen(true); setIsMobileMenuOpen(false); }}>Buy</button>
          <button 
            className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li><a href="#design" onClick={() => setIsMobileMenuOpen(false)}>Design</a></li>
          <li><a href="#feel" onClick={() => setIsMobileMenuOpen(false)}>Feel</a></li>
          <li><a href="#sound" onClick={() => setIsMobileMenuOpen(false)}>Sound</a></li>
          <li><a href="#specs" onClick={() => setIsMobileMenuOpen(false)}>Specs</a></li>
        </ul>
      </div>

      {/* Hero Section — Full-bleed with background image */}
      <section className="hero-section">
        <Image
          src="/product-hero.png"
          alt="Vela V1 75% keyboard"
          fill
          priority
          className="hero-bg-image"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Precision<br />you can feel.</h1>
          <p>A low-profile mechanical keyboard<br />engineered for focus and built to last.</p>
          <div className="hero-cta-group">
            <button className="btn-cta-primary" onClick={() => setIsBuyModalOpen(true)}>Buy Vela</button>
            <a href="#catalog" className="btn-cta-secondary">Explore the craft</a>
          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <main id="catalog" className="catalog-container">

        {/* Filter & Search Controls */}
        <div className="controls-wrapper">
          {/* Search Box */}
          <div className="search-box-container">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="filter-tabs">
            {['all', 'keyboard', 'switch', 'kit'].map((cat) => {
              const labelMap: Record<string, string> = {
                all: 'All Items',
                keyboard: 'Keyboards',
                switch: 'Switches',
                kit: 'Kits',
              };
              return (
                <button
                  key={cat}
                  className={`filter-tab ${category === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {labelMap[cat]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product, idx) => {
              return (
                <div 
                  key={product.id} 
                  className="product-card"
                  style={{ '--card-idx': idx } as React.CSSProperties}
                >
                  <div className="card-image-wrapper">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={280}
                      height={224}
                      priority={idx < 3}
                    />
                  </div>
                  <div className="card-details">
                    <div className="card-category-wrapper">
                      <span className="card-index">
                        {String(product.id).padStart(2, '0')}
                      </span>
                      <span className="card-category">{product.category}</span>
                    </div>
                    <h2 className="card-title">{product.name}</h2>
                    <p className="card-description">{product.description}</p>
                    <div className="card-footer">
                      <span className="card-price">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                      <span className={`card-stock ${product.stock > 0 ? 'learn-more' : 'out-of-stock'}`}>
                        {product.stock > 0 ? 'Learn more' : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <h3>No Products Found</h3>
              <p>Try refining your search terms or changing your category filter.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-wrapper">
            <button
              className="pagination-btn"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              {page} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}

      </main>

      {/* Specs Bar */}
      <section className="specs-bar">
        <div className="specs-bar-inner">
          <div className="spec-cell">
            <span className="spec-label">Layout</span>
            <span className="spec-value">75%</span>
          </div>
          <div className="spec-cell">
            <span className="spec-label">Material</span>
            <span className="spec-value">CNC Aluminum</span>
          </div>
          <div className="spec-cell">
            <span className="spec-label">Mount</span>
            <span className="spec-value">Gasket</span>
          </div>
          <div className="spec-cell">
            <span className="spec-label">Switches</span>
            <span className="spec-value">Hot-swap</span>
          </div>
          <div className="spec-cell">
            <span className="spec-label">Connectivity</span>
            <span className="spec-value">USB-C / Bluetooth</span>
          </div>
          <div className="spec-cell">
            <span className="spec-label">Battery</span>
            <span className="spec-value">40-hour</span>
          </div>
        </div>
      </section>

      {/* Simple Buy Trigger Modal */}
      {isBuyModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBuyModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Vela Store</h3>
            <p>
              Checkout is coming soon. Sign up for notifications below to be the first to know when sales go live!
            </p>
            <button 
              className="btn-buy"
              style={{ width: '100%', padding: '12px 0', fontSize: '13px' }}
              onClick={() => setIsBuyModalOpen(false)}
            >
              Back to Catalog
            </button>
          </div>
        </div>
      )}

      {/* Footer & Subscription Section combined */}
      <footer className="catalog-footer">
        <div className="footer-container">
          {/* Email Subscription Section */}
          <div className="subscription-section">
            <div className="subscription-left">
              <h2>Make the<br />desk quieter.</h2>
              <p>Join thousands building a better workspace.</p>
            </div>
            <div className="subscription-right">
              <form onSubmit={handleSubscribe} className="input-wrapper">
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Notify me</button>
              </form>
              {isSubscribed ? (
                <span className="subscription-success">
                  ✓ Thank you! We will notify you about updates.
                </span>
              ) : (
                <span>Early access. Product updates. No spam.</span>
              )}
            </div>
          </div>

          {/* Divider (Not full width) */}
          <div className="footer-divider"></div>

          {/* Footer Bottom Content */}
          <div className="footer-content">
            <a href="#" className="nav-logo">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3h5.5L12 15l4.5-12H22L14 21h-4L2 3z" />
              </svg>
              Vela
            </a>
            <div className="footer-links">
              <a href="#support">Support</a>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
            </div>
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} Vela Labs. Crafted for focused work.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
