import React from 'react';

/**
 * Logo de Home Delivery Logistics
 * Implementa el degradado oficial del Manual de Marca con todos los puntos de color
 * Respeta área clara y tamaños mínimos
 */
const Logo = ({ size = 40, variant = 'horizontal', className = '' }) => {
  const height = size;
  const width = variant === 'horizontal' ? size * 6 : size * 2.5;

  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 240 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ minWidth: '120px', minHeight: '20px' }} // Tamaño mínimo del manual
      >
        {/* Definición del degradado oficial completo */}
        <defs>
          <linearGradient id="hdOfficialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#84BC28" />
            <stop offset="10%" stopColor="#0F66A7" />
            <stop offset="20%" stopColor="#604796" />
            <stop offset="30%" stopColor="#604796" />
            <stop offset="40%" stopColor="#AB307E" />
            <stop offset="50%" stopColor="#AB307E" />
            <stop offset="60%" stopColor="#D43070" />
            <stop offset="70%" stopColor="#D43070" />
            <stop offset="80%" stopColor="#E43367" />
            <stop offset="90%" stopColor="#E43367" />
            <stop offset="100%" stopColor="#E71664" />
          </linearGradient>
        </defs>

        {/* Isotipo - Círculo con degradado en la "O" */}
        <circle cx="20" cy="20" r="16" fill="url(#hdOfficialGradient)" />
        <circle cx="20" cy="20" r="10" fill="white" />

        {variant === 'horizontal' && (
          <g fill="#33393F">
            {/* HOME */}
            <text x="45" y="16" fontSize="14" fontWeight="700" fontFamily="Aeonik, sans-serif">
              HOME
            </text>
            {/* DELIVERY */}
            <text x="45" y="30" fontSize="14" fontWeight="500" fontFamily="Aeonik, sans-serif">
              DELIVERY
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default Logo;
