# ChickYen Achar - Frontend Application 🍗🌶️

Welcome to the frontend repository for **ChickYen Achar**, a modern, blazing-fast React application built to provide a seamless e-commerce experience for spicy chicken pickle enthusiasts. This single-page application (SPA) houses both the customer-facing storefront and a highly secure Administrative Dashboard.

---

## 🚀 Tech Stack & Tooling

- **Core Framework:** React.js (v18)
- **Build Tool:** Vite (for lightning-fast HMR and optimized production builds)
- **Styling:** Tailwind CSS (Utility-first styling for a highly responsive, custom theme)
- **Routing:** React Router DOM (v6)
- **Icons:** Lucide React & FontAwesome
- **HTTP Client:** Axios (Configured to securely pass JWT tokens)
- **State Management:** React Context API (Modular contexts for Cart, Customer Auth, and Admin Auth)

---

## ✨ Comprehensive Feature List

### 🛍️ The Storefront (Customer Experience)
- **Dynamic Menu & Product Cards:** Fetches real-time inventory from the backend.
- **Slide-out Cart Drawer:** Non-intrusive cart management allowing users to add/remove items without leaving the page.
- **Seamless Checkout:** Multi-step checkout process with delivery/pickup options, automatically passing data to the backend.
- **Passwordless Authentication:** Users log in using OTPs sent to their Email or Phone, eliminating password fatigue.
- **User Profiles:** Customers can view their order history, track active orders, and update their personal details.
- **Review System:** Customers can leave ratings and reviews on products they've purchased.

### 🛡️ The Admin Dashboard (`/admin`)
A protected layout exclusively accessible to users with `admin` or `owner` roles.
- **Real-time Analytics:** View total sales, active orders, and customer counts.
- **Activity Logs:** A beautiful timeline tracking system events (like "New Order Placed" and "New User Registered").
- **Order Management:** View incoming orders, print invoices, and update shipping statuses.
- **Inventory Control:** Add new products, update prices, and manage stock levels.
- **Customer & Staff Management:** View customer details, register new staff members, and revoke access.
- **Newsletter Broadcasts:** Compose and dispatch promotional HTML emails to all subscribed users directly from the UI.

---

## 📁 Project Structure Deep Dive

```text
frontend/
├── public/              # Static assets (Favicons, generic images)
├── src/                 
│   ├── assets/          # React-imported images (Hero banners, Logos)
│   ├── components/      # Reusable UI building blocks
│   │   ├── CartDrawer.jsx   # Global cart sidebar
│   │   ├── Footer.jsx       # Global footer with newsletter signup
│   │   ├── Navbar.jsx       # Responsive navigation header
│   │   └── ProductCard.jsx  # E-commerce item display
│   ├── context/         # Global State Providers
│   │   ├── AdminAuthContext.jsx # Manages Admin JWTs & Login
│   │   ├── AuthContext.jsx      # Manages Customer JWTs & Profiles
│   │   └── CartContext.jsx      # Manages Cart state (persisted to localStorage)
│   ├── pages/           # Customer Route Views
│   │   ├── Home, Menu, Checkout, Login, Profile, NotFound, etc.
│   │   └── admin/       # Admin Route Views (Protected)
│   │       ├── Dashboard, Orders, Products, ActivityLogs, Broadcast, etc.
│   ├── App.jsx          # Main application router and context wrapper
│   ├── config.js        # Centralized API URLs for dynamic environments
│   ├── index.css        # Tailwind directives and custom CSS animations
│   └── main.jsx         # React DOM entry point
├── .env                 # Environment variables (Not tracked in Git)
├── tailwind.config.js   # Tailwind theme customizations
└── vite.config.js       # Vite build configurations
```

---

## ⚙️ Configuration (`config.js` & `.env`)

The application uses a centralized `src/config.js` to manage API URLs, allowing seamless transitions between local development and production environments.

Create a `.env` file in the root directory:
```env
# Point this to your backend server
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```
*If these variables are omitted, `config.js` will gracefully fallback to the production Render URLs by default.*

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shubh6p/ChickYen-Frontend.git
   cd ChickYen-Frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser. The app will automatically reload when you make changes.

4. **Production Build:**
   ```bash
   npm run build
   ```
   This will generate optimized static assets in the `/dist` directory, ready to be deployed to Vercel, Netlify, or any static hosting provider.
