import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { api } from '../../utils/api';

export default function Layout() {
  const [settings, setSettings] = useState({});
  const location = useLocation();

  useEffect(() => {
    api.getSettings().then(data => setSettings(data.settings || {})).catch(() => {});
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="page-shell">
      <Navbar />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        <Outlet context={{ settings }} />
      </motion.main>
      <Footer settings={settings} />
    </div>
  );
}
