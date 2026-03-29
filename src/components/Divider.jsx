import React from 'react';

const Divider = ({ direction = 'down' }) => {
  // El path del SVG cambia según la dirección para apuntar hacia arriba o abajo
  const path =
    direction === 'down'
      ? 'M0,0 L720,25 L1440,0 L1440,5 L720,30 L0,5 Z'
      : 'M0,30 L720,5 L1440,30 L1440,25 L720,0 L0,25 Z';

  return (
    <div className="bg-black" aria-hidden>
      <svg
        viewBox="0 0 1440 30"
        preserveAspectRatio="none"
        className="w-full h-8 block"
      >
        <defs>
          <linearGradient id="dividerMetal" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#6b7280" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#d1d5db" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6b7280" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={path} fill="url(#dividerMetal)" style={{ filter: 'url(#glow)' }} />
      </svg>
    </div>
  );
};

export default Divider;