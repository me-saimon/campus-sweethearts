// Reusable Islamic vector SVG components

export const CrescentStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
    <path d="M32 4C17.64 4 6 15.64 6 30s11.64 26 26 26c4.56 0 8.86-1.18 12.6-3.24A22 22 0 0 1 20 30a22 22 0 0 1 24.6-21.76C41.86 5.18 37.56 4 33 4h-1z" />
    <path d="M48 14l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
  </svg>
);

export const Lantern = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 80" fill="currentColor" className={className}>
    <path d="M22 0h4v8h-4z" opacity="0.6" />
    <path d="M20 8h8l2 4H18z" />
    <path d="M16 12h16c2 0 4 6 4 16s-2 20-4 24H16c-2-4-4-14-4-24s2-16 4-16z" opacity="0.8" />
    <path d="M20 12h8v4l-4 2-4-2z" opacity="0.5" />
    <ellipse cx="24" cy="56" rx="8" ry="3" opacity="0.6" />
    <path d="M22 56h4v6l-2 4-2-4z" opacity="0.5" />
  </svg>
);

export const MosqueDome = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 80" fill="currentColor" className={className}>
    <path d="M60 5 Q40 5 30 30 L30 75 L90 75 L90 30 Q80 5 60 5Z" opacity="0.15" />
    <rect x="57" y="0" width="6" height="12" rx="3" opacity="0.3" />
    <path d="M10 75 L10 50 Q20 30 30 50 L30 75Z" opacity="0.1" />
    <path d="M90 75 L90 50 Q100 30 110 50 L110 75Z" opacity="0.1" />
    <rect x="18" y="28" width="4" height="15" rx="2" opacity="0.15" />
    <rect x="98" y="28" width="4" height="15" rx="2" opacity="0.15" />
    <path d="M45 75 L45 50 Q52.5 40 60 50 L60 75Z" opacity="0.08" />
    <path d="M60 75 L60 50 Q67.5 40 75 50 L75 75Z" opacity="0.08" />
  </svg>
);

export const IslamicFrame = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" className={className}>
    <circle cx="100" cy="100" r="95" />
    <circle cx="100" cy="100" r="85" />
    <polygon points="100,10 130,40 170,50 150,85 160,125 125,140 100,175 75,140 40,125 50,85 30,50 70,40" />
    <polygon points="100,25 120,50 155,55 140,80 148,115 120,128 100,158 80,128 52,115 60,80 45,55 80,50" />
    {/* 8-pointed star */}
    <path d="M100 20 L115 85 L180 100 L115 115 L100 180 L85 115 L20 100 L85 85Z" />
    <path d="M100 35 L110 85 L165 100 L110 115 L100 165 L90 115 L35 100 L90 85Z" />
  </svg>
);

export const ArabicBismillah = ({ className }: { className?: string }) => (
  <div className={className}>
    <span className="font-display text-lg opacity-30" style={{ fontFamily: "'Amiri', serif" }}>
      ﷽
    </span>
  </div>
);
