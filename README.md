# ChickYen Achar - Frontend Application 🍗🌶️

This repository contains the React frontend for the **ChickYen Achar** e-commerce store. It includes both the customer-facing storefront and a fully-featured secure Administrative Dashboard.

## 🚀 Tech Stack
- **Framework:** React.js powered by Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React & FontAwesome
- **Routing:** React Router DOM
- **State Management:** React Context API (Cart, Auth, Admin)
- **HTTP Client:** Axios

## ✨ Key Features
- **Dynamic Storefront:** Beautiful, responsive UI showcasing the best spicy chicken achar.
- **Cart & Checkout:** Slide-out cart drawer, dynamic stock checking, and seamless checkout flows.
- **OTP Authentication:** Modern, passwordless email/phone login flow.
- **Admin Dashboard (`/admin`):**
  - **Analytics:** Sales charts and dashboard widgets.
  - **Orders:** Process, ship, and complete orders.
  - **Products & Stock:** Manage inventory and add new products.
  - **Activity Logs:** View real-time system events (new users, new orders).
  - **Newsletter Broadcasts:** Send promotional emails directly from the admin panel.

## 🛠️ Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shubh6p/ChickYen-Frontend.git
   cd ChickYen-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory to configure your API connection:
   ```env
   # Connects the frontend to your local or deployed backend API
   VITE_API_URL=http://localhost:5000/api
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will typically run at `http://localhost:5173`.

## 📁 Folder Structure
- `/src/components`: Reusable UI components (Navbar, Footer, ProductCards, Modals)
- `/src/pages`: Main application routes (Home, Menu, Checkout, Login)
- `/src/pages/admin`: Secure admin panel routes and layouts
- `/src/context`: Global state providers for Auth and Cart
- `/src/config.js`: Centralized configuration for API endpoints

---
*Crafted with care. Delivered with flavour.*
