export default function AnnouncementBar({ announcements = [] }) {
  const defaultAnnouncements = [
    'NEW ARRIVALS EVERY WEEK',
    'FREE SHIPPING ON ORDERS ABOVE ₹999',
    'EASY 7-DAY RETURNS',
    'SECURE & 100% AUTHENTIC',
  ];

  const items = announcements.length > 0
    ? announcements.map(a => a.text || a)
    : defaultAnnouncements;

  const marqueeContent = items.join(' \u00A0\u00A0•\u00A0\u00A0 ');

  return (
    <div
      className="overflow-hidden bg-charcoal relative"
      style={{ height: '42px' }}
      id="announcement-bar"
    >
      <div className="flex items-center h-full">
        <div className="animate-marquee whitespace-nowrap flex items-center h-full">
          <span
            className="font-body text-white"
            style={{ fontSize: '13px', letterSpacing: '0.05em', fontWeight: 400 }}
          >
            {marqueeContent}
          </span>
          <span style={{ width: '80px', display: 'inline-block' }} />
          <span
            className="font-body text-white"
            style={{ fontSize: '13px', letterSpacing: '0.05em', fontWeight: 400 }}
          >
            {marqueeContent}
          </span>
        </div>
      </div>
    </div>
  );
}
