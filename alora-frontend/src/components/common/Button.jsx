import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'solid',
  size = 'md',
  className = '',
  loading = false,
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-body tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    solid: 'bg-gold text-warm hover:bg-charcoal border border-transparent',
    outline: 'border border-gold text-gold hover:bg-gold hover:text-warm',
    ghost: 'text-charcoal hover:text-gold',
    danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
  };

  const sizes = {
    sm: 'py-2 px-4 text-xs',
    md: 'py-3 px-8 text-sm',
    lg: 'py-4 px-10 text-sm',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
