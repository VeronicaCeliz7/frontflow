// src/components/UrbanFlowLogo.tsx
interface UrbanFlowLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showText?: boolean;
  rotated?: boolean;
}

const UrbanFlowLogo = ({ 
  size = 'medium',
  className = '',
  showText = true,
  rotated = true
}: UrbanFlowLogoProps) => {
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-xl',
    large: 'text-2xl md:text-3xl'
  };

  const subtextSizes = {
    small: 'text-xs',
    medium: 'text-xs',
    large: 'text-xs md:text-sm'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* SVG Logo con rotación */}
      <div 
        className={`${sizeClasses[size]} transition-transform duration-300`}
        style={{ transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#ECFEFF" />
          <g stroke="#12047A" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
            <line x1="30" y1="20" x2="30" y2="80" />
            <line x1="50" y1="20" x2="50" y2="80" />
            <line x1="70" y1="20" x2="70" y2="80" />
            <line x1="20" y1="35" x2="80" y2="35" />
            <line x1="20" y1="50" x2="80" y2="50" />
            <line x1="20" y1="65" x2="80" y2="65" />
          </g>
          <g transform="translate(50, 45)">
            <path
              d="M0,-20 C12,-10 18,4 18,14 C18,24 10,30 0,30 C-10,30 -18,24 -18,14 C-18,4 -12,-10 0,-20Z"
              fill="#12047A"
            />
            <circle cx="0" cy="12" r="9" fill="white" />
            <circle cx="0" cy="12" r="5" fill="#97F395" />
          </g>
        </svg>
      </div>
      
      {/* Texto del logo (opcional) */}
      {showText && (
        <div className="text-center mt-3">
          <h1 className={`${textSizes[size]} font-bold tracking-tighter text-gray-900`}>
            URBANFLOW
          </h1>
          <p className={`${subtextSizes[size]} text-gray-500 mt-0.5`}>
            Reporta incidencias en tu ciudad
          </p>
        </div>
      )}
    </div>
  );
};

export default UrbanFlowLogo;