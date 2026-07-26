/* ============================================
   API CONFIGURATION - Backend Connection
   ============================================ */

// Change this to your server URL when deploying
const API_BASE_URL = "http://localhost:5000/api";

// ===== TOKEN MANAGEMENT =====

function getToken() {
  return localStorage.getItem("auth_token");
}

function setToken(token) {
  localStorage.setItem("auth_token", token);
}

function removeToken() {
  localStorage.removeItem("auth_token");
}

function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ===== GENERIC API REQUEST =====

async function apiRequest(endpoint, method = "GET", body = null) {
  const config = {
    method,
    headers: getAuthHeaders(),
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error.message);
    throw error;
  }
}

// ===== AUTH API =====

async function loginAPI(email, password) {
  const data = await apiRequest("/auth/login", "POST", { email, password });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

async function registerAPI(name, email, phone, password) {
  const data = await apiRequest("/auth/register", "POST", {
    name,
    email,
    phone,
    password,
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

async function getMeAPI() {
  return await apiRequest("/auth/me");
}

// ===== PRODUCTS API =====

async function getProductsAPI(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await apiRequest(`/products${query ? "?" + query : ""}`);
}

async function getProductByIdAPI(id) {
  return await apiRequest(`/products/${id}`);
}

// ===== CART API =====

async function getCartAPI() {
  return await apiRequest("/cart");
}

async function addToCartAPI(productId, quantity = 1) {
  return await apiRequest("/cart/add", "POST", { productId, quantity });
}

async function updateCartItemAPI(productId, quantity) {
  return await apiRequest(`/cart/update/${productId}`, "PUT", { quantity });
}

async function removeFromCartAPI(productId) {
  return await apiRequest(`/cart/remove/${productId}`, "DELETE");
}

async function clearCartAPI() {
  return await apiRequest("/cart/clear", "DELETE");
}

// ===== ORDERS API =====

async function placeOrderAPI(shippingAddress, paymentMethod) {
  return await apiRequest("/orders", "POST", { shippingAddress, paymentMethod });
}

async function getMyOrdersAPI() {
  return await apiRequest("/orders/myorders");
}

// ===== USERS API =====

async function getUserProfileAPI() {
  return await apiRequest("/users/profile");
}

async function updateUserProfileAPI(data) {
  return await apiRequest("/users/profile", "PUT", data);
}

