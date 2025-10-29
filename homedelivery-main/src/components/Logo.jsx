const Logo = ({ variant = 'horizontal', size = 100 }) => {
  const minSize = 40;
  const finalSize = Math.max(size, minSize);

  if (variant === 'horizontal') {
    return (
      <svg
        width={finalSize * 4.5}
        height={finalSize}
        viewBox="0 0 450 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ minWidth: `${minSize * 4.5}px` }}
      >
        <defs>
          <radialGradient
            id="brandGradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#969798" />
            <stop offset="55%" stopColor="#8FBD44" />
            <stop offset="70%" stopColor="#2354B8" />
            <stop offset="85%" stopColor="#DE3464" />
            <stop offset="100%" stopColor="#DE3464" />
          </radialGradient>
        </defs>

        <text
          x="0"
          y="75"
          fontSize="90"
          fontWeight="700"
          fontFamily="Aeonik, sans-serif"
          fill="#33393F"
        >
          H
        </text>

        <circle cx="110" cy="50" r="35" fill="url(#brandGradient)" />
        <circle cx="110" cy="50" r="20" fill="#FFFFFF" />
        <circle cx="145" cy="75" r="8" fill="#DE3464" />

        <text
          x="165"
          y="75"
          fontSize="90"
          fontWeight="700"
          fontFamily="Aeonik, sans-serif"
          fill="#33393F"
        >
          ME
        </text>

        <text
          x="320"
          y="45"
          fontSize="22"
          fontWeight="300"
          fontFamily="Aeonik, sans-serif"
          fill="#33393F"
        >
          Delivery
        </text>
        <text
          x="320"
          y="70"
          fontSize="22"
          fontWeight="300"
          fontFamily="Aeonik, sans-serif"
          fill="#33393F"
        >
          Logistics
        </text>
      </svg>
    );
  }

  if (variant === 'vertical') {
    return (
      <svg
        width={finalSize * 2.2}
        height={finalSize * 2.5}
        viewBox="0 0 220 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ minWidth: `${minSize * 2.2}px` }}
      >
        <defs>
          <radialGradient
            id="brandGradientVertical"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#969798" />
            <stop offset="55%" stopColor="#8FBD44" />
            <stop offset="70%" stopColor="#2354B8" />
            <stop offset="85%" stopColor="#DE3464" />
            <stop offset="100%" stopColor="#DE3464" />
          </radialGradient>
        </defs>

        <text
          x="0"
          y="75"
          fontSize="90"
          fontWeight="700"
          fontFamily="Aeonik, sans-serif"
          fill="#33393F"
        >
          H
        </text>

        <circle cx="110" cy="50" r="35" fill="url(#brandGradientVertical)" />
        <circle cx="110" cy="50" r="20" fill="#FFFFFF" />
        <circle cx="145" cy="75" r="8" fill="#DE3464" />

        <text
          x="0"
          y="160"
          fontSize="90"
          fontWeight="700"
          fontFamily="Aeonik, sans-serif"
          fill="#33393F"
        >
          ME
        </text>

        <text
          x="0"
          y="195"
          fontSize="22"
          fontWeight="300"
          fontFamily="Aeonik, sans-serif"
          fill="#33393F"
        >
          Delivery
        </text>
        <text
          x="0"
          y="220"
          fontSize="22"
          fontWeight="300"
          fontFamily="Aeonik, sans-serif"
          fill="#33393F"
        >
          Logistics
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={finalSize}
      height={finalSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ minWidth: `${minSize}px` }}
    >
      <defs>
        <radialGradient
          id="brandGradientIsotipo"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#969798" />
          <stop offset="55%" stopColor="#8FBD44" />
          <stop offset="70%" stopColor="#2354B8" />
          <stop offset="85%" stopColor="#DE3464" />
          <stop offset="100%" stopColor="#DE3464" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="40" fill="url(#brandGradientIsotipo)" />
      <circle cx="50" cy="50" r="25" fill="#FFFFFF" />
      <circle cx="75" cy="70" r="10" fill="#DE3464" />
    </svg>
  );
};

export default Logo;
