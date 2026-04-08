const badgeStyles = {
  gold: 'bg-gold/10 text-gold border-gold/20',
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  gray: 'bg-gray-50 text-gray-700 border-gray-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function Badge({ children, color = 'gold', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyles[color]} ${className}`}>
      {children}
    </span>
  );
}
