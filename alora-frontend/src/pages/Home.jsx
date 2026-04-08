import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import BestSellers from '../components/home/BestSellers';
import IGSection from '../components/home/IGSection';
import TrustStrip from '../components/home/TrustStrip';
import Testimonials from '../components/home/Testimonials';
import GiftingBanner from '../components/home/GiftingBanner';
import EmailCapture from '../components/home/EmailCapture';

export default function Home() {
  const { settings } = useOutletContext();

  return (
    <>
      <Helmet>
        <title>{settings?.defaultMetaTitle || 'Alora by Trio | Premium Jewellery & Lifestyle'}</title>
        <meta name="description" content={settings?.defaultMetaDescription || 'Shop handcrafted luxury jewellery at Alora by Trio.'} />
      </Helmet>

      <AnnouncementBar announcements={settings?.announcements} />
      <Hero slides={settings?.heroSlides} />
      <Categories />
      <BestSellers />
      <IGSection igPosts={settings?.igPosts} />
      <TrustStrip items={settings?.trustItems} />
      <Testimonials />
      <GiftingBanner banner={settings?.giftingBanner} />
      <EmailCapture />
    </>
  );
}
