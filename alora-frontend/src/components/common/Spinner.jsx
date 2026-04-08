export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-stone-200 border-t-gold`} />
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-stone-200 border-t-gold mx-auto" />
        <p className="mt-4 text-stone-500 font-body text-sm tracking-wider uppercase">Loading...</p>
      </div>
    </div>
  );
}
