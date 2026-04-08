import { useEffect, useState } from 'react';

export default function AnnouncementBar({ announcements = [] }) {
  const defaultAnnouncements = [
    'Free Shipping on Orders Above ₹999',
    'Easy 7-Day Returns',
    'Secure & 100% Authentic',
    'New Arrivals Every Week',
  ];

  const items = announcements.length > 0 ? announcements : defaultAnnouncements;
  const marqueeText = items.join('  ·  ');

  return (
    <div className="bg-charcoal text-warm py-2 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="text-xs tracking-wider font-body mx-8">{marqueeText}  ·  {marqueeText}</span>
        <span className="text-xs tracking-wider font-body mx-8">{marqueeText}  ·  {marqueeText}</span>
      </div>
    </div>
  );
}
