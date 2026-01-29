const API_BASE = "http://localhost:5000/api/customers";

/* =====================
   FIXED LOGIN LOGIC
===================== */
async function handleLogin(e) {
    e.preventDefault();
    
    // 1. Get elements using correct IDs from your login.html
    const emailEl = document.getElementById("email");
    const passwordEl = document.getElementById("password");
    const errorEl = document.getElementById("error");
    const loginBtn = e.target.querySelector('button[type="submit"]'); // Targets the submit button
    
    // Clear previous generic error text
    if (errorEl) errorEl.textContent = "";

    // 2. Visual Loading State
    const originalBtnText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = `<span class="inline-block animate-spin mr-2">⌛</span> Logging in...`;

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email: emailEl.value, 
                password: passwordEl.value 
            })
        });

        const data = await res.json();

        if (res.ok) {
            // 3. Success: Store session and handle redirect
            localStorage.setItem("customerToken", data.token);
            localStorage.setItem("customerUser", JSON.stringify(data.customer));

            const redirect = localStorage.getItem("redirectAfterLogin") || "index.html";
            localStorage.removeItem("redirectAfterLogin");
            window.location.href = redirect;
        } else {
            // 4. Error: Show high-end modal for specific codes, else text
            if (data.code === "USER_NOT_FOUND" || data.code === "WRONG_PASSWORD") {
                showLoginErrorModal(data);
            } else if (errorEl) {
                errorEl.textContent = data.error || "Login failed";
            }
        }
    } catch (err) {
        if (errorEl) errorEl.textContent = "Server error. Try again.";
    } finally {
        // Restore button state
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalBtnText;
    }
}

function showLoginErrorModal(data) {
    const modal = document.getElementById('loginStatusModal');
    const title = document.getElementById('statusTitle');
    const desc = document.getElementById('statusDescription');
    const icon = document.getElementById('statusIcon');
    const container = document.getElementById('modalActionContainer');

    modal.classList.remove('hidden');

    // Handle User Not Found
    if (data.code === "USER_NOT_FOUND") {
        icon.innerText = "🔍";
        title.innerText = "No Account";
        desc.innerText = data.message;
        container.innerHTML = `
            <button onclick="window.location.href='signup.html'" class="w-full bg-orange-600 text-white font-black py-4 rounded-2xl hover:bg-black transition uppercase tracking-widest text-xs">Create Account</button>
            <button onclick="closeLoginModal()" class="text-gray-400 font-bold text-[10px] uppercase mt-2">Try Another Email</button>
        `;
    } 
    // Handle Wrong Password
    else if (data.code === "WRONG_PASSWORD") {
        icon.innerText = "🔑";
        title.innerText = "Wrong Pass";
        desc.innerText = data.message;
        container.innerHTML = `
            <button onclick="closeLoginModal()" class="w-full bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition uppercase tracking-widest text-xs">Try Again</button>
            <a href="forgot-password.html" class="text-orange-600 font-bold text-[10px] uppercase mt-2 inline-block">Forgot Password?</a>
        `;
    }
}

function closeLoginModal() {
    document.getElementById('loginStatusModal').classList.add('hidden');
}

/* =====================
   SEND EMAIL OTP
===================== */
async function sendOTP() {
  const email = document.getElementById("email").value;
  if (!email) return alert("Enter email first");

  try {
    const res = await fetch(`${API_BASE}/send-email-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (!res.ok) {
        // Optionally use the modal for errors too
        triggerSuccessModal("Error", data.error || "Failed to send OTP");
        return;
    }

    // Show the OTP input field
    document.getElementById("otpInputGroup").classList.remove("hidden");

    // Trigger your custom high-end modal
    triggerSuccessModal("OTP Sent!", "Please check your email to continue.");
  } catch {
    alert("Server error");
  }
}

/* =====================
   PASSWORD TOGGLE LOGIC
===================== */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("toggleIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

/* =====================
   VERIFY EMAIL OTP
===================== */
async function verifyOTP() {
  const email = document.getElementById("email").value;
  const otp = document.getElementById("emailOtp").value.trim();

  if (!otp) return alert("Enter OTP");

  try {
    const res = await fetch(`${API_BASE}/verify-email-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();
    if (!res.ok) {
        triggerSuccessModal("Invalid Code", "The OTP you entered is incorrect.");
        return;
    }

    // Success Modal
    triggerSuccessModal("Verified!", "Your email has been successfully confirmed.");

    // Switch sections after a short delay so user sees the success
    setTimeout(() => {
        document.getElementById("emailSection").classList.add("hidden");
        document.getElementById("passwordSection").classList.remove("hidden");
    }, 1500);
    
  } catch {
    triggerSuccessModal("Error", "Server connection failed.");
  }
}

/* =====================
   SET PASSWORD (FINAL SIGNUP STEP)
===================== */
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorEl = document.getElementById("error");

    try {
      const res = await fetch(`${API_BASE}/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        errorEl.textContent = data.error || "Password setup failed";
        return;
      }

      // Auto-login after password set
      const loginRes = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error("Login failed");

      localStorage.setItem("customerToken", loginData.token);
      localStorage.setItem("customerUser", JSON.stringify(loginData.customer));

      // Show step-2 details popup
      document.getElementById("detailsPopup").classList.remove("hidden");
    } catch (err) {
      errorEl.textContent = err.message;
    }
  });
}

/* =====================
   SAVE DETAILS (STEP 2)
===================== */
async function saveDetailsWithAnimation() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const token = localStorage.getItem("customerToken");

  if (!token) return alert("Not authenticated");

  try {
    const res = await fetch(`${API_BASE}/details`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, phone, address })
    });

    if (!res.ok) throw new Error("Failed to save details");

    const updatedCustomer = await res.json();
    localStorage.setItem("customerUser", JSON.stringify(updatedCustomer));

    window.location.href = "menu.html";
  } catch (err) {
    alert(err.message);
  }
}

function triggerSuccessModal(title, message) {
    const modal = document.getElementById('successModal');
    const titleEl = document.getElementById('modalTitle');
    const msgEl = document.getElementById('modalMessage');

    titleEl.innerText = title;
    msgEl.innerText = message;

    // Show Modal
    modal.classList.add('active');

    // Auto close after 3 seconds
    setTimeout(() => {
        modal.classList.remove('active');
    }, 3000);
}




// HOW TO USE IN YOUR OTP FETCH:
// if (data.success) {
//    triggerSuccessModal("OTP Sent!", "Please check your email to continue.");
// }