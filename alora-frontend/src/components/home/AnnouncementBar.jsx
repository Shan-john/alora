export default function AnnouncementBar({ announcements = [] }) {
  const defaultAnnouncements = [
    'Free Shipping on Orders Above ₹999',
    'Easy 7-Day Returns',
    'Secure & 100% Authentic',
    'New Arrivals Every Week',
  ];

  const items = announcements.length > 0 ? announcements : defaultAnnouncements;
  const marqueeText = items.join('     ·     ');

  return (
    <div className="bg-charcoal text-warm/80 py-2.5 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="text-[10px] tracking-[0.2em] font-body mx-8 uppercase">{marqueeText}     ·     {marqueeText}</span>
        <span className="text-[10px] tracking-[0.2em] font-body mx-8 uppercase">{marqueeText}     ·     {marqueeText}</span>
      </div>
    </div>
  );
}
