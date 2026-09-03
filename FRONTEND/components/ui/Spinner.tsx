interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export default function Spinner({ 
  size = 'md', 
  color = 'white', 
  className = '' 
}: SpinnerProps) {
  // Map size to Tailwind classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
    lg: 'h-8 w-8 border-[3px]',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        border-${color} 
        border-t-transparent 
        rounded-full 
        animate-spin 
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
}