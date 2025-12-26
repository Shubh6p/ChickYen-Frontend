const API_BASE = "https://chickyen-backend.onrender.com/api/customers";

// =====================
// LOGIN LOGIC
// =====================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('error');

        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Save token and customer info
                localStorage.setItem("customerToken", data.token);
                localStorage.setItem("customerUser", JSON.stringify(data.customer));
                
                // Redirect back to menu or original destination
                const redirect = localStorage.getItem("redirectAfterLogin") || "index.html";
                localStorage.removeItem("redirectAfterLogin");
                window.location.href = redirect;
            } else {
                errorEl.textContent = data.error || "Login failed";
            }
        } catch (err) {
            errorEl.textContent = "Server error. Please try again.";
        }
    });
}

// =====================
// SIGNUP LOGIC
// =====================
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('error');

        try {
            const res = await fetch(`${API_BASE}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Show the Step 2 details popup
                document.getElementById('detailsPopup').classList.remove('hidden');
                // Temporarily store credentials to auto-login later if needed
                localStorage.setItem("temp_email", email);
                localStorage.setItem("temp_pass", password);
            } else {
                errorEl.textContent = data.error || "Signup failed";
            }
        } catch (err) {
            errorEl.textContent = "Server error. Please try again.";
        }
    });
}

// =====================
// SAVE DETAILS (STEP 2)
// =====================
// Updated Save Details logic to prevent logout and ensure data consistency
async function saveDetails() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    // Retrieve credentials temporarily stored during signup
    const email = localStorage.getItem("temp_email");
    const password = localStorage.getItem("temp_pass");
    const token = localStorage.getItem("customerToken"); // Use existing token if available

    try {
        let activeToken = token;

        // If no token (first time setup), we must login to get one
        if (!activeToken) {
            const loginRes = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error("Login failed");
            activeToken = loginData.token;
        }

        const res = await fetch(`${API_BASE}/details`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${activeToken}`
            },
            body: JSON.stringify({ name, phone, address })
        });

        if (res.ok) {
            const updatedCustomer = await res.json();
            
            // CRITICAL: Ensure we save the token and user with the _id key
            localStorage.setItem("customerToken", activeToken);
            localStorage.setItem("customerUser", JSON.stringify(updatedCustomer));
            
            // Clean up temporary credentials
            localStorage.removeItem("temp_email");
            localStorage.removeItem("temp_pass");
            
            // Refresh the page or redirect without logging out
            window.location.href = "menu.html"; 
        }
    } catch (err) {
        alert("Failed to save details: " + err.message);
    }
}
