import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
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

function CakeCard({
  cake,
  addToCart,
  wishlist,
  toggleWishlist
}) {
  const isFavourite = wishlist.some(
    (item) => item.id === cake.id
  );

  return (
    <div className="cake-card">
      <div className="cake-image-container">
        <img src={cake.image} alt={cake.name} />

        <button
          className={`wishlist-button ${
            isFavourite ? "active" : ""
          }`}
          onClick={() => toggleWishlist(cake)}
          aria-label={
            isFavourite
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          title={
            isFavourite
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          {isFavourite ? "❤️" : "🤍"}
        </button>
      </div>

      <h3>{cake.name}</h3>
      <p className="price">₹{cake.price}</p>

      <button
        className="add-button"
        onClick={() => addToCart(cake)}
      >
        🛒 Add to Cart
      </button>
    </div>
  );
}


function Home({
  addToCart,
  wishlist,
  toggleWishlist
}) {
  const [search, setSearch] = useState("");

  const filteredCakes = cakes.filter((cake) =>
    cake.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <>
      <section className="hero">
        <h1>Sweet Cakes 🎂</h1>
        <p>Every celebration deserves a delicious cake!</p>
        <a href="#cakes" className="shop-button">
          Shop Cakes
        </a>
      </section>

      <section id="cakes" className="cakes-section">
        <h2>Our Delicious Cakes 🍰</h2>

        <div className="search-container">
          <input
            type="search"
            className="search-bar"
            placeholder="🔍 Search your favourite cake..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
            >
              Clear
            </button>
          )}
        </div>

        <p className="result-count">
          {filteredCakes.length} cake(s) found
        </p>

        <div className="cake-grid">
          {filteredCakes.map((cake) => (
            <CakeCard
              key={cake.id}
              cake={cake}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          ))}
        </div>

        {filteredCakes.length === 0 && (
          <div className="empty-message">
            <h3>😔 No cakes found!</h3>
            <p>Try searching for Chocolate, Vanilla or Birthday Cake.</p>
            <button onClick={() => setSearch("")}>
              Show All Cakes
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function Wishlist({
  wishlist,
  toggleWishlist,
  addToCart
}) {
  return (
    <section className="cakes-section wishlist-section">
      <h2>❤️ My Wishlist</h2>
      <p>Your favourite cakes, all in one place!</p>

      {wishlist.length === 0 ? (
        <div className="empty-message">
          <h3>Your wishlist is empty 🤍</h3>
          <p>Tap the heart on a cake to save it here.</p>
          <Link to="/" className="shop-button">
            Explore Cakes
          </Link>
        </div>
      ) : (
        <div className="cake-grid">
          {wishlist.map((cake) => (
            <CakeCard
              key={cake.id}
              cake={cake}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Cart({
  cart,
  changeQuantity,
  removeFromCart
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="cart-section">
      <h1>🛒 Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty!</h2>
          <p>Add your favourite cakes to get started.</p>
          <Link to="/" className="shop-button">
            Shop Now
          </Link>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>₹{item.price} each</p>

                <div className="quantity">
                  <button
                    onClick={() => changeQuantity(item.id, -1)}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => changeQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>

              <strong>
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}

          <div className="cart-total">
            <h2>Total: ₹{total}</h2>
            <button
              onClick={() =>
                alert(
                  "Thank you for shopping with Sweet Cakes! This is a demo order."
                )
              }
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  function addToCart(cake) {
    setCart((previousCart) => {
      const existingCake = previousCart.find(
        (item) => item.id === cake.id
      );

      if (existingCake) {
        return previousCart.map((item) =>
          item.id === cake.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...cake, quantity: 1 }];
    });

    alert(cake.name + " added to cart!");
  }

  function changeQuantity(id, amount) {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    );
  }

  function toggleWishlist(cake) {
    const isFavourite = wishlist.some(
      (item) => item.id === cake.id
    );

    setWishlist((previousWishlist) =>
      isFavourite
        ? previousWishlist.filter(
            (item) => item.id !== cake.id
          )
        : [...previousWishlist, cake]
    );
  }

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <BrowserRouter>
      <header className="navbar">
        <Link to="/" className="logo">
          Sweet Cakes 🍰
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/wishlist">
            ❤️ Wishlist ({wishlist.length})
          </Link>
          <Link to="/cart">
            🛒 Cart ({cartCount})
          </Link>
        </nav>
      </header>

      <Routes>
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
            />
          }
        />
      </Routes>

      <footer>
        <p>© 2026 Sweet Cakes | Made with ❤️</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
