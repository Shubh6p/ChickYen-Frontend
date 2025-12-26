const API_BASE = "http://localhost:5000/api";

async function loadProducts() {
  const container = document.getElementById("productsContainer");
  if (!container) return;

  try {
    // ✅ FIXED ENDPOINT (PUBLIC)
    const res = await fetch(`${API_BASE}/products/public`);
    const products = await res.json();

    container.innerHTML = "";

    products.forEach(product => {
      const spiceCount = Number(product.spiceLevel) || 1;
      
      // Stock Logic
      const isOutOfStock = product.stock <= 0;
      const isLowStock = product.stock > 0 && product.stock < 10;

      const card = document.createElement("div");
      // Add grayscale and opacity if out of stock
      card.className = `bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group ${isOutOfStock ? 'opacity-75' : ''}`;

      card.innerHTML = `
        <div class="relative overflow-hidden rounded-[2rem] aspect-square bg-gray-100 mb-4">
          <img src="${product.image}" class="object-cover w-full h-full group-hover:scale-110 transition duration-500 ${isOutOfStock ? 'grayscale' : ''}">
          ${
            product.weight
              ? `<div class="absolute bottom-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black">${product.weight}</div>`
              : ""
          }
        </div>

        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-black ${isOutOfStock ? 'text-gray-400' : 'text-gray-800'}">${product.name}</h3>
            <span class="text-lg font-bold text-orange-600">₹${product.price}</span>
          </div>

          <p class="text-sm text-gray-500 mb-4">
            ${product.description}
          </p>

          <span class="text-[10px] font-bold px-2 py-1 rounded-full ${
            isOutOfStock ? 'bg-gray-100 text-gray-500' : 
            isLowStock ? 'bg-red-100 text-red-600' : 'hidden'
          }">
            ${isOutOfStock ? 'Out of Stock' : 'Limited Stock'}
          </span>

          <div class="flex items-center justify-between mt-4">
            <div class="text-xs font-bold text-gray-400 uppercase">
              Spice:
              <span class="text-red-500">${"🌶️".repeat(spiceCount)}</span>
            </div>

            <button
              class="add-btn px-6 py-2 rounded-xl font-bold transition
              ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-orange-600'}"
              ${isOutOfStock ? 'disabled' : ''}
            >
              ${isOutOfStock ? 'Sold Out' : 'Add +'}
            </button>
          </div>
        </div>
      `;

      // Attach click event only if item is in stock
      if (!isOutOfStock) {
          card.querySelector(".add-btn").onclick = (e) =>
              addToCart(
                  product._id, 
                  product.name, 
                  product.price, 
                  product.image, 
                  product.weight, // Pass weight here
                  e.target
              );
      }

      container.appendChild(card);
    });

    // Static "Coming Soon" card remains as it was
    container.insertAdjacentHTML(
      "beforeend",
      `
      <div class="bg-white p-4 rounded-[2.5rem] shadow-sm border border-dashed border-orange-300 flex flex-col justify-between">
            <div class="relative overflow-hidden rounded-[2rem] aspect-square bg-orange-50 flex items-center justify-center">
                <span class="text-orange-600 font-black text-base sm:text-lg text-center px-6">Customize Your Own Pickle</span>
                <div class="absolute top-4 left-4 bg-orange-600 px-3 py-1 rounded-full text-[10px] font-bold text-white">🚧 Coming Soon</div>
            </div>
            <div class="p-4">
                <h3 class="text-lg sm:text-xl font-black text-gray-800">Custom Taste</h3>
                <p class="text-xs sm:text-sm text-gray-500 mb-6">Choose ingredients, spice level, and oil quantity.</p>
                <button onclick="comingSoon()" class="w-full bg-gray-200 text-gray-500 px-6 py-2 rounded-xl font-bold cursor-not-allowed text-sm">Notify Me</button>
            </div>
        </div>
    `
    );
  } catch (err) {
    console.error("❌ Error loading products:", err);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  if (typeof initCartSystem === "function") initCartSystem();
  loadProducts();
});


// Checks if user is logined or not

// Add this to your existing script.js or inside a <script> tag in index.html

function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("customerUser"));
    const token = localStorage.getItem("customerToken"); // Correct key used in auth

    const orderBtn = document.getElementById("order-btn"); // The Login button
    const profileArea = document.getElementById("user-profile"); // Profile dropdown

    if (token && user) {
        // User is logged in: Hide Login button, Show Profile
        if (orderBtn) orderBtn.classList.add("hidden");
        if (profileArea) profileArea.classList.remove("hidden");
        
        // Update user info in dropdown
        const initialEl = document.getElementById("user-initial");
        const nameEl = document.getElementById("user-display-name");
        const emailEl = document.getElementById("user-display-email");

        if (initialEl) initialEl.textContent = user.name ? user.name.charAt(0).toUpperCase() : "U";
        if (nameEl) nameEl.textContent = user.name || "Customer";
        if (emailEl) emailEl.textContent = user.email;
    } else {
        // User is not logged in: Show Login button, Hide Profile
        if (orderBtn) orderBtn.classList.remove("hidden");
        if (profileArea) profileArea.classList.add("hidden");
    }
}

// Toggle Dropdown Logic
document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();

    const profileToggle = document.getElementById("profile-toggle");
    const dropdown = document.getElementById("profile-dropdown");

    if (profileToggle && dropdown) {
        profileToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("hidden");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!dropdown.contains(e.target) && !profileToggle.contains(e.target)) {
                dropdown.classList.add("hidden");
            }
        });
    }
});

function handleLogout() {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerUser");
    localStorage.removeItem("cartItems"); // Optional: clear cart on logout
    window.location.href = "index.html";
}

