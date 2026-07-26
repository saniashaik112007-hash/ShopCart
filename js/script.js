/* ============================================
   MAIN SCRIPT - Ecommerce Website
   ============================================ */

// ===== PRODUCT DATABASE (Fetched from API) =====

let products = [];

// Fallback products when API is unavailable
const FALLBACK_PRODUCTS = [
  // Electronics
  { _id: "1", name: "Wireless Bluetooth Headphones", category: "Electronics", price: 2499, oldPrice: 4999, discount: 50, rating: 4.5, reviews: 2342, image: "🎧", description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal clear sound quality." },
  { _id: "2", name: "Smart Watch Pro Max", category: "Electronics", price: 3999, oldPrice: 7999, discount: 50, rating: 4.3, reviews: 1845, image: "⌚", description: "Advanced smartwatch with health monitoring, GPS tracking, waterproof design." },
  { _id: "3", name: "Bluetooth Speaker Boom", category: "Electronics", price: 1499, oldPrice: 2999, discount: 50, rating: 4.6, reviews: 3120, image: "🔊", description: "Portable Bluetooth speaker with powerful bass, 12-hour playtime." },
  { _id: "4", name: "USB-C Fast Charger 65W", category: "Electronics", price: 999, oldPrice: 1999, discount: 50, rating: 4.4, reviews: 5621, image: "🔌", description: "GaN fast charger with 65W power delivery." },
  // Fashion
  { _id: "5", name: "Classic Denim Jacket", category: "Fashion", price: 1899, oldPrice: 3799, discount: 50, rating: 4.2, reviews: 1560, image: "🧥", description: "Timeless denim jacket crafted from premium cotton." },
  { _id: "6", name: "Running Shoes Ultra", category: "Fashion", price: 2999, oldPrice: 5999, discount: 50, rating: 4.7, reviews: 4200, image: "👟", description: "Lightweight running shoes with responsive cushioning." },
  { _id: "7", name: "Casual Cotton T-Shirt", category: "Fashion", price: 599, oldPrice: 1199, discount: 50, rating: 4.1, reviews: 8900, image: "👕", description: "Soft 100% organic cotton t-shirt." },
  { _id: "8", name: "Leather Wallet Premium", category: "Fashion", price: 1299, oldPrice: 2599, discount: 50, rating: 4.5, reviews: 3450, image: "👛", description: "Handcrafted genuine leather wallet." },
  // Beauty
  { _id: "9", name: "Vitamin C Face Serum", category: "Beauty", price: 649, oldPrice: 1299, discount: 50, rating: 4.4, reviews: 6720, image: "🧴", description: "Brightening vitamin C serum with hyaluronic acid." },
  { _id: "10", name: "Professional Makeup Kit", category: "Beauty", price: 2499, oldPrice: 4999, discount: 50, rating: 4.3, reviews: 2890, image: "💄", description: "Complete 48-color makeup palette." },
  { _id: "11", name: "Organic Hair Oil", category: "Beauty", price: 449, oldPrice: 899, discount: 50, rating: 4.6, reviews: 12450, image: "🧴", description: "100% organic hair oil with coconut and argan." },
  // Home Appliances
  { _id: "12", name: "Smart LED Bulb WiFi", category: "Home Appliances", price: 799, oldPrice: 1599, discount: 50, rating: 4.3, reviews: 8900, image: "💡", description: "WiFi-enabled smart LED bulb with voice control." },
  { _id: "13", name: "Air Purifier HEPA", category: "Home Appliances", price: 6999, oldPrice: 13999, discount: 50, rating: 4.5, reviews: 2340, image: "🌀", description: "HEPA air purifier removes 99.97% of pollutants." },
  { _id: "14", name: "Electric Kettle 1.5L", category: "Home Appliances", price: 899, oldPrice: 1799, discount: 50, rating: 4.4, reviews: 15670, image: "🫖", description: "Stainless steel electric kettle with auto shut-off." },
  // Books
  { _id: "15", name: "JavaScript: The Good Parts", category: "Books", price: 499, oldPrice: 999, discount: 50, rating: 4.8, reviews: 4500, image: "📚", description: "Essential guide to JavaScript best practices." },
  { _id: "16", name: "Atomic Habits", category: "Books", price: 399, oldPrice: 799, discount: 50, rating: 4.9, reviews: 28900, image: "📖", description: "Build Good Habits & Break Bad Ones by James Clear." },
  { _id: "17", name: "The Alchemist", category: "Books", price: 299, oldPrice: 599, discount: 50, rating: 4.7, reviews: 34500, image: "📕", description: "Paulo Coelho's enchanting novel." },
  // Sports
  { _id: "18", name: "Yoga Mat Premium", category: "Sports", price: 999, oldPrice: 1999, discount: 50, rating: 4.5, reviews: 8900, image: "🧘", description: "Non-slip premium yoga mat." },
  { _id: "19", name: "Dumbbell Set 20kg", category: "Sports", price: 3499, oldPrice: 6999, discount: 50, rating: 4.3, reviews: 4500, image: "🏋️", description: "Adjustable dumbbell set with storage stand." },
  { _id: "20", name: "Smart Fitness Band", category: "Sports", price: 1999, oldPrice: 3999, discount: 50, rating: 4.4, reviews: 12300, image: "⌚", description: "Fitness tracker with heart rate monitor." }
];

// Helper: render product image (supports emoji or URL)
function renderProductImage(image, fontSize = 80) {
  if (!image) return `<div style="font-size: ${fontSize}px;">📦</div>`;
  // Check if it's an emoji (single Unicode character or emoji sequence)
  const isEmoji = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)$/u.test(image.trim()) || 
                  /^[\u{1F000}-\u{1FFFF}]/u.test(image) ||
                  /^[\u{2600}-\u{27BF}]/u.test(image) ||
                  /^[\u{2702}-\u{27B0}]/u.test(image) ||
                  /^[🎧⌚🔊🔌🧥👟👕👛🧴💄💡🌀🫖📚📖📕🧘🏋️👔👗👠👑🎒👜👓🎮📱💻🖥️⌨️🖱️📷🎥📽️🎞️📺📻🔋🔅🛒🛍️]/.test(image);
  
  if (isEmoji) {
    return `<div style="font-size: ${fontSize}px; text-align: center;">${image}</div>`;
  } else {
    // It's a URL path - render as <img>
    return `<img src="${image}" alt="Product" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div style="font-size: ${fontSize}px; display: none;">📦</div>`;
  }
}

// Load products from backend API
async function loadProducts() {
  try {
    // Check if getProductsAPI is defined (api.js loaded correctly)
    if (typeof getProductsAPI === 'undefined') {
      console.warn('getProductsAPI is not defined - using fallback products');
      products = [...FALLBACK_PRODUCTS];
      reinitializePage();
      return;
    }
    
    const data = await getProductsAPI();
    products = data.products || [];
    
    // If no products from API, seed them
    if (products.length === 0) {
      try {
        // The seed route is GET /api/products/seed
        const seedRes = await fetch(`${API_BASE_URL}/products/seed`);
        if (seedRes.ok) {
          const retryData = await getProductsAPI();
          products = retryData.products || [];
        }
      } catch (seedErr) {
        console.warn('Seed failed, using fallback:', seedErr.message);
      }
    }
    
    // If still no products, use fallback
    if (products.length === 0) {
      products = [...FALLBACK_PRODUCTS];
    }
    
    // Re-render after products load
    reinitializePage();
  } catch (error) {
    console.error('Failed to load products from API:', error);
    // Use fallback products
    products = [...FALLBACK_PRODUCTS];
    reinitializePage();
    console.log('Using fallback products');
  }
}

function reinitializePage() {
  const path = window.location.pathname;
  
  if (path.includes('product-details')) {
    loadProductDetails();
  } else if (path.includes('products')) {
    initProductsPage();
  } else if (path.includes('index') || path === '/' || path.endsWith('e-commerce web app') || path.endsWith('Ecommerce-Website') || path.endsWith('Ecommerce-Website/')) {
    initHomepage();
  }
}

// ===== RENDER PRODUCTS =====

function renderProducts(productsToRender, containerId = 'productsGrid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = productsToRender.map(product => {
    const fullStars = Math.floor(product.rating);
    const halfStar = product.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '★';
    if (halfStar) stars += '½';
    for (let i = 0; i < emptyStars; i++) stars += '☆';

    return `
      <div class="product-card" data-category="${product.category}" data-price="${product.price}">
        <div class="product-image">
          ${renderProductImage(product.image, 80)}
          <span class="product-badge">${product.discount}% OFF</span>
          <span class="product-wishlist" onclick="event.stopPropagation()">♡</span>
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-rating">
            <span class="stars">${stars}</span>
            <span class="rating-count">(${product.reviews.toLocaleString()})</span>
          </div>
          <div class="product-price">
            <span class="current-price">₹${product.price.toLocaleString()}</span>
            <span class="old-price">₹${product.oldPrice.toLocaleString()}</span>
            <span class="discount">${product.discount}% off</span>
          </div>
          <div class="product-actions">
            <button class="btn btn-primary btn-sm" onclick="handleAddToCart('${product._id}')">
              🛒 Add to Cart
            </button>
            <button class="btn btn-secondary btn-sm" onclick="viewDetails('${product._id}')">
              👁️ View
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== HANDLE ADD TO CART FROM PRODUCT CARDS =====

function handleAddToCart(productId) {
  const product = products.find(p => p._id === productId);
  if (product) {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    
    // Animate button
    const buttons = document.querySelectorAll('.product-card .btn-primary');
    buttons.forEach(btn => {
      if (btn.textContent.includes('Add to Cart')) {
        btn.textContent = '✅ Added!';
        btn.style.background = '#27ae60';
        setTimeout(() => {
          btn.textContent = '🛒 Add to Cart';
          btn.style.background = '';
        }, 1500);
      }
    });
  }
}

// ===== VIEW DETAILS =====

function viewDetails(productId) {
  window.location.href = `product-details.html?id=${productId}`;
}

// ===== LOAD PRODUCT DETAILS =====

function loadProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const container = document.getElementById('productDetailsContainer');
  
  if (!container) return;

  if (!productId) {
    container.innerHTML = '<p style="text-align:center;padding:40px;">Product not found. <a href="products.html">Browse products</a></p>';
    return;
  }

  const product = products.find(p => p._id === productId);
  
  if (!product) {
    container.innerHTML = '<p style="text-align:center;padding:40px;">Product not found. <a href="products.html">Browse products</a></p>';
    return;
  }

  const fullStars = Math.floor(product.rating);
  const halfStar = product.rating % 1 >= 0.5 ? 1 : 0;
  const stars = '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(5 - fullStars - halfStar);

  // Update page title
  document.title = product.name + ' | ShopCart';

  container.innerHTML = `
    <div class="product-details">
      <div class="product-gallery">
        <div class="main-image">
          ${renderProductImage(product.image, 150)}
        </div>
        <div class="thumbnails">
          <div style="width:70px;height:70px;background:var(--gradient-card);border-radius:8px;display:flex;align-items:center;justify-content:center;border:2px solid var(--primary);">${renderProductImage(product.image, 30)}</div>
          <div style="width:70px;height:70px;background:var(--gradient-card);border-radius:8px;display:flex;align-items:center;justify-content:center;">${renderProductImage(product.image, 30)}</div>
          <div style="width:70px;height:70px;background:var(--gradient-card);border-radius:8px;display:flex;align-items:center;justify-content:center;">${renderProductImage(product.image, 30)}</div>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category" style="text-transform:uppercase;letter-spacing:1px;color:var(--primary);font-weight:600;font-size:13px;">${product.category}</div>
        <h1 class="product-title">${product.name}</h1>
        <p class="product-brand">Brand: <span>ShopCart Exclusive</span></p>
        
        <div class="product-rating-big">
          <span class="rating-box">${product.rating} ★</span>
          <span style="color:var(--text-light);">${product.reviews.toLocaleString()} ratings</span>
        </div>

        <div class="product-price-section">
          <span class="price">₹${product.price.toLocaleString()}</span>
          <span class="old-price">₹${product.oldPrice.toLocaleString()}</span>
          <span class="discount">${product.discount}% OFF</span>
          <p style="color:#27ae60;font-weight:600;margin-top:5px;font-size:14px;">You save ₹${(product.oldPrice - product.price).toLocaleString()}</p>
        </div>

        <p class="product-description">${product.description}</p>

        <div class="quantity-selector">
          <span style="font-weight:600;">Quantity:</span>
          <button onclick="changeQty(-1)">−</button>
          <input type="number" id="qtyInput" value="1" min="1" max="10" readonly>
          <button onclick="changeQty(1)">+</button>
        </div>

        <div class="product-details-actions">
          <button class="btn btn-primary btn-lg" onclick="addToCartFromDetails()" style="flex:1;">
            🛒 Add to Cart
          </button>
          <button class="btn btn-secondary btn-lg" onclick="buyNow()" style="flex:1;">
            ⚡ Buy Now
          </button>
        </div>

        <div style="margin-top:25px;padding:15px;background:rgba(39,174,96,0.1);border-radius:8px;border:1px solid rgba(39,174,96,0.2);">
          <p style="font-size:14px;color:#27ae60;">✅ Free delivery on orders above ₹500</p>
          <p style="font-size:14px;color:#27ae60;">🔄 30-day easy returns</p>
          <p style="font-size:14px;color:#27ae60;">🔒 Secure payment</p>
        </div>
      </div>
    </div>
  `;
}

// ===== PRODUCT DETAILS - Quantity =====

function changeQty(delta) {
  const input = document.getElementById('qtyInput');
  if (!input) return;
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  input.value = val;
}

function addToCartFromDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const product = products.find(p => p._id === productId);
  const qty = parseInt(document.getElementById('qtyInput')?.value || 1);
  
  if (product) {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty
    });
  }
}

function buyNow() {
  addToCartFromDetails();
  setTimeout(() => {
    window.location.href = 'checkout.html';
  }, 500);
}

// ===== PRODUCTS PAGE - FILTERS =====

function initProductsPage() {
  const categoryFilter = document.getElementById('filterCategory');
  const sortFilter = document.getElementById('sortPrice');
  const searchInput = document.getElementById('productSearch');
  const countDisplay = document.getElementById('productsCount');

  if (!categoryFilter) return;

  let filteredProducts = [...products];

  function updateProducts() {
    let result = [...products];

    // Category filter
    const category = categoryFilter.value;
    if (category) {
      result = result.filter(p => p.category === category);
    }

    // Search filter
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    const sort = sortFilter.value;
    if (sort === 'low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount') {
      result.sort((a, b) => b.discount - a.discount);
    }

    filteredProducts = result;
    renderProducts(filteredProducts, 'productsGrid');
    
    if (countDisplay) {
      countDisplay.textContent = `Showing ${result.length} of ${products.length} products`;
    }
  }

  categoryFilter.addEventListener('change', updateProducts);
  if (sortFilter) sortFilter.addEventListener('change', updateProducts);
  if (searchInput) {
    searchInput.addEventListener('input', updateProducts);
  }

  // Initial render
  updateProducts();
}

// ===== HOMEPAGE - FEATURED PRODUCTS =====

function initHomepage() {
  // Featured products (first 8)
  const featured = products.slice(0, 8);
  renderProducts(featured, 'featuredProducts');

  // Category cards click
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      window.location.href = `products.html?category=${category}`;
    });
  });
}

// ===== PROFILE PAGE =====

function initProfilePage() {
  requireAuth();
  
  const user = getCurrentUser();
  if (!user) return;

  // Set user info
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileEmail2').textContent = user.email;
  document.getElementById('profilePhone').textContent = user.phone || 'Not provided';
  document.getElementById('profileJoined').textContent = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently';
  document.getElementById('profileAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('profileAvatarName').textContent = user.name;

  // Load orders
  const orders = JSON.parse(localStorage.getItem('ecommerce_orders')) || [];
  const ordersContainer = document.getElementById('ordersList');
  
  if (orders.length === 0) {
    ordersContainer.innerHTML = `
      <div style="text-align:center;padding:40px;">
        <div style="font-size:50px;margin-bottom:15px;">📦</div>
        <h3 style="color:var(--text-dark);margin-bottom:5px;">No orders yet</h3>
        <p style="color:var(--text-light);">Start shopping to see your orders here!</p>
        <a href="products.html" class="btn btn-primary" style="margin-top:15px;display:inline-flex;">🛍️ Shop Now</a>
      </div>
    `;
  } else {
    ordersContainer.innerHTML = orders.map(order => `
      <div class="order-card">
        <div class="order-header">
          <span class="order-id">📋 ${order.id}</span>
          <span class="order-status ${order.status === 'Delivered' ? 'delivered' : 'pending'}">${order.status}</span>
        </div>
        <div style="font-size:13px;color:var(--text-light);">
          Placed on ${order.date} • ${order.items.length} item(s)
        </div>
        <div class="order-total">Total: ₹${order.grandTotal.toLocaleString()}</div>
        <div style="font-size:13px;color:var(--text-light);margin-top:5px;">
          Payment: ${order.payment} • Delivered to ${order.customer.name}
        </div>
      </div>
    `).join('');
  }

  // Logout button
  document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
    e.preventDefault();
    logoutUser();
  });
}

// ===== CHECKOUT PAGE =====

function initCheckoutPage() {
  requireAuth();
  renderCheckoutSummary();

  // Payment option selection
  document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      this.querySelector('input[type="radio"]').checked = true;
    });
  });

  // Place order button
  document.getElementById('placeOrderBtn')?.addEventListener('click', placeOrder);
}

// ===== NAVBAR SCROLL EFFECT =====

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

// ===== PAGE LOADER =====

function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 500);
    });
    
    // Fallback in case load event already fired
    setTimeout(() => {
      if (!loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
      }
    }, 2000);
  }
}

// ===== INITIALIZE ALL PAGES =====

document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initPageLoader();
  updateAuthUI();
  updateCartBadge();
  loadProducts();

  // Detect current page and initialize accordingly
  const path = window.location.pathname;
  
  if (path.includes('product-details')) {
    loadProductDetails();
  } else if (path.includes('products')) {
    initProductsPage();
  } else if (path.includes('cart')) {
    renderCartPage();
  } else if (path.includes('checkout')) {
    initCheckoutPage();
  } else if (path.includes('profile')) {
    initProfilePage();
  } else if (path.includes('index') || path === '/' || path.endsWith('e-commerce web app') || path.endsWith('Ecommerce-Website') || path.endsWith('Ecommerce-Website/')) {
    initHomepage();
  } else {
    // Default to homepage if no match
    initHomepage();
  }
});

