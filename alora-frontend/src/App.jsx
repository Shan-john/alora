import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import CollectionItems from './pages/CollectionItems';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';
import Track from './pages/Track';
import Checkout from './pages/Checkout';
import FAQ from './pages/FAQ';
import Compare from './pages/Compare';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Reviews from './pages/admin/Reviews';
import Homepage from './pages/admin/Homepage';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: '#1A1A1A',
                  color: '#FDFAF6',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                },
              }}
            />
            <Routes>
              {/* Public routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:slug" element={<CollectionItems />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/compare" element={<Compare />} />

                <Route path="/track" element={<Track />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="homepage" element={<Homepage />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
