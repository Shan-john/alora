# Alora by Trio — Premium E-Commerce Platform

A high-end luxury jewelry e-commerce platform curated and built by Trio. Alora provides an elevated, dynamic shopping experience, emphasizing stunning visuals, smooth interactions, and a seamless path from product discovery to purchase.

## 🚀 Features & Working

- **Elevated Hero & Promotions**: A dynamic, animated marquee hero section highlighting top collections, custom lifestyle aesthetics, and dynamic image grids to engage shoppers immediately upon arrival.
- **Product Listing & Filtering**: Browse handcrafted luxury jewelry with advanced category filtering options, sorting, and a premium responsive grid view.
- **Dynamic Shopping Cart & Wishlist**: Seamlessly add products to your wishlist or cart using global context providers and a clean slide-out drawer interface.
- **Product Details & High-Res Gallery**: View rich product descriptions, image zoom mechanics on mouse hover, and select variants/sizes.
- **WhatsApp "Buy & Gift" Integration**: A customized purchase flow where users can check out via WhatsApp. Includes a dedicated **Gift Order** toggle that dynamically builds a pre-filled, highly detailed WhatsApp template with product links and shipping/recipient placeholders.
- **Customer Reviews**: "Google Review" style integrated user reviews enabling users to anonymously or nominally rate products and drop feedback with a 5-star scaling interface under each product.
- **Admin Panel Control**: Integrated custom admin panel connecting to the frontend, allowing dynamic, on-the-fly updates to the homepage hero slides, BestSellers featured imagery, and global application settings (like the dynamic WhatsApp contact number).
- **Responsive Navigation**: Includes a mobile-first sliding drawer menu, sticky headers, and an overlaid globally accessible quick search panel.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **React 19**: Modern component-based UI structure leveraging the latest React functional paradigms.
- **Vite & @vitejs/plugin-react**: Blazing fast build tooling, dependency pre-bundling, and snappy hot-module replacement (HMR).
- **Tailwind CSS v4 & Framer Motion**: Utility-first scalable styling coupled with crisp, state-driven declarative micro-animations, page transitions, and element reveals.
- **React Router DOM v6**: Advanced client-side routing for seamless navigation between products, shop environments, collections, and admin panels.
- **Context API Architecture**: Global state management tailored to handle shopping carts, wish lists, and user preference sync across routes contextually.

### UX / UI Tooling
- **Lucide React**: Elegant, consistent, and highly legible SVG icons used throughout the interface.
- **React Hook Form & React Hot Toast**: Seamless handling of form inputs and stylish, non-intrusive toast notifications across user actions.
- **React Helmet Async**: Dynamic manipulation of document head data for comprehensive SEO optimization (`titles`, `meta` tags, OpenGraph data).

### Logic & Backend Interfacing
- **API Utilities Abstraction**: The frontend is fully decoupled using `src/utils/api.js`, which interfaces seamlessly with backend systems (Node.js/Firebase) to pull product schemas, dynamic settings, user reviews, and cart states.
- **WhatsApp Protocol (wa.me)**: Encoded URI parameters dynamically feed deep link commands into WhatsApp web/mobile interfaces directly from the React context.

---

## 💻 Local Setup & Development

To get the frontend up and running locally:

1. Follow standard setup patterns by installing dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Create your `.env` based on `.env.example` to point the frontend to the correct Backend API endpoint.
