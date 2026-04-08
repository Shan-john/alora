import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CheckoutModal from '../components/checkout/CheckoutModal';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method') || 'instagram';

  return (
    <>
      <Helmet><title>Checkout | Alora by Trio</title></Helmet>
      <div className="pt-20 min-h-screen bg-ivory">
        <CheckoutModal isOpen={true} onClose={() => window.history.back()} defaultMethod={method} />
      </div>
    </>
  );
}
