/* ============================================
   AUTHENTICATION MODULE - Login & Signup
   ============================================ */

// ===== USER MANAGEMENT (localStorage fallback + API) =====

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('current_user'));
}

function saveCurrentUser(user) {
  localStorage.setItem('current_user', JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem('current_user');
  removeToken();
  window.location.href = 'login.html';
}

function isLoggedIn() {
  return getCurrentUser() !== null && !!getToken();
}

// Redirect to login if not authenticated
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// ===== VALIDATION FUNCTIONS =====

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  // Remove existing error
  const existingError = input.parentElement.querySelector('.error-message');
  if (existingError) existingError.remove();
  
  // Add error style
  input.style.borderColor = '#e74c3c';
  
  // Create error message
  const error = document.createElement('small');
  error.className = 'error-message';
  error.style.cssText = 'color: #e74c3c; font-size: 12px; margin-top: 5px; display: block;';
  error.textContent = message;
  
  input.parentElement.appendChild(error);
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  input.style.borderColor = '';
  const error = input.parentElement.querySelector('.error-message');
  if (error) error.remove();
}

function clearAllErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  document.querySelectorAll('.auth-form input').forEach(input => {
    input.style.borderColor = '';
  });
}

// ===== LOGIN FUNCTIONALITY =====

function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  // Password toggle
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('loginPassword');
  
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
  }

  // Clear errors on input
  loginForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => clearError(input.id));
  });

  // Form submission
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    clearAllErrors();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    let isValid = true;

    // Validate email
    if (!email) {
      showError('loginEmail', 'Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError('loginEmail', 'Please enter a valid email');
      isValid = false;
    }

    // Validate password
    if (!password) {
      showError('loginPassword', 'Password is required');
      isValid = false;
    } else if (password.length < 6) {
      showError('loginPassword', 'Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) return;

    try {
      const user = await loginAPI(email, password);
      saveCurrentUser(user);
      showToast('Login successful! Welcome back ' + user.name + ' 🎉', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      // Show API error on the form
      const errorMsg = error.message;
      if (errorMsg.toLowerCase().includes('password')) {
        showError('loginPassword', errorMsg);
      } else {
        showError('loginEmail', errorMsg);
      }
    }
  });
}

// ===== SIGNUP FUNCTIONALITY =====

function initSignupForm() {
  const signupForm = document.getElementById('signupForm');
  if (!signupForm) return;

  // Password toggle
  const toggleBtns = document.querySelectorAll('.togglePassword');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
      }
    });
  });

  // Clear errors on input
  signupForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => clearError(input.id));
  });

  // Form submission
  signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    clearAllErrors();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    let isValid = true;

    // Validate name
    if (!name) {
      showError('signupName', 'Full name is required');
      isValid = false;
    } else if (name.length < 2) {
      showError('signupName', 'Name must be at least 2 characters');
      isValid = false;
    }

    // Validate email
    if (!email) {
      showError('signupEmail', 'Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError('signupEmail', 'Please enter a valid email');
      isValid = false;
    }

    // Validate phone
    if (!phone) {
      showError('signupPhone', 'Phone number is required');
      isValid = false;
    } else if (phone.length < 10) {
      showError('signupPhone', 'Please enter a valid phone number');
      isValid = false;
    }

    // Validate password
    if (!password) {
      showError('signupPassword', 'Password is required');
      isValid = false;
    } else if (password.length < 6) {
      showError('signupPassword', 'Password must be at least 6 characters');
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
      showError('signupConfirmPassword', 'Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      showError('signupConfirmPassword', 'Passwords do not match');
      isValid = false;
    }

    if (!isValid) return;

    try {
      const user = await registerAPI(name, email, phone, password);
      saveCurrentUser(user);
      showToast('Account created successfully! 🎉', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      if (error.message.toLowerCase().includes('email')) {
        showError('signupEmail', error.message);
      } else {
        showToast(error.message, 'error');
      }
    }
  });
}

// ===== INITIALIZE AUTH PAGES =====

document.addEventListener('DOMContentLoaded', function() {
  initLoginForm();
  initSignupForm();
  
  // Update UI based on auth state
  updateAuthUI();
});

// ===== UPDATE UI BASED ON AUTH =====

function updateAuthUI() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('loginBtn');
  const profileLink = document.getElementById('profileLink');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');

  if (user) {
    if (loginBtn) {
      loginBtn.innerHTML = '👤 ' + user.name.split(' ')[0];
      loginBtn.href = 'profile.html';
    }
    if (profileLink) {
      profileLink.style.display = 'flex';
    }
    if (userName) userName.textContent = user.name;
    if (userEmail) userEmail.textContent = user.email;
  } else {
    if (loginBtn) {
      loginBtn.innerHTML = '🔑 Login';
      loginBtn.href = 'login.html';
    }
    if (profileLink) {
      profileLink.style.display = 'none';
    }
  }
}

// ===== TOAST NOTIFICATION =====

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) {
    // Create container if it doesn't exist
    const div = document.createElement('div');
    div.id = 'toastContainer';
    div.className = 'toast-container';
    document.body.appendChild(div);
  }

  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${message}`;
  toastContainer.appendChild(toast);

  // Remove after animation
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

