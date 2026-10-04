export function WelcomeIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background blobs */}
      <ellipse cx="180" cy="280" rx="160" ry="20" fill="#F3EBDD" />
      <circle cx="60" cy="80" r="30" fill="#FFE0D6" opacity="0.5" />
      <circle cx="310" cy="50" r="20" fill="#DEEFE2" opacity="0.6" />
      <circle cx="320" cy="220" r="25" fill="#FFE0D6" opacity="0.4" />

      {/* Sun */}
      <circle cx="300" cy="70" r="18" fill="#FFC4B3" opacity="0.7" />

      {/* Park bench */}
      <rect x="70" y="210" width="220" height="12" rx="6" fill="#C9BCB0" />
      <rect x="80" y="222" width="8" height="40" rx="4" fill="#A89889" />
      <rect x="272" y="222" width="8" height="40" rx="4" fill="#A89889" />

      {/* Elderly person */}
      <g transform="translate(90, 100)">
        {/* Body */}
        <ellipse cx="45" cy="80" rx="38" ry="45" fill="#92C9A0" />
        {/* Shawl */}
        <path d="M12 75 Q45 65 78 75 L78 100 Q45 90 12 100 Z" fill="#6BAE7B" opacity="0.6" />
        {/* Head */}
        <circle cx="45" cy="35" r="28" fill="#FFD8C2" />
        {/* Hair (gray) */}
        <path d="M20 25 Q25 5 45 8 Q65 5 70 25 Q68 18 45 15 Q22 18 20 25" fill="#E0D7CD" />
        {/* Glasses */}
        <circle cx="35" cy="35" r="7" fill="none" stroke="#4A3F37" strokeWidth="2" />
        <circle cx="55" cy="35" r="7" fill="none" stroke="#4A3F37" strokeWidth="2" />
        <line x1="42" y1="35" x2="48" y2="35" stroke="#4A3F37" strokeWidth="2" />
        {/* Smile */}
        <path d="M38 48 Q45 53 52 48" stroke="#4A3F37" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Cheeks */}
        <circle cx="28" cy="44" r="5" fill="#FFA488" opacity="0.4" />
        <circle cx="62" cy="44" r="5" fill="#FFA488" opacity="0.4" />
      </g>

      {/* Helper (younger person) */}
      <g transform="translate(210, 110)">
        {/* Body */}
        <ellipse cx="40" cy="75" rx="35" ry="42" fill="#FFA488" />
        {/* Bag */}
        <rect x="55" y="80" width="22" height="28" rx="6" fill="#E04E2D" />
        <path d="M58 80 Q66 72 74 80" stroke="#E04E2D" strokeWidth="3" fill="none" />
        {/* Head */}
        <circle cx="40" cy="30" r="25" fill="#FFD8C2" />
        {/* Hair */}
        <path d="M15 22 Q20 5 40 6 Q60 5 65 22 Q62 15 40 12 Q18 15 15 22" fill="#6B5D52" />
        {/* Smile */}
        <path d="M33 40 Q40 45 47 40" stroke="#4A3F37" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Eyes */}
        <circle cx="31" cy="33" r="2.5" fill="#4A3F37" />
        <circle cx="49" cy="33" r="2.5" fill="#4A3F37" />
        {/* Cheeks */}
        <circle cx="25" cy="40" r="4" fill="#FFA488" opacity="0.4" />
        <circle cx="55" cy="40" r="4" fill="#FFA488" opacity="0.4" />
      </g>

      {/* Heart between them */}
      <g transform="translate(170, 70)">
        <path
          d="M0 8 C0 3, 5 0, 10 4 C15 0, 20 3, 20 8 C20 14, 10 22, 10 22 C10 22, 0 14, 0 8"
          fill="#F9633F"
          className="animate-pulse-soft"
        />
      </g>
    </svg>
  );
}
