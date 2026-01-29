// ==============================
// CONFIG & STATE
// ==============================
const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
let editingProductId = null;
let allOrdersData = []; // To store local copy for searching
let editingStaffId = null; // To track if we are adding or editing

// ==============================
// SECURITY CHECK
// ==============================
if (!token || !user || !["admin", "owner"].includes(user.role)) {
    alert("Unauthorized Access! Please login as Admin.");
    window.location.href = "admin-login.html";
}

// ==============================
// TAB SWITCHING (Updated)
// ==============================
function switchTab(tab) {
    // 1. Handle Sidebar UI Styling
    ["orders", "products", "users", "customers", "sales", "locations"].forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if (btn) btn.classList.remove("sidebar-active");
    });
    
    const activeBtn = document.getElementById(`tab-${tab}`);
    if (activeBtn) activeBtn.classList.add("sidebar-active");

    // 2. Control Global UI Elements (Stats & Filters)
    const stats = document.getElementById("stats-container");
    const filters = document.getElementById("filter-controls");
    const addBtn = document.getElementById("sidebar-add-btn");

    // Only show stats and filters if the tab is 'orders'
    if (stats) stats.classList.toggle("hidden", tab !== "orders");
    if (filters) filters.classList.toggle("hidden", tab !== "orders");
    
    // Only show 'New Product' button if the tab is 'products'
    if (addBtn) addBtn.classList.toggle("hidden", tab !== "products");

    // 3. Reset Search and Execute Logic
    const searchInput = document.getElementById("orderSearchInput");
    if (searchInput) searchInput.value = "";

    // 4. View Rendering Logic
    if (tab === "orders") fetchOrders();
    if (tab === "products") renderProductsView();
    if (tab === "customers") renderCustomersView();
    if (tab === "locations") renderLocationsView();
    if (tab === "users") renderUsersView();
    if (tab === "logs") renderLogsView();
    if (tab === "reviews") renderReviewsView();
    if (tab === "sales") {
        fetch(`${API_URL}/orders/all`, { 
            headers: { Authorization: `Bearer ${token}` } 
        })
        .then(res => res.json())
        .then(data => {
            allOrdersData = data;
            renderSalesView();
        })
        .catch(err => console.error("Sales fetch failed:", err));
    }
}

// ==============================
// CUSTOMERS LOGIC (NEW)
// ==============================
async function renderCustomersView(filter = 'all') {
    try {
        const tableHead = document.getElementById("table-head-row");
        if (tableHead) tableHead.innerHTML = "";

        const res = await fetch(`${API_URL}/customers/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch customers");
        let customers = await res.json();

        // 1. Map order counts and spending to each customer
        customers = customers.map(c => {
            const userOrders = allOrdersData.filter(o => o.customerId === c._id);
            return {
                ...c,
                orderCount: userOrders.length,
                totalSpent: userOrders.reduce((sum, o) => sum + o.totalAmount, 0)
            };
        });

        // 2. Apply Filters
        if (filter === 'top') {
            customers = customers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10);
        } else if (filter === 'repeat') {
            customers = customers.filter(c => c.orderCount > 1);
        } else if (filter === 'onetime') {
            customers = customers.filter(c => c.orderCount === 1);
        }

        document.getElementById("view-title").innerText = "Customer Community";
        document.getElementById("view-desc").innerText = `Managing ${customers.length} registered members.`;

        const container = document.getElementById("admin-table-body");
        container.className = "flex flex-col space-y-6 w-full p-4";

        // 3. Inject Filter Buttons & Grid
        container.innerHTML = `
            <div class="flex flex-wrap gap-2 mb-4">
                <button onclick="renderCustomersView('all')" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase ${filter === 'all' ? 'bg-orange-600 text-white' : 'bg-white text-gray-400 border border-gray-100'} transition">All Members</button>
                <button onclick="renderCustomersView('top')" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase ${filter === 'top' ? 'bg-orange-600 text-white' : 'bg-white text-gray-400 border border-gray-100'} transition">👑 Top Spenders</button>
                <button onclick="renderCustomersView('repeat')" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase ${filter === 'repeat' ? 'bg-orange-600 text-white' : 'bg-white text-gray-400 border border-gray-100'} transition">🔄 Repeat Buyers</button>
                <button onclick="renderCustomersView('onetime')" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase ${filter === 'onetime' ? 'bg-orange-600 text-white' : 'bg-white text-gray-400 border border-gray-100'} transition">📍 One-Time</button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${customers.map(c => {
                    const initial = (c.name || 'U').charAt(0).toUpperCase();
                    return `
                    <div class="group bg-white rounded-[2.5rem] p-6 border border-orange-50 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                        <div class="flex items-start justify-between mb-4 relative z-10">
                            <div class="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                                ${initial}
                            </div>
                            <span class="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full border border-orange-100">
                                ${c.orderCount} Orders
                            </span>
                        </div>

                        <div class="relative z-10">
                            <h3 class="font-black text-gray-800 text-lg leading-tight truncate">${c.name || 'Anonymous'}</h3>
                            <p class="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">${c.email}</p>
                            <p class="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">${c.phone}</p>

                        </div>

                        <div class="mt-6 flex justify-between items-center border-t border-gray-50 pt-4">
                            <div class="text-[9px] font-bold text-gray-400 uppercase">Life-time Spend</div>
                            <div class="text-sm font-black text-gray-800">₹${c.totalSpent}</div>
                        </div>

                        <div class="mt-6 flex gap-2">
                            <a href="tel:${c.phone}" class="flex-1 bg-gray-900 text-white text-center py-3 rounded-xl text-[9px] font-black uppercase">Call</a>
                            <a href="mailto:${c.email}" class="flex-1 bg-orange-50 text-orange-600 text-center py-3 rounded-xl text-[9px] font-black uppercase">Email</a>
                        </div>
                    </div>
                    `;
                }).join("")}
            </div>
        `;

    } catch (err) {
        console.error("Error loading customers:", err);
    }
}

// ==============================
// ORDERS LOGIC
// ==============================
// At the very top of your file
// admin-script.js (Consolidated Order Section)

async function fetchOrders(filter = 'all') {
    try {
        const tableHead = document.getElementById("table-head-row");
        if (tableHead) {
            // Hide table headers for card layout
            tableHead.innerHTML = "";
        }

        const res = await fetch(`${API_URL}/orders/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch orders");
        
        allOrdersData = await res.json(); 
        
        updateStats(allOrdersData);
        renderOrderTable(allOrdersData, filter);

    } catch (err) {
        console.error("Error: Failed to fetch orders", err);
    }
}

function handleSearch() {
    const searchTerm = document.getElementById("orderSearchInput").value.toLowerCase();
    const activeTab = document.querySelector('.sidebar-active')?.id;

    if (activeTab === 'tab-orders') {
        const filtered = allOrdersData.filter(o => 
            o.orderId.toLowerCase().includes(searchTerm) || 
            o.customerName.toLowerCase().includes(searchTerm)
        );
        renderOrderTable(filtered);
    } 
    // ADDED: Customer Search Logic
    else if (activeTab === 'tab-customers') {
        const allCards = document.querySelectorAll('#admin-table-body > div');
        allCards.forEach(card => {
            const name = card.querySelector('h3').innerText.toLowerCase();
            const email = card.querySelector('p').innerText.toLowerCase();
            if (name.includes(searchTerm) || email.includes(searchTerm)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }
}

function renderOrderTable(orders, filter = 'all') {
    if (filter !== 'all') {
        orders = orders.filter(o => o.status === filter);
    }

    const viewTitle = document.getElementById("view-title");
    if (viewTitle) {
        viewTitle.innerText = filter === 'all' ? "Order Management" : `${filter} Orders`;
    }

    const container = document.getElementById("admin-table-body");
    if (!container) return;

    // Grid layout for order cards
    container.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4";
    
    container.innerHTML = orders.map(o => {
        // Status Styling
        let statusClass = "text-yellow-600 bg-yellow-50"; 
        if (o.status === "Verified") statusClass = "text-blue-600 bg-blue-50";
        if (o.status === "Packed") statusClass = "text-purple-600 bg-purple-50";
        if (o.status === "Out for Delivery") statusClass = "text-orange-600 bg-orange-50";
        if (o.status === "Delivered") statusClass = "text-green-600 bg-green-50";
        if (o.status === "Cancelled") statusClass = "text-red-600 bg-red-50";

        // Logic for Large Call Button in circled area
        const showLargeCallBtn = (o.status === "Processing" || o.status === "Out for Delivery");

        return `
        <div class="group bg-white rounded-[2rem] p-6 border border-orange-50 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div class="relative z-10 flex justify-between items-start mb-4">
                <div class="flex-grow">
                    <span class="text-[9px] font-black bg-gray-900 text-white px-2 py-1 rounded-md uppercase tracking-widest">#${o.orderId.split('-')[1]}</span>
                    <h3 class="font-black text-gray-800 text-base mt-2 truncate">${o.customerName}</h3>
                    
                    <div class="flex flex-col mt-1 space-y-0.5">
                        <span class="text-[9px] font-bold text-gray-500 flex items-center gap-1">
                            📞 ${o.phone || 'No Phone'}
                        </span>
                        <span class="text-[9px] font-bold text-gray-400 italic truncate max-w-[150px]">
                            ✉️ ${o.email}
                        </span>
                    </div>
                </div>

                <div class="flex flex-col items-end gap-2">
                    <span class="px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${statusClass}">
                        ${o.status}
                    </span>
                    
                    ${showLargeCallBtn && o.phone ? `
                        <a href="tel:${o.phone}" 
                           class="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-green-100 hover:bg-green-600 hover:scale-110 transition-all animate-pulse"
                           title="Call Customer">
                           📞
                        </a>
                    ` : '<div class="w-12 h-12"></div>'} 
                </div>
            </div>

            <div class="relative z-10 space-y-3 mb-6">
                <div class="text-[10px] text-gray-500 font-medium">
                    <p class="uppercase font-bold text-gray-400 mb-1">Items:</p>
                    ${o.items.map(i => `<span class="block">• ${i.name} - ${i.weight || ''} (x${i.quantity})</span>`).join("")}
                </div>
                <div class="flex justify-between items-end border-t border-gray-50 pt-3">
                    <div>
                        <p class="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Pickup Point</p>
                        <p class="text-[10px] text-orange-600 font-bold italic">📍 ${o.pickupLocation?.locationName || 'Unspecified Point'}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Amount</p>
                        <p class="text-lg font-black text-gray-800">₹${o.totalAmount}</p>
                    </div>
                </div>
            </div>

            <div class="relative z-10 flex gap-2">
                ${o.status === "Processing" ? `
                    <button onclick="updateStatus('${o._id}', 'Verified')" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition">Verify</button>
                    <button onclick="updateStatus('${o._id}', 'Cancelled')" class="px-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition">❌</button>
                ` : ""}
                ${o.status === "Verified" ? `<button onclick="updateStatus('${o._id}', 'Packed')" class="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition">Mark Packed</button>` : ""}
                ${o.status === "Packed" ? `<button onclick="updateStatus('${o._id}', 'Out for Delivery')" class="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition">Send Out</button>` : ""}
                ${o.status === "Out for Delivery" ? `<button onclick="updateStatus('${o._id}', 'Delivered')" class="flex-1 bg-green-500 hover:bg-green-700 text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition">Confirm Delivery</button>` : ""}
                
                ${o.status === "Delivered" ? `
                    <button onclick="downloadAdminInvoice('${o._id}')" class="flex-1 bg-gray-900 hover:bg-black text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                        📄 Invoice
                    </button>
                ` : ""}
            </div>

            <div class="absolute -bottom-6 -right-6 w-20 h-20 bg-orange-50 rounded-full opacity-30 group-hover:scale-110 transition-transform"></div>
        </div>`;
    }).join("");
}

// Helper function to open the invoice in a new tab
function downloadAdminInvoice(orderId) {
    // We send the token in the query string so the server can verify the admin
    const invoiceUrl = `${API_URL}/orders/invoice/${orderId}?token=${token}`;
    window.open(invoiceUrl, '_blank');
}

async function updateStatus(id, newStatus) {
    try {
        const res = await fetch(`${API_URL}/orders/status/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            fetchOrders(); 
        } else {
            const data = await res.json();
            alert("Update failed: " + data.error);
        }
    } catch (err) {
        console.error("Status update error", err);
    }
}

function updateStats(orders) {
    const todayStr = new Date().toLocaleDateString();
    const verifiedStatuses = ["Verified", "Packed", "Out for Delivery", "Delivered"];
    const dotContainer = document.getElementById("pending-status-dots");
    
    if (dotContainer) dotContainer.innerHTML = "";

    const stats = orders.reduce((acc, o) => {
        const orderDate = new Date(o.createdAt).toLocaleDateString();
        const isRevenueValid = verifiedStatuses.includes(o.status);

        // Define pending workflow stages
        const pendingStages = ["Processing", "Verified", "Packed", "Out for Delivery"];
        
        if (pendingStages.includes(o.status)) {
            acc.pending++;
            
            // Create the dot element
            const dot = document.createElement("span");
            // Added 'cursor-pointer' and 'hover:scale-125' for better UX
            dot.className = "w-2.5 h-2.5 rounded-full shadow-sm cursor-pointer hover:scale-125 transition-transform";
            dot.title = `Click to view all ${o.status} orders`;

            // Map status to specific color
            if (o.status === "Processing") dot.classList.add("bg-yellow-400", "animate-pulse");
            if (o.status === "Verified") dot.classList.add("bg-blue-500");
            if (o.status === "Packed") dot.classList.add("bg-purple-500");
            if (o.status === "Out for Delivery") dot.classList.add("bg-orange-500");

            // NEW: Click event to open that specific section
            dot.onclick = (e) => {
                e.stopPropagation();
                fetchOrders(o.status); 
            };

            if (dotContainer) dotContainer.appendChild(dot);
        }

        if (orderDate === todayStr && isRevenueValid) acc.revenue += o.totalAmount;
        if (o.status === "Delivered") acc.completed++;
        if (isRevenueValid) acc.total++;

        return acc;
    }, { revenue: 0, pending: 0, completed: 0, total: 0 });

    // Update Dashboard Cards
    document.getElementById("stat-revenue").innerText = `₹${stats.revenue}`;
    document.getElementById("stat-pending").innerText = stats.pending;
    document.getElementById("stat-completed").innerText = stats.completed;
    document.getElementById("stat-total").innerText = stats.total;
}

// Global variable to store current pending action
let pendingAction = null;

/**
 * Triggered by the Verify/Cancel/Deliver buttons in the table
 */
function updateStatus(id, newStatus) {
    const modal = document.getElementById("actionConfirmModal");
    const title = document.getElementById("actionTitle");
    const msg = document.getElementById("actionMessage");
    const icon = document.getElementById("actionIcon");
    const btn = document.getElementById("confirmBtn");

    // Configure Modal based on the Status
    if (newStatus === "Verified") {
        icon.innerText = "🔍";
        icon.className = "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl bg-blue-100 text-blue-600";
        title.innerHTML = `Verify <span class="text-blue-600">Order</span>`;
        msg.innerText = "Are you sure you want to verify this order? This will move it to the processing stage.";
        btn.className = "flex-1 bg-blue-600 text-white font-black py-3 rounded-2xl shadow-lg hover:bg-blue-700 transition uppercase tracking-widest text-[10px]";
    } 
    
    // NEW: Mark Packed Popup
    else if (newStatus === "Packed") {
        icon.innerText = "📦";
        icon.className = "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl bg-purple-100 text-purple-600";
        title.innerHTML = `Order <span class="text-purple-600">Packed</span>`;
        msg.innerText = "Customer item has been packed and ready to deliver?";
        btn.className = "flex-1 bg-purple-600 text-white font-black py-3 rounded-2xl shadow-lg hover:bg-purple-700 transition uppercase tracking-widest text-[10px]";
    }

    // NEW: Out for Delivery Popup
    else if (newStatus === "Out for Delivery") {
        icon.innerText = "🛵";
        icon.className = "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl bg-orange-100 text-orange-600";
        title.innerHTML = `<span class="text-orange-600">Out for Delivery</span>`;
        msg.innerText = "Item went for delivery?";
        btn.className = "flex-1 bg-orange-600 text-white font-black py-3 rounded-2xl shadow-lg hover:bg-orange-700 transition uppercase tracking-widest text-[10px]";
    }

    else if (newStatus === "Delivered") {
        icon.innerText = "✅";
        icon.className = "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl bg-green-100 text-green-600";
        title.innerHTML = `Confirm <span class="text-green-600">Delivered</span>`;
        msg.innerText = "Has the customer received the item successfully?";
        btn.className = "flex-1 bg-green-600 text-white font-black py-3 rounded-2xl shadow-lg hover:bg-green-700 transition uppercase tracking-widest text-[10px]";
    } 
    
    else if (newStatus === "Cancelled") {
        icon.innerText = "🚫";
        icon.className = "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl bg-red-100 text-red-600";
        title.innerHTML = `Cancel <span class="text-red-600">Order</span>`;
        msg.innerText = "Are you sure you want to cancel this order?";
        btn.className = "flex-1 bg-red-600 text-white font-black py-3 rounded-2xl shadow-lg hover:bg-red-700 transition uppercase tracking-widest text-[10px]";
    }

    // Save the action details
    pendingAction = { id, newStatus };
    
    // Set the click handler for the "Proceed" button
    btn.onclick = executeStatusUpdate;

    modal.classList.remove("hidden");
}

// Add this to the HELPERS & INIT section of admin-script.js
function closeActionModal() {
    const modal = document.getElementById("actionConfirmModal");
    if (modal) {
        modal.classList.add("hidden");
    }
    pendingAction = null; // Clear the stored action state
}

/**
 * The actual fetch call that hits your backend
 */
async function executeStatusUpdate() {
    if (!pendingAction) return;
    const { id, newStatus } = pendingAction;

    try {
        const res = await fetch(`${API_URL}/orders/status/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            closeActionModal(); // This will now work correctly
            fetchOrders(); 
            if (newStatus === "Verified") checkLowStock();
        } else {
            const data = await res.json();
            alert("Update failed: " + data.error);
        }
    } catch (err) { 
        console.error("Status update error", err); 
        closeActionModal(); // Close even on error to prevent being stuck
    }
}


// ==============================
// PRODUCTS LOGIC
// ==============================
async function renderProductsView() {
    try {
        // Corrected URL: Removed trailing slash to match backend
        const res = await fetch(`${API_URL}/products`, {
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401 || res.status === 403) throw new Error("Unauthorized");
        const products = await res.json();

        document.getElementById("view-title").innerText = "Menu Management";
        document.getElementById("view-desc").innerText = "Manage products, pricing, and stock.";
        
        const tableHeading = document.getElementById("table-heading");
        if (tableHeading) tableHeading.innerText = "Active Menu Items";

        document.getElementById("table-head-row").innerHTML = ""; 
        const container = document.getElementById("admin-table-body");
        
        // Compact Grid Layout for products
        container.className = ""; 
        container.innerHTML = `<div id="adminProductGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-full"></div>`;
        const grid = document.getElementById("adminProductGrid");

        grid.innerHTML = products.map(p => `
            <div class="admin-card p-2 rounded-xl border border-orange-100 bg-white relative">
                <div class="relative aspect-square rounded-lg overflow-hidden">
                    <img src="${p.image}" class="w-full h-full object-cover">
                    <div class="absolute top-2 right-2 flex flex-col gap-1">
                        <button onclick="openEditProduct('${p._id}')" class="bg-white p-1 rounded-full text-[10px] shadow">✏️</button>
                        <button onclick="deleteProduct('${p._id}')" class="bg-white p-1 rounded-full text-[10px] shadow">🗑️</button>
                    </div>
                </div>
                <div class="text-[9px] font-bold mt-1 ${p.stock < 15 ? 'text-red-600' : 'text-gray-400'}">
                    Stock: ${p.stock}
                </div>
                <div class="mt-2 px-1 text-left">
                    <div class="flex justify-between">
                        <h3 class="text-[10px] font-black truncate">${p.name}</h3>
                        <span class="text-[10px] font-bold text-orange-600">₹${p.price}</span>
                    </div>
                    <div class="text-[8px] text-gray-400 mt-1 uppercase">
                        ${"🌶️".repeat(p.spiceLevel || 1)} • ${p.weight}
                    </div>
                </div>
            </div>
        `).join("");
    } catch (err) {
        alert("Session expired. Please log in again.");
        window.location.href = "admin-login.html";
    }
}

async function handleProductSubmit(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // 1. Show Loading State on Button
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="flex items-center justify-center gap-2"><div class="loading-spinner"></div> Saving...</div>`;

    const productData = {
        name: document.getElementById("pName").value,
        price: Number(document.getElementById("pPrice").value),
        weight: document.getElementById("pWeight").value,
        spiceLevel: Number(document.getElementById("pSpice").value),
        description: document.getElementById("pDesc").value,
        image: document.getElementById("pImage").value,
        stock: Number(document.getElementById("pStock").value)
    };

    const url = editingProductId ? `${API_URL}/products/${editingProductId}` : `${API_URL}/products/add`;
    const method = editingProductId ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(productData)
        });

        if (res.ok) {
            editingProductId = null;
            document.getElementById("productForm").reset();
            toggleProductModal();
            renderProductsView();

            // 2. Show Success Modal
            showStatusModal("🍗", "Success!", "Product has been saved to the menu.", "bg-green-100 text-green-600", "bg-green-600");
        } else {
            const err = await res.json();
            showStatusModal("❌", "Error", err.error, "bg-red-100 text-red-600", "bg-red-600");
        }
    } catch (err) { 
        console.error(err);
        showStatusModal("⚠️", "Server Error", "Could not reach the database.", "bg-red-100 text-red-600", "bg-red-600");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

async function deleteProduct(id) {
    // Reuse your existing actionConfirmModal for the confirmation step
    const modal = document.getElementById("actionConfirmModal");
    const title = document.getElementById("actionTitle");
    const msg = document.getElementById("actionMessage");
    const icon = document.getElementById("actionIcon");
    const btn = document.getElementById("confirmBtn");

    icon.innerText = "🗑️";
    icon.className = "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl bg-red-100 text-red-600";
    title.innerHTML = `Delete <span class="text-red-600">Product</span>`;
    msg.innerText = "Are you sure you want to permanently remove this item from the menu?";
    btn.innerText = "Delete Permanently";
    btn.className = "flex-1 bg-red-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-red-700 transition uppercase tracking-widest text-[10px]";

    modal.classList.remove("hidden");

    btn.onclick = async () => {
        btn.disabled = true;
        btn.innerHTML = "Deleting...";
        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                closeActionModal();
                renderProductsView();
                showStatusModal("✅", "Deleted", "Product removed successfully.", "bg-gray-100 text-gray-800", "bg-black");
            }
        } catch (err) { console.error(err); }
    };
}

// Helper to show a quick status message using your existing modal structure
function showStatusModal(iconChar, titleText, messageText, iconClass, btnClass) {
    const modal = document.getElementById("actionConfirmModal");
    const icon = document.getElementById("actionIcon");
    const title = document.getElementById("actionTitle");
    const msg = document.getElementById("actionMessage");
    const btn = document.getElementById("confirmBtn");

    icon.innerText = iconChar;
    icon.className = `w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl ${iconClass}`;
    title.innerText = titleText;
    msg.innerText = messageText;
    btn.innerText = "Close";
    btn.className = `w-full ${btnClass} text-white font-black py-4 rounded-2xl`;
    
    btn.onclick = closeActionModal;
    modal.classList.remove("hidden");
}

// ==============================
// HELPERS & INIT
// ==============================
function toggleProductModal() {
    const modal = document.getElementById("productModal");
    modal.classList.toggle("hidden");
    if (!modal.classList.contains("hidden") && !editingProductId) {
        document.getElementById("productForm").reset();
        document.querySelector("#productModal h2").innerHTML = `New <span class="text-orange-600">Product</span>`;
    }
}


// ********************
// Stock Management 
// ********************

async function checkLowStock() {
    try {
        const res = await fetch(`${API_URL}/products`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const products = await res.json();
        
        // Filter items with stock less than 10 but greater than 0
        const lowStockItems = products.filter(p => p.stock < 10 && p.stock > 0);
        
        if (lowStockItems.length > 0) {
            const itemNames = lowStockItems.map(p => `${p.name} (${p.stock} left)`).join(", ");
            showLowStockAlert(itemNames);
        }
    } catch (err) { console.error("Stock check failed", err); }
}

function showLowStockAlert(items) {
    const modal = document.getElementById("actionConfirmModal");
    const title = document.getElementById("actionTitle");
    const msg = document.getElementById("actionMessage");
    const icon = document.getElementById("actionIcon");
    const btn = document.getElementById("confirmBtn");

    icon.innerText = "⚠️";
    icon.className = "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl bg-red-100 text-red-600";
    title.innerHTML = `<span class="text-red-600">Stock Low!</span>`;
    msg.innerText = `The following items are running low: ${items}. Refill them now to avoid service interruption.`;
    
    btn.innerText = "Got it";
    btn.className = "w-full bg-gray-900 text-white font-black py-3 rounded-2xl";
    btn.onclick = closeActionModal;

    modal.classList.remove("hidden");
}

// Call this on window load after switchTab('orders')
window.onload = () => {
    switchTab("orders");
    checkLowStock(); 
};



// ==============================
// SALES ANALYTICS LOGIC
// ==============================
function renderSalesView() {
    const container = document.getElementById("admin-table-body");
    const now = new Date();
    const todayStr = now.toLocaleDateString();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Updated accumulation object with locationMap
    let stats = {
        todayRev: 0, 
        monthRev: 0, 
        totalRev: 0,
        completedOrders: 0,
        totalItemsCount: 0,
        totalWeightGrams: 0,
        productMap: {},
        locationMap: {} // NEW: Track orders per pickup point
    };

    allOrdersData.forEach(order => {
        const date = new Date(order.createdAt);
        const isToday = date.toLocaleDateString() === todayStr;
        const isThisMonth = date.getMonth() === currentMonth && date.getFullYear() === currentYear;

        if (order.status === "Delivered") {
            stats.completedOrders++; 
            stats.totalRev += order.totalAmount;
            
            if (isToday) stats.todayRev += order.totalAmount;
            if (isThisMonth) stats.monthRev += order.totalAmount;

            // 🚀 PICKUP POINT LOGIC: Group by locationName
            const locName = order.pickupLocation?.locationName || "Standard Delivery";
            if (!stats.locationMap[locName]) {
                stats.locationMap[locName] = { count: 0, revenue: 0 };
            }
            stats.locationMap[locName].count++;
            stats.locationMap[locName].revenue += order.totalAmount;

            order.items.forEach(item => {
                const id = item.productId || item.name;
                const rawWeight = item.weight || "0g"; 
                const weightValue = parseInt(rawWeight) || 0; 
                
                stats.totalWeightGrams += (weightValue * item.quantity);
                stats.totalItemsCount += item.quantity;

                if (!stats.productMap[id]) {
                    stats.productMap[id] = { 
                        name: item.name, 
                        img: item.image,
                        rev: 0,
                        totalQty: 0,
                        itemWeight: rawWeight 
                    };
                }
                
                stats.productMap[id].totalQty += item.quantity;
                stats.productMap[id].rev += (item.price * item.quantity);
            });
        }
    });

    const totalWeightKg = (stats.totalWeightGrams / 1000).toFixed(2);
    const sortedProducts = Object.values(stats.productMap).sort((a, b) => b.totalQty - a.totalQty);
    const sortedLocations = Object.entries(stats.locationMap).sort((a, b) => b[1].count - a[1].count); // Sort by order volume
    const mostSold = sortedProducts[0] || { name: "N/A", totalQty: 0 };

    container.className = "p-4 space-y-8";
    container.innerHTML = `
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div class="admin-card p-4 rounded-3xl bg-white border-b-4 border-red-500">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Revenue</p>
                <h3 class="text-xl font-black text-gray-800">₹${stats.totalRev}</h3>
            </div>
            <div class="admin-card p-4 rounded-3xl bg-white border-b-4 border-yellow-500">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Today's Revenue</p>
                <h3 class="text-xl font-black text-orange-600">₹${stats.todayRev}</h3>
            </div>
            <div class="admin-card p-4 rounded-3xl bg-white border-b-4 border-orange-500">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Orders Completed</p>
                <h3 class="text-xl font-black text-gray-800">${stats.completedOrders}</h3>
            </div>
            <div class="admin-card p-4 rounded-3xl bg-white border-b-4 border-blue-500">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Items Sold</p>
                <h3 class="text-xl font-black text-gray-800">${stats.totalItemsCount}</h3>
            </div>
            <div class="admin-card p-4 rounded-3xl bg-white border-b-4 border-green-500">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Weight Sold</p>
                <h3 class="text-xl font-black text-gray-800">${totalWeightKg}kg</h3>
            </div>
            <div class="admin-card p-4 rounded-3xl bg-gray-900 text-white border-b-4 border-orange-500">
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Most Sold</p>
                <h3 class="text-sm font-black truncate">${mostSold.name}</h3>
                <p class="text-[9px] text-orange-500 font-bold">${mostSold.totalQty} Units</p>
            </div>
        </div>

        

            <div class="bg-white rounded-[2.5rem] p-8 border border-orange-50 shadow-sm">
            <h3 class="font-black text-gray-800 mb-6 flex items-center gap-2">
                <span class="p-2 bg-orange-100 rounded-lg text-sm">📊</span> Inventory & Sales Analytics
            </h3>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-50">
                        <tr>
                            <th class="pb-4">Product Name</th>
                            <th class="pb-4 text-center">Unit Weight</th>
                            <th class="pb-4 text-center">Total Quantity</th>
                            <th class="pb-4 text-center">Total Mass (kg)</th>
                            <th class="pb-4 text-right">Revenue Generated</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        ${sortedProducts.map(p => {
                        const unitMass = parseInt(p.itemWeight) || 0; 
                        const totalMass = ((unitMass * p.totalQty) / 1000).toFixed(2);
                        return `
                        <tr>
                            <td class="py-4 flex items-center gap-3">
                                <img src="${p.img}" class="w-8 h-8 rounded-lg object-cover">
                                <span class="font-bold text-gray-800 text-sm">${p.name}</span>
                            </td>
                            <td class="py-4 text-center text-xs font-bold text-gray-400">${p.itemWeight === "0g" ? 'N/A' : p.itemWeight}</td>
                            <td class="py-4 text-center text-xs font-black text-gray-900">${p.totalQty}</td>
                            <td class="py-4 text-center text-xs font-bold text-blue-600">${totalMass} kg</td>
                            <td class="py-4 text-right font-black text-orange-600">₹${p.rev}</td>
                        </tr>
                    `}).join('')}
                    </tbody>
                </table>
            </div>
        </div>

            <div class="bg-white rounded-[2.5rem] p-8 border border-orange-50 shadow-sm">
                <h3 class="font-black text-gray-800 mb-6 flex items-center gap-2">
                    <span class="p-2 bg-blue-100 rounded-lg text-sm">📍</span> Pickup Point Performance
                </h3>
                <div class="space-y-4">
                    ${sortedLocations.map(([name, data]) => `
                        <div class="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <p class="font-black text-gray-800 text-xs uppercase">${name}</p>
                                <p class="text-[10px] text-gray-400 font-bold">${data.count} Successful Orders</p>
                            </div>
                            <div class="text-right">
                                <p class="font-black text-blue-600">₹${data.revenue}</p>
                                <p class="text-[9px] text-gray-400 font-bold italic">Total Revenue</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}


// ==============================
// PICKUP LOCATIONS LOGIC
// ==============================
async function renderLocationsView() {
    try {
        const res = await fetch(`${API_URL}/locations/pickup-points`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const locations = await res.json();

        document.getElementById("view-title").innerText = "Pickup Points";
        document.getElementById("view-desc").innerText = "Manage customer collection centers.";
        
        const container = document.getElementById("admin-table-body");
        container.className = "space-y-6 p-4 w-full";

        container.innerHTML = `
            <div class="flex justify-end mb-4">
                <button onclick="toggleLocationModal()" class="bg-orange-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black transition">
                    + Add New Point
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${locations.map(loc => `
                    <div class="admin-card p-6 rounded-[2.5rem] bg-white border border-orange-50 shadow-sm relative group">
                        <div class="flex justify-between items-start mb-4">
                            <div class="p-3 bg-orange-100 rounded-2xl text-xl">📍</div>
                            <button onclick="deleteLocation('${loc._id}')" class="text-gray-300 hover:text-red-500 transition">
                                🗑️
                            </button>
                        </div>
                        <h3 class="font-black text-gray-800 text-lg uppercase">${loc.name}</h3>
                        <p class="text-xs text-gray-500 font-medium mt-2 leading-relaxed">${loc.address}</p>
                        <a href="${loc.googleMapsLink}" target="_blank" class="inline-block mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            Open in Maps ↗
                        </a>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) {
        console.error("Failed to load locations", err);
    }
}


// Function to delete a location with custom modal confirmation
async function deleteLocation(id) {
    const modal = document.getElementById("actionConfirmModal");
    const btn = document.getElementById("confirmBtn");

    // 1. Show Confirmation Modal
    showStatusModal(
        "📍", 
        "Remove Pickup Point?", 
        "This location will no longer be available for customer selection.", 
        "bg-red-50 text-red-600", 
        "bg-red-600"
    );
    btn.innerText = "Delete Permanently";

    // 2. Set the click action for the specific ID
    btn.onclick = async () => {
        btn.disabled = true;
        btn.innerHTML = `<div class="flex items-center justify-center gap-2"><div class="loading-spinner"></div> Deleting...</div>`;
        
        try {
            const res = await fetch(`${API_URL}/locations/pickup-points/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.ok) {
                closeActionModal();
                renderLocationsView();
                // 3. Show Success Notification
                showStatusModal("✅", "Deleted!", "The pickup point was removed successfully.", "bg-gray-100 text-gray-800", "bg-black");
            } else {
                showStatusModal("❌", "Error", "Could not delete location.", "bg-red-100 text-red-600", "bg-red-600");
            }
        } catch (err) { 
            console.error(err);
            showStatusModal("⚠️", "Server Error", "Check your connection.", "bg-red-100 text-red-600", "bg-red-600");
        }
    };
}

// Function to add a new location with loading and success states
async function handleLocationSubmit(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // 1. Start Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="flex items-center justify-center gap-2"><div class="loading-spinner"></div> Saving Point...</div>`;

    const data = {
        name: document.getElementById("locName").value,
        address: document.getElementById("locAddress").value,
        googleMapsLink: document.getElementById("locMaps").value
    };

    try {
        const res = await fetch(`${API_URL}/locations/pickup-points`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            toggleLocationModal(); // Close the input form
            renderLocationsView(); // Refresh list
            // 2. Show Success Modal
            showStatusModal("📍", "Location Added!", "New pickup point is now active.", "bg-green-100 text-green-600", "bg-green-600");
        } else {
            const err = await res.json();
            showStatusModal("❌", "Save Failed", err.error, "bg-red-100 text-red-600", "bg-red-600");
        }
    } catch (err) { 
        console.error(err);
        showStatusModal("⚠️", "Error", "Database connection lost.", "bg-red-100 text-red-600", "bg-red-600");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

function toggleLocationModal() {
    const modal = document.getElementById("locationModal");
    if (modal) {
        modal.classList.toggle("hidden");
        if (!modal.classList.contains("hidden")) {
            // Clear inputs when opening for a new entry
            document.getElementById("locName").value = "";
            document.getElementById("locAddress").value = "";
            document.getElementById("locMaps").value = "";
        }
    }
}



// ==============================
// STAFF MANAGEMENT LOGIC
// ==============================
async function renderUsersView() {
    try {
        const res = await fetch(`${API_URL}/auth/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const staffList = await res.json();

        // Check if current logged-in user is the owner
        const isOwner = user.role === 'owner';

        document.getElementById("view-title").innerText = "Staff Management";
        document.getElementById("view-desc").innerText = isOwner ? "Manage your team access." : "View authorized personnel.";
        
        const container = document.getElementById("admin-table-body");
        container.className = "space-y-6 p-4 w-full";

        container.innerHTML = `
            <div class="flex justify-end mb-4 ${isOwner ? '' : 'hidden'}">
                <button onclick="openAddStaffModal()" class="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-orange-600 transition">
                    + Register New Staff
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${staffList.map(staff => `
                    <div class="admin-card p-6 rounded-[2.5rem] bg-white border border-orange-50 shadow-sm">
                        <div class="flex justify-between items-start mb-4">
                            <div class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">👤</div>
                            
                            <div class="flex gap-2 ${isOwner && staff.role !== 'owner' ? '' : 'hidden'}">
                                <button onclick="openEditStaff('${staff._id}', '${staff.name}', '${staff.email}', '${staff.role}')" class="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition text-xs">✏️</button>
                                <button onclick="deleteStaff('${staff._id}')" class="p-2 hover:bg-red-50 text-red-500 rounded-lg transition text-xs">🗑️</button>
                            </div>
                        </div>
                        <h3 class="font-black text-gray-800 text-sm uppercase">${staff.name}</h3>
                        <p class="text-[10px] text-orange-600 font-bold uppercase tracking-widest mb-2">${staff.role}</p>
                        <p class="text-xs text-gray-400 truncate italic">${staff.email}</p>
                        
                        ${staff.role === 'owner' ? `
                            <div class="mt-4 pt-3 border-t border-gray-50">
                                <span class="text-[8px] bg-black text-white px-2 py-0.5 rounded-full uppercase font-black tracking-widest">Protected Account</span>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) { console.error("Failed to load staff", err); }
}

function toggleStaffModal() {
        document.getElementById("staffModal").classList.toggle("hidden");
    }

// ==============================
// STAFF FORM SUBMISSION
// ==============================
async function handleStaffSubmit(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // 1. Start Loading State on the Button
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="flex items-center justify-center gap-2"><div class="loading-spinner"></div> Saving Account...</div>`;

    const data = {
        name: document.getElementById("staffName").value,
        email: document.getElementById("staffEmail").value,
        role: document.getElementById("staffRole").value
    };

    // Only include password if we are creating a new staff member
    if (!editingStaffId) {
        data.password = document.getElementById("staffPass").value;
    }

    const url = editingStaffId ? `${API_URL}/auth/update-staff/${editingStaffId}` : `${API_URL}/auth/register-staff`;
    const method = editingStaffId ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: { 
                "Content-Type": "application/json", 
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            toggleStaffModal();
            renderUsersView();
            
            // 2. Show Success Modal instead of alert
            const successMsg = editingStaffId ? "Staff details updated successfully." : "New staff member registered.";
            showStatusModal("👤", "Success!", successMsg, "bg-green-100 text-green-600", "bg-green-600");
            
            editingStaffId = null; // Clear editing state
        } else {
            const err = await res.json();
            // 3. Show Error Modal
            showStatusModal("❌", "Failed", err.error || "Could not save staff.", "bg-red-100 text-red-600", "bg-red-600");
        }
    } catch (err) { 
        console.error(err);
        showStatusModal("⚠️", "Server Error", "Check your connection and try again.", "bg-red-100 text-red-600", "bg-red-600");
    } finally {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// ==============================
// MODAL OPENING LOGIC
// ==============================
function openAddStaffModal() {
    editingStaffId = null;
    // Show password field for new registrations
    document.getElementById("staffPassContainer").classList.remove("hidden");
    document.getElementById("staffPass").required = true;
    
    // Reset form fields
    document.getElementById("staffName").value = "";
    document.getElementById("staffEmail").value = "";
    document.getElementById("staffRole").value = "admin";
    
    document.querySelector("#staffModal h2").innerHTML = `Register <span class="text-orange-600">Staff</span>`;
    toggleStaffModal();
}

function openEditStaff(id, name, email, role) {
    editingStaffId = id;
    
    // Pre-fill fields
    document.getElementById("staffName").value = name;
    document.getElementById("staffEmail").value = email;
    document.getElementById("staffRole").value = role;
    
    // Hide password field when editing existing accounts
    document.getElementById("staffPassContainer").classList.add("hidden");
    document.getElementById("staffPass").required = false;
    
    document.querySelector("#staffModal h2").innerHTML = `Edit <span class="text-orange-600">Staff</span>`;
    toggleStaffModal();
}

async function handleStaffSubmit(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // 1. Show Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="flex items-center justify-center gap-2"><div class="loading-spinner"></div> Saving Staff...</div>`;

    const data = {
        name: document.getElementById("staffName").value,
        email: document.getElementById("staffEmail").value,
        role: document.getElementById("staffRole").value
    };

    // Only add password if creating a new account
    if (!editingStaffId) {
        data.password = document.getElementById("staffPass").value;
    }

    const url = editingStaffId ? `${API_URL}/auth/update-staff/${editingStaffId}` : `${API_URL}/auth/register-staff`;
    const method = editingStaffId ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            toggleStaffModal();
            renderUsersView();
            
            // 2. Success Feedback
            const successMsg = editingStaffId ? "Staff details updated." : "New staff member registered.";
            showStatusModal("👤", "Success!", successMsg, "bg-green-100 text-green-600", "bg-green-600");
            editingStaffId = null; // Reset state
        } else {
            const err = await res.json();
            // 3. Error Feedback
            showStatusModal("❌", "Failed", err.error || "Could not save staff.", "bg-red-100 text-red-600", "bg-red-600");
        }
    } catch (err) { 
        console.error(err);
        showStatusModal("⚠️", "Server Error", "Please try again later.", "bg-red-100 text-red-600", "bg-red-600");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

async function deleteStaff(id) {
    const modal = document.getElementById("actionConfirmModal");
    const btn = document.getElementById("confirmBtn");

    // 1. Show Branded Confirmation Modal
    showStatusModal(
        "👥", 
        "Remove Staff Member?", 
        "This will permanently revoke their access to the Admin Panel.", 
        "bg-red-50 text-red-600", 
        "bg-red-600"
    );
    btn.innerText = "Revoke Access";

    // 2. Override the onclick for the Confirm button
    btn.onclick = async () => {
        // Show loading state within the modal button
        btn.disabled = true;
        btn.innerHTML = `<div class="flex items-center justify-center gap-2"><div class="loading-spinner"></div> Processing...</div>`;
        
        try {
            const res = await fetch(`${API_URL}/auth/delete-staff/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.ok) {
                closeActionModal();
                renderUsersView(); // Refresh the staff list
                // 3. Success Feedback
                showStatusModal("✅", "Access Revoked", "The staff account has been deleted.", "bg-gray-100 text-gray-800", "bg-black");
            } else {
                const err = await res.json();
                showStatusModal("❌", "Failed", err.error || "Could not delete staff.", "bg-red-100 text-red-600", "bg-red-600");
            }
        } catch (err) { 
            console.error(err);
            showStatusModal("⚠️", "Server Error", "Check your connection and try again.", "bg-red-100 text-red-600", "bg-red-600");
        }
    };
}


  /**************************/
 //    Product Reviews     /
/************************/
async function renderReviewsView() {
    try {
        const res = await fetch(`${API_URL}/reviews/all-pending`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const reviews = await res.json();

        document.getElementById("view-title").innerText = "Review Moderation";
        document.getElementById("view-desc").innerText = `Checking ${reviews.length} new testimonials.`;
        
        const container = document.getElementById("admin-table-body");
        container.className = "flex flex-col space-y-4 p-4 w-full"; 

        if (reviews.length === 0) {
            container.innerHTML = `<div class="text-center py-20 bg-white rounded-[3rem] border border-dashed border-orange-200">
                <p class="text-gray-400 font-bold">No pending reviews. Your wall of love is up to date!</p>
            </div>`;
            return;
        }

        container.innerHTML = reviews.map(r => {
            // Formatting dates for better readability
            const postedDate = new Date(r.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' });
            
            return `
            <div class="bg-white p-6 rounded-[2.5rem] border border-orange-50 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                <div class="w-32 h-32 rounded-3xl bg-orange-50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-orange-100">
                    ${r.imageUrl ? `<img src="${r.imageUrl}" class="w-full h-full object-cover">` : `<span class="text-3xl">📸</span>`}
                </div>
                
                <div class="flex-1 space-y-3">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="text-[9px] font-black bg-orange-600 text-white px-2 py-1 rounded-md uppercase tracking-widest">${r.rating} ⭐</span>
                        <span class="text-[9px] font-black bg-red-50 text-red-600 px-2 py-1 rounded-md uppercase tracking-widest">${"🌶️".repeat(r.spiceLevel)} Heat</span>
                        <span class="text-[9px] font-black bg-gray-900 text-white px-2 py-1 rounded-md uppercase tracking-widest italic">Posted: ${postedDate}</span>
                    </div>

                    <div>
                        <h4 class="font-black text-gray-800 uppercase text-sm flex items-center gap-2">
                            ${r.customerName} 
                            <span class="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Verified Buyer</span>
                        </h4>
                        <p class="text-[10px] text-gray-400 font-black uppercase mt-1">
                            🛍️ Item: <span class="text-gray-600">${r.itemName || 'Chicken Pickle (Standard)'}</span>
                        </p>
                    </div>

                    <p class="text-xs text-gray-500 italic leading-relaxed border-l-4 border-orange-100 pl-4 py-1">
                        "${r.comment}"
                    </p>
                </div>

                <div class="flex md:flex-col gap-2 w-full md:w-auto">
                    <button onclick="approveReview('${r._id}')" class="flex-1 bg-green-600 text-white text-[10px] font-black px-6 py-4 rounded-2xl hover:bg-black transition-all uppercase shadow-lg shadow-green-100">Approve</button>
                    <button onclick="deleteReview('${r._id}')" class="flex-1 bg-gray-100 text-gray-400 text-[10px] font-black px-6 py-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all uppercase">Reject</button>
                </div>
            </div>
        `;
        }).join('');
    } catch (err) { 
        console.error("Failed to load reviews", err); 
    }
}

// ==============================
// REVIEW APPROVAL (MODAL UPDATED)
// ==============================
async function approveReview(id) {
    try {
        const res = await fetch(`${API_URL}/reviews/approve/${id}`, {
            method: 'PUT',
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            // Refresh the list immediately in the background
            renderReviewsView();

            // Show high-end success feedback
            showStatusModal(
                "⭐", 
                "Review Approved!", 
                "This testimonial is now visible to all customers on the website.", 
                "bg-orange-50 text-orange-600", 
                "bg-orange-600"
            );
        } else {
            const err = await res.json();
            showStatusModal("❌", "Failed", err.error || "Could not approve review.", "bg-red-100 text-red-600", "bg-red-600");
        }
    } catch (err) {
        console.error("Approval Error:", err);
        showStatusModal("⚠️", "Server Error", "Check your connection and try again.", "bg-red-100 text-red-600", "bg-red-600");
    }
}

async function deleteReview(id) {
    const modal = document.getElementById("actionConfirmModal");
    const btn = document.getElementById("confirmBtn");

    // 1. Show Branded Confirmation Modal
    showStatusModal(
        "🗑️", 
        "Delete Review?", 
        "Are you sure you want to permanently remove this testimonial? This action cannot be undone.", 
        "bg-red-50 text-red-600", 
        "bg-red-600"
    );
    btn.innerText = "Delete Permanently";

    // 2. Set the click action for the specific ID
    btn.onclick = async () => {
        btn.disabled = true;
        btn.innerHTML = `<div class="flex items-center justify-center gap-2"><div class="loading-spinner"></div> Deleting...</div>`;
        
        try {
            const res = await fetch(`${API_URL}/reviews/${id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                closeActionModal();
                renderReviewsView();
                // 3. Show Success Notification
                showStatusModal("✅", "Deleted", "The review has been removed.", "bg-gray-100 text-gray-800", "bg-black");
            } else {
                const err = await res.json();
                showStatusModal("❌", "Error", err.error || "Could not delete review.", "bg-red-100 text-red-600", "bg-red-600");
            }
        } catch (err) { 
            console.error(err);
            showStatusModal("⚠️", "Server Error", "Check your connection.", "bg-red-100 text-red-600", "bg-red-600");
        }
    };
}


function logout() {
    localStorage.clear();
    window.location.href = "admin-login.html";
}

document.getElementById("productForm")?.addEventListener("submit", handleProductSubmit);

window.onload = () => {
    fetchOrders();
    switchTab("orders");
};