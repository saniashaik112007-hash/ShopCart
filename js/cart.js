/* ============================================
   CART MODULE - Shopping Cart Management
   ============================================ */

// ===== CART DATA STRUCTURE =====
// Cart stored in localStorage for guest users, API for logged-in users

function getCart() {
  return JSON.parse(localStorage.getItem('ecommerce_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
  updateCartBadge();
}

// ===== CART BADGE UPDATE =====

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// ===== ADD TO CART =====

async function addToCart(product) {
  if (!product || !product.id) return;

  // If user is logged in, sync with backend
  if (isLoggedIn()) {
    try {
      await addToCartAPI(product.id, product.quantity || 1);
      // Refresh cart from backend
      await syncCartFromBackend();
      showToast('Item added to cart! 🛒', 'success');
      return;
    } catch (error) {
      console.error('Failed to sync with backend:', error);
      // Fallback to localStorage
    }
  }
  
  let cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += product.quantity || 1;
    showToast('Item quantity updated in cart!', 'info');
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: product.quantity || 1
    });
    showToast('Item added to cart! 🛒', 'success');
  }

  saveCart(cart);
  updateCartBadge();
}

// ===== SYNC CART FROM BACKEND =====

async function syncCartFromBackend() {
  if (!isLoggedIn()) return;
  
  try {
    const cartData = await getCartAPI();
    const cart = (cartData.items || []).map(item => ({
      id: item.product?._id || item.product,
      name: item.name || item.product?.name || 'Product',
      price: item.price,
      image: item.image || item.product?.image || '📦',
      quantity: item.quantity
    }));
    saveCart(cart);
  } catch (error) {
    console.error('Failed to sync cart from backend:', error);
  }
}

// ===== REMOVE FROM CART =====

async function removeFromCart(productId) {
  if (isLoggedIn()) {
    try {
      await removeFromCartAPI(productId);
      await syncCartFromBackend();
      renderCartPage();
      showToast('Item removed from cart', 'info');
      return;
    } catch (error) {
      console.error('Failed to remove from backend:', error);
    }
  }
  
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCartPage();
  showToast('Item removed from cart', 'info');
}

// ===== UPDATE QUANTITY =====

async function updateQuantity(productId, newQuantity) {
  if (isLoggedIn()) {
    try {
      if (newQuantity <= 0) {
        await removeFromCartAPI(productId);
      } else {
        await updateCartItemAPI(productId, newQuantity);
      }
      await syncCartFromBackend();
      renderCartPage();
      return;
    } catch (error) {
      console.error('Failed to update quantity on backend:', error);
    }
  }
  
  let cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    item.quantity = newQuantity;
    saveCart(cart);
    renderCartPage();
  }
}

// ===== GET CART TOTAL =====

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// ===== CLEAR CART =====

async function clearCart() {
  if (isLoggedIn()) {
    try {
      await clearCartAPI();
      await syncCartFromBackend();
      renderCartPage();
      showToast('Cart cleared', 'info');
      return;
    } catch (error) {
      console.error('Failed to clear backend cart:', error);
    }
  }
  
  saveCart([]);
  renderCartPage();
  showToast('Cart cleared', 'info');
}

// ===== RENDER CART PAGE =====

function renderCartPage() {
  const cartContainer = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  const emptyCart = document.getElementById('emptyCart');
  const cartLayout = document.getElementById('cartLayout');
  
  if (!cartContainer) return;

  const cart = getCart();

  // Show/hide empty cart
  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = 'block';
    if (cartContainer) cartContainer.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'none';
    if (cartLayout) cartLayout.style.display = 'none';
    updateCartBadge();
    return;
  }

  if (emptyCart) emptyCart.style.display = 'none';
  if (cartLayout) cartLayout.style.display = 'flex';
  if (cartContainer) cartContainer.style.display = 'flex';
  if (cartSummary) cartSummary.style.display = 'block';

  // Helper to render cart item image (supports emoji or URL)
  function renderCartItemImage(image) {
    if (!image) return '<div style="font-size: 60px;">📦</div>';
    const isEmoji = /^[🎧⌚🔊🔌🧥👟👕👛🧴💄💡🌀🫖📚📖📕🧘🏋️👔👗👠👑🎒👜👓🎮📱💻🖥️⌨️🖱️📷🎥📽️🎞️📺📻🔋🔅🛒🛍️]/.test(image) || /^[\u{1F000}-\u{1FFFF}]/u.test(image);
    if (isEmoji) {
      return `<div style="font-size: 60px; text-align: center;">${image}</div>`;
    } else {
      return `<img src="${image}" alt="Product" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div style="font-size: 60px; display: none;">📦</div>`;
    }
  }

  // Render cart items
  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-image">
        ${renderCartItemImage(item.image)}
      </div>
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
        <div style="font-size:13px;color:var(--text-light);">₹${item.price.toLocaleString()} each</div>
      </div>
      <div class="cart-item-quantity">
        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
      </div>
      <div class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove item">🗑️</div>
    </div>
  `).join('');

  // Update summary
  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  cartSummary.innerHTML = `
    <h3>🛒 Order Summary</h3>
    <div class="cart-summary-row">
      <span>Subtotal (${getCartCount()} items)</span>
      <span>₹${subtotal.toLocaleString()}</span>
    </div>
    <div class="cart-summary-row">
      <span>Shipping</span>
      <span>${shipping === 0 ? 'FREE 🎉' : '₹' + shipping}</span>
    </div>
    <div class="cart-summary-row">
      <span>Discount</span>
      <span style="color:#27ae60;">− ₹0</span>
    </div>
    <div class="cart-summary-row total">
      <span>Total</span>
      <span>₹${total.toLocaleString()}</span>
    </div>
    <button class="btn btn-primary btn-block" onclick="proceedToCheckout()" style="margin-top:20px;">
      Proceed to Checkout → 
    </button>
    <button class="btn btn-secondary btn-block" onclick="clearCart()" style="margin-top:10px;">
      🗑️ Clear Cart
    </button>
  `;

  updateCartBadge();
}

// ===== PROCEED TO CHECKOUT =====

function proceedToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  window.location.href = 'checkout.html';
}

// ===== RENDER CHECKOUT SUMMARY =====

function renderCheckoutSummary() {
  const summaryContainer = document.getElementById('checkoutSummary');
  if (!summaryContainer) return;

  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  // Helper to render checkout item image
  function renderCheckoutImage(image) {
    if (!image) return '<div style="font-size: 40px; width: 60px; text-align: center;">📦</div>';
    const isEmoji = /^[🎧⌚🔊🔌🧥👟👕👛🧴💄💡🌀🫖📚📖📕🧘🏋️👔👗👠👑🎒👜👓🎮📱💻🖥️⌨️🖱️📷🎥📽️🎞️📺📻🔋🔅🛒🛍️]/.test(image) || /^[\u{1F000}-\u{1FFFF}]/u.test(image);
    if (isEmoji) {
      return `<div style="font-size: 40px; width: 60px; text-align: center;">${image}</div>`;
    } else {
      return `<img src="${image}" alt="Product" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div style="font-size: 40px; display: none;">📦</div>`;
    }
  }

  summaryContainer.innerHTML = `
    <h3>Order Items</h3>
    ${cart.map(item => `
      <div class="order-item">
        ${renderCheckoutImage(item.image)}
        <div class="order-item-info">
          <h4>${item.name}</h4>
          <p>Qty: ${item.quantity}</p>
        </div>
        <div class="order-item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
      </div>
    `).join('')}
    <div style="border-top:2px solid rgba(0,0,0,0.05); margin-top:15px; padding-top:15px;">
      <div class="cart-summary-row">
        <span>Subtotal</span>
        <span>₹${subtotal.toLocaleString()}</span>
      </div>
      <div class="cart-summary-row">
        <span>Shipping</span>
        <span>${shipping === 0 ? 'FREE 🎉' : '₹' + shipping}</span>
      </div>
      <div class="cart-summary-row total">
        <span>Total</span>
        <span>₹${total.toLocaleString()}</span>
      </div>
    </div>
  `;
}

// ===== PLACE ORDER =====

async function placeOrder() {
  // Validate form
  const fullName = document.getElementById('checkoutName').value.trim();
  const address = document.getElementById('checkoutAddress').value.trim();
  const city = document.getElementById('checkoutCity').value.trim();
  const state = document.getElementById('checkoutState').value;
  const pincode = document.getElementById('checkoutPincode').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked');

  if (!fullName || !address || !city || !state || !pincode) {
    showToast('Please fill in all shipping details', 'error');
    return;
  }

  if (!payment) {
    showToast('Please select a payment method', 'error');
    return;
  }

  if (pincode.length !== 6) {
    showToast('Please enter a valid 6-digit pincode', 'error');
    return;
  }

  // If user is logged in, place order via backend
  if (isLoggedIn()) {
    try {
      const placeOrderBtn = document.getElementById('placeOrderBtn');
      if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = '⏳ Placing Order...';
      }

      await placeOrderAPI(
        { fullName, address, city, state, pincode },
        payment.value
      );

      // Clear local cart
      saveCart([]);

      showToast('Order placed successfully! 🎉 Thank you for shopping!', 'success');
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 1500);
    } catch (error) {
      showToast(error.message || 'Failed to place order', 'error');
      if (placeOrderBtn) {
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = '✅ Place Order';
      }
    }
    return;
  }

  // Guest user - use localStorage
  const cart = getCart();
  const order = {
    id: 'ORD' + Date.now(),
    items: [...cart],
    total: getCartTotal(),
    shipping: getCartTotal() > 500 ? 0 : 49,
    grandTotal: getCartTotal() + (getCartTotal() > 500 ? 0 : 49),
    customer: { name: fullName, address, city, state, pincode },
    payment: payment.value,
    status: 'Delivered',
    date: new Date().toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    })
  };

  // Save order history
  const orders = JSON.parse(localStorage.getItem('ecommerce_orders')) || [];
  orders.unshift(order);
  localStorage.setItem('ecommerce_orders', JSON.stringify(orders));

  // Clear cart
  saveCart([]);
  
  showToast('Order placed successfully! 🎉 Thank you for shopping!', 'success');
  setTimeout(() => {
    window.location.href = 'profile.html';
  }, 1500);
}

// ===== INITIALIZE =====

document.addEventListener('DOMContentLoaded', function() {
  // If logged in, sync cart from backend
  if (isLoggedIn()) {
    syncCartFromBackend().then(() => {
      updateCartBadge();
      renderCartPage();
      renderCheckoutSummary();
    });
  } else {
    updateCartBadge();
    renderCartPage();
    renderCheckoutSummary();
  }
});

