import { Helmet } from 'react-helmet-async';
import { useOutletContext } from 'react-router-dom';
import CheckoutModal from '../components/checkout/CheckoutModal';

export default function Checkout() {
  const { settings = {} } = useOutletContext() || {};
  
  return (
    <>
      <Helmet><title>Checkout | Alora by Trio</title></Helmet>
      <div className="pt-20 min-h-screen bg-ivory">
        <CheckoutModal isOpen={true} onClose={() => window.history.back()} settings={settings} />
      </div>
    </>
  );
}
