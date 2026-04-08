import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 — Page Not Found | Alora by Trio</title></Helmet>
      <div className="pt-32 pb-20 min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center px-4">
          <p className="font-display text-8xl font-semibold text-gold/20 mb-4">404</p>
          <h1 className="font-display text-3xl font-semibold text-charcoal mb-4">Page Not Found</h1>
          <p className="text-stone-500 text-sm font-body mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/shop">
            <Button variant="solid" size="lg">
              <Home size={16} className="mr-2" /> Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
