/**********************************
 * CART CORE LOGIC (FINAL FIX)
 **********************************/

function getCart() {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cartItems", JSON.stringify(cart));
}

/**********************************
 * UPDATE CART UI
 **********************************/
/**********************************
 * UPDATE CART UI (FIXED)
 **********************************/
function updateCartPanel() {
  const cart = getCart();
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  // Target both specific count elements
  const floatingCountEl = document.getElementById("cartCount");
  const navCountEl = document.getElementById("navCartCount"); 
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    container.innerHTML = `<div class="text-center py-10"><p class="text-gray-400 text-xs italic font-medium">Your jar is empty...</p></div>`;
    totalEl.textContent = "₹0";
    
    // Reset both counts
    if (floatingCountEl) floatingCountEl.textContent = "0";
    if (navCountEl) navCountEl.classList.add("hidden");
    
    checkoutBtn?.setAttribute("disabled", true);
    return;
  }

  checkoutBtn?.removeAttribute("disabled");

  cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;

    const div = document.createElement("div");
    div.className = "flex justify-between items-center bg-white/50 p-3 rounded-2xl border border-orange-50 mb-2";
    div.innerHTML = `
      <div class="flex items-center space-x-3">
        <img src="${item.image}" class="w-12 h-12 rounded-xl object-cover">
        <div>
          <p class="font-bold text-sm">${item.name}</p>
          <div class="flex items-center space-x-2 mt-2">
            <button onclick="changeQty('${item.id}', -1)" class="px-2 bg-orange-100 rounded">-</button>
            <span class="text-xs font-bold">${item.quantity}</span>
            <button onclick="changeQty('${item.id}', 1)" class="px-2 bg-orange-100 rounded">+</button>
          </div>
        </div>
      </div>
      <p class="font-black text-sm">₹${item.price * item.quantity}</p>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = `₹${total}`;
  
  // Update floating button count
  if (floatingCountEl) floatingCountEl.textContent = count;
  
  // Update and show navbar count
  if (navCountEl) {
    navCountEl.textContent = count;
    navCountEl.classList.remove("hidden");
  }
}

/**********************************
 * ADD TO CART (CORRECT)
 **********************************/
function requireCustomerLogin() {
  const token = localStorage.getItem("customerToken");
  if (!token) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}


// Update your addToCart function in cart.js
function addToCart(id, name, price, image, weight, btn) { // Add weight parameter
  let cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id,
      name,
      price: Number(price),
      image,
      weight, // Ensure weight is saved here
      quantity: 1
    });
  }
  saveCart(cart);
  updateCartPanel();
  animateToCart(image, btn);
}


/**********************************
 * QUANTITY CONTROL
 **********************************/
function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart(cart);
  updateCartPanel();
}

function removeItem(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  updateCartPanel();
}

/**********************************
 * CART ANIMATION
 **********************************/
function animateToCart(imageSrc, button) {
  const cartIcon = document.getElementById("cartToggle");
  if (!cartIcon || !button) return;

  const img = document.createElement("img");
  img.src = imageSrc;
  img.className = "fly-img";
  document.body.appendChild(img);

  const btnRect = button.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  img.style.top = btnRect.top + "px";
  img.style.left = btnRect.left + "px";

  requestAnimationFrame(() => {
    img.style.transform = `
      translate(${cartRect.left - btnRect.left}px,
                ${cartRect.top - btnRect.top}px)
      scale(0.1)
    `;
    img.style.opacity = "0";
  });

  setTimeout(() => img.remove(), 800);
}

/**********************************
 * INIT
 **********************************/
function initCartSystem() {
  const toggleBtn = document.getElementById("cartToggle");
  const cartPanel = document.getElementById("cartPanel");
  const checkoutBtn = document.getElementById("checkoutBtn");

  toggleBtn?.addEventListener("click", () => {
    cartPanel?.classList.toggle("hidden");
  });

  checkoutBtn?.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) return;
    window.location.href = "checkout.html";
  });

  updateCartPanel();
}