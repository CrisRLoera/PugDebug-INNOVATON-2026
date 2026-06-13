interface PugLogoProps {
  className?: string;
  size?: number;
}

export function PugLogo({ className = '', size = 80 }: PugLogoProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer purple ring */}
      <circle cx="40" cy="40" r="39" fill="#6B4FA0" />
      {/* Cream inner background */}
      <circle cx="40" cy="40" r="35" fill="#F5EFD6" />

      {/* Cape */}
      <path
        d="M 14 68 C 18 52 28 46 40 46 C 52 46 62 52 66 68 L 67 74 C 56 80 24 80 13 74 Z"
        fill="#6B4FA0"
      />

      {/* Shield badge */}
      <path d="M 35 52 L 35 61 L 40 64 L 45 61 L 45 52 L 40 50 Z" fill="#4A3070" />
      {/* Paw print on shield */}
      <circle cx="40" cy="58" r="3.5" fill="white" opacity="0.9" />
      <circle cx="36.5" cy="53.5" r="1.8" fill="white" opacity="0.8" />
      <circle cx="40" cy="52.5" r="1.8" fill="white" opacity="0.8" />
      <circle cx="43.5" cy="53.5" r="1.8" fill="white" opacity="0.8" />

      {/* Pug head */}
      <circle cx="40" cy="33" r="21" fill="#D4B896" />

      {/* Ears */}
      <ellipse cx="22" cy="21" rx="9" ry="11" fill="#3D2314" transform="rotate(-12 22 21)" />
      <ellipse cx="58" cy="21" rx="9" ry="11" fill="#3D2314" transform="rotate(12 58 21)" />

      {/* Snout */}
      <ellipse cx="40" cy="38" rx="12" ry="9" fill="#C8A882" />

      {/* Eyes — whites */}
      <circle cx="32" cy="30" r="5.5" fill="white" />
      <circle cx="48" cy="30" r="5.5" fill="white" />
      {/* Pupils */}
      <circle cx="33" cy="31" r="3.5" fill="#1a1010" />
      <circle cx="49" cy="31" r="3.5" fill="#1a1010" />
      {/* Eye shine */}
      <circle cx="34.2" cy="29.5" r="1.3" fill="white" />
      <circle cx="50.2" cy="29.5" r="1.3" fill="white" />

      {/* Nose */}
      <ellipse cx="40" cy="37" rx="5.5" ry="4" fill="#3D2314" />

      {/* Forehead wrinkle */}
      <path
        d="M 35 24 Q 40 26.5 45 24"
        stroke="#B8956A"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Cheek wrinkles */}
      <path
        d="M 29 37 Q 27 39 29 41"
        stroke="#B8956A"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M 51 37 Q 53 39 51 41"
        stroke="#B8956A"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Smile */}
      <path
        d="M 35 42 Q 40 47 45 42"
        stroke="#3D2314"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Decorative heart */}
      <path
        d="M 57.5 29 C 57.5 27.5 55.8 27 55 28 C 54.2 27 52.5 27.5 52.5 29 C 52.5 31.8 57.5 35 57.5 35 C 57.5 35 62.5 31.8 62.5 29 C 62.5 27.5 60.8 27 60 28 C 59.2 27 57.5 27.5 57.5 29 Z"
        fill="#9B6DC5"
        opacity="0.75"
      />
    </svg>
  );
}
