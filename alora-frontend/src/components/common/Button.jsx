import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'solid',
  size = 'md',
  className = '',
  loading = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-body tracking-[0.15em] uppercase transition-all duration-300 ease-out disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    solid:
      'bg-gold text-charcoal hover:bg-charcoal hover:text-warm border border-gold hover:border-charcoal',
    outline:
      'border border-gold/60 text-gold hover:bg-gold hover:text-warm',
    ghost:
      'text-charcoal hover:text-gold border border-transparent',
    danger:
      'bg-red-600 text-white hover:bg-red-700 border border-transparent',
    white:
      'border border-white/40 text-white hover:bg-white hover:text-charcoal',
    'gold-outline':
      'border border-gold/60 text-gold hover:bg-gold/10',
  };

  const sizes = {
    sm: 'py-2 px-5 text-[10px]',
    md: 'py-3 px-8 text-[11px]',
    lg: 'py-4 px-12 text-[11px]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant] || variants.solid} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-3.5 w-3.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
