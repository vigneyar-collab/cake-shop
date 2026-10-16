import { useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation
} from "react-router-dom";
import "./App.css";

const cakes = [
  {
    id: 1,
    name: "Chocolate Cake",
    price: 500,
    image: "https://baranbakery.com/wp-content/uploads/2022/10/Chocolate-Ganache-Cake-12-1.jpg"
  },
  {
    id: 2,
    name: "Strawberry Cake",
    price: 600,
    image: "https://www.rainbownourishments.com/wp-content/uploads/2025/02/small-batch-vegan-strawberry-cake-1.1.jpg"
  },
  {
    id: 3,
    name: "Vanilla Cake",
    price: 450,
    image: "https://www.modernhoney.com/wp-content/uploads/2024/12/Vanilla-Cake-10-scaled.jpg"
  },
  {
    id: 4,
    name: "Red Velvet Cake",
    price: 700,
    image: "https://www.rainbownourishments.com/wp-content/uploads/2023/05/vegan-red-velvet-cake-1.jpg"
  },
  {
    id: 5,
    name: "Black Forest Cake",
    price: 550,
    image: "https://www.fnp.com/images/pr/l/v20250612185111/black-forest-cake_1.jpg"
  },
  {
    id: 6,
    name: "Butterscotch Cake",
    price: 480,
    image: "https://www.oyegifts.com/cdn/shop/files/Half-kg-Butter-Scotch-Cake.jpg?v=1778152482"
  },
  {
    id: 7,
    name: "Blueberry Cake",
    price: 650,
    image: "https://teakandthyme.com/wp-content/uploads/2024/10/blueberry-chiffon-cake-DSC_2632-1x1-1200.jpg"
  },
  {
    id: 8,
    name: "Birthday Cake",
    price: 800,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsj__Mo4R2MKhs67v-soLVp5CgN0sSn4-4IzwSjqXmukK2FKotqFR3Ya8&s=10"
  }
];

/* ---------- Small helpers ---------- */

const SPRINKLE_COLORS = ["#ff5c9d", "#ffd36e", "#7be0a8", "#ffffff", "#a98bff"];

// Deterministic sprinkle layout (no randomness, so it never jumps on re-render)
const sprinkles = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  w: 6 + (i % 4) * 3,
  delay: (i % 9) * -1.3,
  duration: 7 + (i % 6) * 1.7,
  rotate: (i * 47) % 180,
  color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length]
}));

const marqueeItems = [
  "🎂 Baked fresh every morning",
  "🍓 Real fruit, real cream",
  "🎁 Custom messages on every cake",
  "🚚 Same-day delivery",
  "✨ Made with love"
];

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} ${className}`}
      style={{ "--d": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.4 + Math.random() * 2,
        size: 7 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 240,
        color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
        round: i % 3 === 0
      })),
    []
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--drift": `${p.drift}px`
          }}
        />
      ))}
    </div>
  );
}

function CakeImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="image-fallback">🍰</div>;
  }

  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

/* ---------- Components ---------- */

function CakeCard({ cake, addToCart, wishlist, toggleWishlist }) {
  const [added, setAdded] = useState(false);
  const cardRef = useRef(null);
  const isFavourite = wishlist.some((item) => item.id === cake.id);

  function handleAdd() {
    addToCart(cake);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  }

  function handleMove(e) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--ry", `${x * 10}deg`);
    card.style.setProperty("--rx", `${-y * 10}deg`);
    card.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  }

  function handleLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--rx", "0deg");
  }

  return (
    <div
      ref={cardRef}
      className="cake-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="cake-image-container">
        <CakeImage src={cake.image} alt={cake.name} />
        <span className="shine" />

        <button
          className={`wishlist-button ${isFavourite ? "active" : ""}`}
          onClick={() => toggleWishlist(cake)}
          aria-label={isFavourite ? "Remove from wishlist" : "Add to wishlist"}
          title={isFavourite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span className="heart">{isFavourite ? "❤️" : "🤍"}</span>
        </button>
      </div>

      <h3>{cake.name}</h3>
      <p className="price">₹{cake.price}</p>

      <button
        className={`add-button ${added ? "added" : ""}`}
        onClick={handleAdd}
      >
        {added ? "✓ Added!" : "🛒 Add to Cart"}
      </button>
    </div>
  );
}

function Home({ addToCart, wishlist, toggleWishlist }) {
  const [search, setSearch] = useState("");

  const filteredCakes = cakes.filter((cake) =>
    cake.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  function scrollToCakes(e) {
    e.preventDefault();
    document
      .getElementById("cakes")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <section className="hero">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {sprinkles.map((s, i) => (
          <span
            key={i}
            className="sprinkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.w,
              background: s.color,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              "--rot": `${s.rotate}deg`
            }}
          />
        ))}

        <div className="hero-content">
          <div className="hero-cake" aria-hidden="true">
            🎂
          </div>

          <h1 aria-label="Sweet Cakes">
            {"Sweet Cakes".split("").map((char, i) => (
              <span
                key={i}
                className="letter"
                style={{ "--i": i }}
                aria-hidden="true"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          <p className="hero-sub">Every celebration deserves a delicious cake!</p>

          <a href="#cakes" className="shop-button" onClick={scrollToCakes}>
            Shop Cakes
          </a>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <span />
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map(
            (item, i) => (
              <span key={i}>{item}</span>
            )
          )}
        </div>
      </div>

      <section id="cakes" className="cakes-section">
        <Reveal>
          <h2 className="section-title">Our Delicious Cakes 🍰</h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="search-container">
            <input
              type="search"
              className="search-bar"
              placeholder="🔍 Search your favourite cake..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button className="clear-search" onClick={() => setSearch("")}>
                Clear
              </button>
            )}
          </div>
        </Reveal>

        <p className="result-count" key={filteredCakes.length}>
          {filteredCakes.length} cake(s) found
        </p>

        <div className="cake-grid">
          {filteredCakes.map((cake, index) => (
            <Reveal key={cake.id} delay={(index % 4) * 90}>
              <CakeCard
                cake={cake}
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            </Reveal>
          ))}
        </div>

        {filteredCakes.length === 0 && (
          <div className="empty-message">
            <div className="empty-emoji">😔</div>
            <h3>No cakes found!</h3>
            <p>Try searching for Chocolate, Vanilla or Birthday Cake.</p>
            <button className="primary-button" onClick={() => setSearch("")}>
              Show All Cakes
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function Wishlist({ wishlist, toggleWishlist, addToCart }) {
  return (
    <section className="cakes-section wishlist-section">
      <h2 className="section-title">❤️ My Wishlist</h2>
      <p className="section-sub">Your favourite cakes, all in one place!</p>

      {wishlist.length === 0 ? (
        <div className="empty-message">
          <div className="empty-emoji">🤍</div>
          <h3>Your wishlist is empty</h3>
          <p>Tap the heart on a cake to save it here.</p>
          <Link to="/" className="shop-button">
            Explore Cakes
          </Link>
        </div>
      ) : (
        <div className="cake-grid">
          {wishlist.map((cake, index) => (
            <Reveal key={cake.id} delay={(index % 4) * 90}>
              <CakeCard
                cake={cake}
                addToCart={addToCart}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

function Cart({ cart, changeQuantity, removeFromCart, placeOrder }) {
  const [removingId, setRemovingId] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleRemove(id) {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 380);
  }

  return (
    <section className="cart-section">
      <h1>🛒 Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-emoji">🛍️</div>
          <h2>Your cart is empty!</h2>
          <p>Add your favourite cakes to get started.</p>
          <Link to="/" className="shop-button">
            Shop Now
          </Link>
        </div>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              className={`cart-item ${removingId === item.id ? "removing" : ""}`}
              key={item.id}
              style={{ "--i": index }}
            >
              <CakeImage src={item.image} alt={item.name} />

              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>₹{item.price} each</p>

                <div className="quantity">
                  <button onClick={() => changeQuantity(item.id, -1)}>−</button>
                  <span key={item.quantity} className="qty-number">
                    {item.quantity}
                  </span>
                  <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                </div>

                <button
                  className="remove-button"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>

              <strong key={item.price * item.quantity} className="line-total">
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}

          <div className="cart-total">
            <h2 key={total}>Total: ₹{total}</h2>
            <button className="primary-button" onClick={placeOrder}>
              Place Order 🎉
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function Header({ wishlistCount, cartCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 30);
      setProgress(max > 0 ? window.scrollY / max : 0);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="progress-bar" style={{ transform: `scaleX(${progress})` }} />

      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="logo">
          Sweet Cakes <span className="logo-emoji">🍰</span>
        </Link>

        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/wishlist">
            ❤️ Wishlist
            <span key={wishlistCount} className="badge">
              {wishlistCount}
            </span>
          </NavLink>
          <NavLink to="/cart">
            🛒 Cart
            <span key={cartCount} className="badge">
              {cartCount}
            </span>
          </NavLink>
        </nav>
      </header>
    </>
  );
}

function Toasts({ toasts }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function OrderModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <Confetti />
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-emoji">🎂</div>
        <h2>Order placed!</h2>
        <p>Thank you for shopping with Sweet Cakes! This is a demo order.</p>
        <button className="primary-button" onClick={onClose}>
          Yay, continue shopping
        </button>
      </div>
    </div>
  );
}

function AppRoutes({
  cart,
  wishlist,
  addToCart,
  changeQuantity,
  removeFromCart,
  toggleWishlist,
  placeOrder
}) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <main key={location.pathname} className="page">
      <Routes location={location}>
        <Route
          path="/"
          element={
            <Home
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          }
        />

        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              changeQuantity={changeQuantity}
              removeFromCart={removeFromCart}
              placeOrder={placeOrder}
            />
          }
        />
      </Routes>
    </main>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const toastId = useRef(0);

  function showToast(message) {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }

  function addToCart(cake) {
    setCart((previousCart) => {
      const existingCake = previousCart.find((item) => item.id === cake.id);

      if (existingCake) {
        return previousCart.map((item) =>
          item.id === cake.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...previousCart, { ...cake, quantity: 1 }];
    });

    showToast(`🛒 ${cake.name} added to cart!`);
  }

  function changeQuantity(id, amount) {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((previousCart) => previousCart.filter((item) => item.id !== id));
  }

  function toggleWishlist(cake) {
    const isFavourite = wishlist.some((item) => item.id === cake.id);

    setWishlist((previousWishlist) =>
      isFavourite
        ? previousWishlist.filter((item) => item.id !== cake.id)
        : [...previousWishlist, cake]
    );

    showToast(
      isFavourite
        ? `💔 ${cake.name} removed from wishlist`
        : `❤️ ${cake.name} saved to wishlist`
    );
  }

  function closeOrder() {
    setOrderOpen(false);
    setCart([]);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <Header wishlistCount={wishlist.length} cartCount={cartCount} />

      <AppRoutes
        cart={cart}
        wishlist={wishlist}
        addToCart={addToCart}
        changeQuantity={changeQuantity}
        removeFromCart={removeFromCart}
        toggleWishlist={toggleWishlist}
        placeOrder={() => setOrderOpen(true)}
      />

      <footer>
        <p>© 2026 Sweet Cakes | Made with ❤️</p>
      </footer>

      <Toasts toasts={toasts} />
      {orderOpen && <OrderModal onClose={closeOrder} />}
    </BrowserRouter>
  );
}

export default App;

