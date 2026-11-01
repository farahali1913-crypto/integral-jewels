
import { useState } from "react";
import { products } from "./data/products.js";
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const categories = [
    "All",
    "Bridal Jewellery",
    "chokar",
    "Earrings",
    "Bracelets",
    "Rings",
  ];

  const money = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);

  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      category === "All" || product.category === category;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    const color = selectedColors[product.id] || "";

    if (product.colors?.length && !color) {
      alert("Please select a colour first.");
      return;
    }

    const cartKey = `${product.id}-${color}`;

    setCart((previous) => {
      const existing = previous.find(
        (item) => item.cartKey === cartKey
      );

      if (existing) {
        return previous.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previous,
        {
          ...product,
          cartKey,
          selectedColor: color,
          quantity: 1,
        },
      ];
    });

    setSelectedProduct(null);
    setCartOpen(true);
  };

  const updateQuantity = (cartKey, amount) => {
    setCart((previous) =>
      previous
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (cartKey) => {
    setCart((previous) =>
      previous.filter((item) => item.cartKey !== cartKey)
    );
  };

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderOnWhatsApp = () => {
    if (!cart.length) {
      alert("Your shopping bag is empty.");
      return;
    }

    const orderLines = cart
      .map(
        (item) =>
          `${item.name}${
            item.selectedColor
              ? ` - Colour: ${item.selectedColor}`
              : ""
          } x ${item.quantity} = ${money(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const message =
      `Assalam-o-Alaikum! I would like to order from Integral Jewels.\n\n` +
      `${orderLines}\n\nTotal: ${money(cartTotal)}\n\n` +
      "Please confirm availability and delivery charges.";

    const whatsappNumber = "923234448011";

    if (!whatsappNumber) {
      alert("WhatsApp ordering will be available soon.");
      return;
    }

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="store">
      <div className="announcement-bar">
        ✧ A little elegance, for every occasion ✧
      </div>

      <header className="navbar">
        <a href="#home" className="brand">
          <span className="brand-symbol">✧</span>
          <span className="brand-name">
            INTEGRAL
            <small>J E W E L S</small>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#shop">Shop</a>
          <a href="#about">Our Story</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          <button
            className="search-icon"
            aria-label="Focus product search"
            onClick={() =>
              document.getElementById("product-search")?.focus()
            }
          >
            ⌕
          </button>

          <button
            className="cart-button"
            onClick={() => setCartOpen(true)}
          >
            Bag <span>{cartCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">
              <span>✧</span> THE ART OF ADORNMENT
            </p>

            <h1>
              Beauty in every
              <br />
              <em>little detail.</em>
            </h1>

            <p className="hero-description">
              Discover jewellery that celebrates your individuality.
              Explore carefully selected pieces for everyday elegance,
              thoughtful gifting and unforgettable occasions.
            </p>

            <a className="primary-button" href="#shop">
              Discover the Collection <span>↗</span>
            </a>

            <p className="hero-note">
              ✧ Jewellery for moments that matter
            </p>
          </div>

          <div className="hero-art">
            <div className="hero-art-inner">
              <span className="hero-sparkle sparkle-one">✧</span>
              <span className="hero-sparkle sparkle-two">✦</span>
              <div className="hero-monogram">I</div>
              <p>THE INTEGRAL COLLECTION</p>
            </div>

            <span className="hero-art-caption">
              ELEGANCE, REDEFINED.
            </span>
          </div>
        </section>

        <section className="trust-strip">
          <div>
            <span>✧</span> Carefully Selected Designs
          </div>
          <div>
            <span>◇</span> Jewellery for Special Moments
          </div>
          <div>
            <span>♡</span> Personalised Order Assistance
          </div>
        </section>

        <section
          className="categories-section section-wrap"
          id="categories"
        >
          <div className="section-heading">
            <p className="eyebrow">FIND YOUR FAVOURITE</p>
            <h2>
              Shop by <em>category</em>
            </h2>
            <p>Little details that make every look your own.</p>
          </div>

          <div className="category-list">
            {categories
              .filter((item) => item !== "All")
              .map((item, index) => (
                <button
                  className="category-pill"
                  key={item}
                  onClick={() => {
                    setCategory(item);
                    document.getElementById("shop")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  <span className="category-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>{item}</span>

                  <span className="category-arrow">↗</span>
                </button>
              ))}
          </div>
        </section>

        <section className="shop-section section-wrap" id="shop">
          <div className="shop-heading">
            <div className="section-heading left-heading">
              <p className="eyebrow">THE COLLECTION</p>
              <h2>
                Pieces to <em>treasure.</em>
              </h2>
              <p>Find a piece that feels uniquely yours.</p>
            </div>

            <div className="shop-controls">
              <label className="search-box">
                <span>⌕</span>
                <input
                  id="product-search"
                  type="search"
                  placeholder="Search jewellery..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </label>

              <select
                className="category-select"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                aria-label="Filter products"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {visibleProducts.length ? (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <article
                  className="product-card"
                  key={product.id}
                >
                  <button
                    className="product-image-button"
                    onClick={() => setSelectedProduct(product)}
                    aria-label={`View ${product.name}`}
                  >
                    {product.discount > 0 && (
                      <span className="discount-badge">
                        {product.discount}% OFF
                      </span>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />

                    <span className="quick-view">
                      View Details ↗
                    </span>
                  </button>

                  <div className="product-info">
                    <p className="product-category">
                      {product.category}
                    </p>

                    <h3>{product.name}</h3>

                    <div className="product-pricing">
                      <span className="product-price">
                        {money(product.price)}
                      </span>

                      {product.originalPrice && (
                        <span className="original-price">
                          {money(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <p className="product-material">
                      {product.material}
                    </p>

                    {product.colors?.length > 0 && (
                      <select
                        className="color-select"
                        value={selectedColors[product.id] || ""}
                        onChange={(event) =>
                          setSelectedColors((previous) => ({
                            ...previous,
                            [product.id]: event.target.value,
                          }))
                        }
                        aria-label={`Choose colour for ${product.name}`}
                      >
                        <option value="">
                          Choose a colour
                        </option>

                        {product.colors.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    )}

                    {product.id === 2 &&
                      selectedColors[product.id] && (
                        <div className="choker-colour-preview">
                          <img
                            src="/images/multicolour-pearl-choker-colours.png"
                            alt="Multicolour Pearl Choker Set in three colours"
                          />
                        </div>
                      )}

                    <button
                      className="add-cart-button"
                      onClick={() => addToCart(product)}
                    >
                      Add to Bag
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <span>✧</span>
              <h3>No jewellery found</h3>
              <p>
                Try another search or choose a different category.
              </p>

              <button
                className="outline-button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                View All Products
              </button>
            </div>
          )}
        </section>

        <section className="story-section" id="about">
          <div className="story-symbol">
            I<span>✧</span>
          </div>

          <div className="story-content">
            <p className="eyebrow">A LITTLE ABOUT US</p>

            <h2>
              Jewellery that feels <em>like you.</em>
            </h2>

            <p>
              At Integral Jewels, we believe the right piece can make
              an ordinary day feel special. Explore our growing
              collection of carefully selected designs for
              celebrations, gifting and everyday elegance.
            </p>

            <a href="#shop" className="text-link">
              Explore our collection <span>↗</span>
            </a>
          </div>
        </section>

        <section className="newsletter-section">
          <span className="newsletter-star">✧</span>

          <p className="eyebrow">A LITTLE NOTE FROM US</p>

          <h2>
            Stay close to <em>the sparkle.</em>
          </h2>

          <p>
            Have a question about a product or an order? We would
            love to help.
          </p>

          <a className="primary-button" href="#shop">
            Explore Jewellery <span>↗</span>
          </a>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-content">
            <span className="section-eyebrow">
              WE'RE HERE FOR YOU
            </span>

            <h2>Let's Connect</h2>

            <p>
              Have a question about our jewellery or need help with
              your order? We'd love to hear from you.
            </p>

            <div className="contact-details">
              <span className="contact-icon">♡</span>

              <div>
                <h3>Chat With Us</h3>
                <p>We're just a message away.</p>
                <strong>+92 323 4448011</strong>
              </div>
            </div>

            <a
              className="contact-whatsapp-button"
              href="https://wa.me/923234448011"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp ↗
            </a>

            <p className="contact-note">
              Instagram coming soon ♡
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-symbol">✧</span>

          <span className="brand-name">
            INTEGRAL
            <small>J E W E L S</small>
          </span>
        </a>

        <p>
          Thoughtful jewellery for your special moments.
        </p>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#about">Our Story</a>
          <a href="#contact">Contact</a>

          <button onClick={() => setCartOpen(true)}>
            Your Bag
          </button>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Integral Jewels
          </span>
          <span>Made with care ♡</span>
        </div>
      </footer>

      {selectedProduct && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
            >
              ×
            </button>

            <div className="modal-image">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />
            </div>

            <div className="modal-details">
              <p className="eyebrow">
                {selectedProduct.category}
              </p>

              <h2>{selectedProduct.name}</h2>

              <div className="product-pricing modal-pricing">
                <span className="product-price">
                  {money(selectedProduct.price)}
                </span>

                {selectedProduct.originalPrice && (
                  <span className="original-price">
                    {money(selectedProduct.originalPrice)}
                  </span>
                )}
              </div>

              <p>{selectedProduct.description}</p>

              <p className="modal-material">
                {selectedProduct.material}
              </p>

              {selectedProduct.colors?.length > 0 && (
                <label className="modal-field">
                  Choose colour

                  <select
                    className="color-select"
                    value={
                      selectedColors[selectedProduct.id] || ""
                    }
                    onChange={(event) =>
                      setSelectedColors((previous) => ({
                        ...previous,
                        [selectedProduct.id]: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select a colour</option>

                    {selectedProduct.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {selectedProduct.id === 2 &&
                selectedColors[selectedProduct.id] && (
                  <div className="choker-colour-preview">
                    <img
                      src="/images/multicolour-pearl-choker-colours.png"
                      alt="Multicolour Pearl Choker Set in three colours"
                    />
                  </div>
                )}

              <button
                className="add-cart-button modal-add-button"
                onClick={() => addToCart(selectedProduct)}
              >
                Add to Bag — {money(selectedProduct.price)}
              </button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
        <div
          className="cart-backdrop"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <p className="eyebrow">YOUR SELECTION</p>
                <h2>Your Shopping Bag</h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping bag"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>♡</span>
                <h3>Your bag is waiting</h3>
                <p>
                  Discover something beautiful for yourself.
                </p>

                <button
                  className="primary-button"
                  onClick={() => setCartOpen(false)}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div
                      className="cart-item"
                      key={item.cartKey}
                    >
                      <img src={item.image} alt={item.name} />

                      <div className="cart-item-info">
                        <h3>{item.name}</h3>

                        {item.selectedColor && (
                          <p>Colour: {item.selectedColor}</p>
                        )}

                        <strong>
                          {money(item.price * item.quantity)}
                        </strong>

                        <div className="quantity-control">
                          <button
                            onClick={() =>
                              updateQuantity(item.cartKey, -1)
                            }
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              updateQuantity(item.cartKey, 1)
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>

                          <button
                            className="remove-item"
                            onClick={() =>
                              removeItem(item.cartKey)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-total-row">
                    <span>Total</span>
                    <strong>{money(cartTotal)}</strong>
                  </div>

                  <p>
                    Delivery charges will be confirmed separately.
                  </p>

                  <button
                    className="whatsapp-button"
                    onClick={orderOnWhatsApp}
                  >
                    Order via WhatsApp ↗
                  </button>

                  <button
                    className="continue-shopping"
                    onClick={() => setCartOpen(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
