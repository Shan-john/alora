import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AnnouncementBar from "../components/home/AnnouncementBar";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import CollectionBanners from "../components/home/CollectionBanners";
import BestSellers from "../components/home/BestSellers";
import GiftingBanner from "../components/home/GiftingBanner";
import IGSection from "../components/home/IGSection";
import TrustStrip from "../components/home/TrustStrip";
import Testimonials from "../components/home/Testimonials";
 

export default function Home() {
  const { settings } = useOutletContext();

  return (
    <>
      <Helmet>
        <title>
          {settings?.defaultMetaTitle ||
            "Alora by Trio | Premium Jewellery & Lifestyle"}
        </title>
        <meta
          name="description"
          content={
            settings?.defaultMetaDescription ||
            "Shop handcrafted luxury jewellery at Alora by Trio."
          }
        />
      </Helmet>

      {/* 1. Announcement marquee */}
      <AnnouncementBar announcements={settings?.announcements} />

      {/* 2. Split hero — lifestyle + product + colored bg */}
      <Hero slides={settings?.heroSlides} />

      {/* 3. Icon category bar */}
      <Categories />

      {/* 4. Side-by-side collection banners */}
      <CollectionBanners />

      {/* 5. Asymmetric products + lifestyle */}
      <BestSellers />

      {/* 6. "Collection" bg text + image + CTA */}
      <GiftingBanner banner={settings?.giftingBanner} />

      {/* 7. Centered testimonials */}
      <Testimonials />

      {/* 8. Newsletter signup */}
       

      {/* 9. Full-bleed Instagram strip */}
      <IGSection igPosts={settings?.igPosts} igHandle={settings?.igHandle} />

    </>
  );
}
