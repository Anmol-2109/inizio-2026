export default function CubeIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top face */}
      <path
        d="M12 2L3 7L12 12L21 7L12 2Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Left face (filled) */}
      <path
        d="M3 7L12 12V22L3 17V7Z"
        fill={color}
        opacity="0.85"
      />

      {/* Right face */}
      <path
        d="M21 7V17L12 22V12L21 7Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Left face edges (overlay) */}
      <path
        d="M3 7L12 12M3 7V17M12 12V22M3 17L12 22"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
