import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

interface Skill {
  name: string;
  level: number;
  accent: string;
  category: string;
  logo: string; // devicon CDN slug
}

const skills: Skill[] = [
  { name: 'JavaScript', level: 90, accent: '185 100% 50%', category: 'Language', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'GDScript', level: 85, accent: '38 91% 55%', category: 'Game', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg' },
  { name: 'HTML/CSS', level: 90, accent: '334 100% 50%', category: 'Web', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'PHP', level: 60, accent: '185 100% 50%', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
  { name: 'Tailwind', level: 60, accent: '185 100% 50%', category: 'CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'React', level: 40, accent: '334 100% 50%', category: 'Library', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Python', level: 35, accent: '38 91% 55%', category: 'Language', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Bootstrap', level: 55, accent: '334 100% 50%', category: 'CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
  { name: 'jQuery', level: 65, accent: '185 100% 50%', category: 'Library', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg' },
];

const CHART_SIZE = 460;
const CENTER = CHART_SIZE / 2;
const RINGS = 5;
const MAX_RADIUS = CHART_SIZE / 2 - 65;

const polarToCartesian = (angle: number, radius: number) => ({
  x: CENTER + radius * Math.cos(angle - Math.PI / 2),
  y: CENTER + radius * Math.sin(angle - Math.PI / 2),
});

const RadarChart = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const angleStep = (2 * Math.PI) / skills.length;

  useEffect(() => {
    if (!pathRef.current || !glowPathRef.current) return;
    pathRef.current.style.opacity = '0';
    glowPathRef.current.style.opacity = '0';
    const timer = setTimeout(() => {
      setAnimated(true);
      gsap.fromTo(pathRef.current, { opacity: 0, scale: 0, transformOrigin: 'center center' }, {
        opacity: 1, scale: 1, duration: 1.4, ease: 'elastic.out(1, 0.5)',
      });
      gsap.fromTo(glowPathRef.current, { opacity: 0, scale: 0, transformOrigin: 'center center' }, {
        opacity: 1, scale: 1, duration: 1.6, ease: 'elastic.out(1, 0.5)', delay: 0.1,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const buildPath = (scale = 1) => {
    const points = skills.map((skill, i) => {
      const angle = i * angleStep;
      const r = (skill.level / 100) * MAX_RADIUS * scale;
      return polarToCartesian(angle, r);
    });
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  };

  const ringPaths = Array.from({ length: RINGS }, (_, i) => {
    const r = ((i + 1) / RINGS) * MAX_RADIUS;
    const points = skills.map((_, j) => polarToCartesian(j * angleStep, r));
    return points.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  });

  const ringLabels = [20, 40, 60, 80, 100];

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute w-[350px] h-[350px] rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(circle, hsl(185 100% 50%), transparent 70%)' }} />

      <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`} className="w-full max-w-[500px] md:max-w-[550px]">
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(185 100% 50% / 0.25)" />
            <stop offset="60%" stopColor="hsl(334 100% 50% / 0.12)" />
            <stop offset="100%" stopColor="hsl(38 91% 55% / 0.08)" />
          </radialGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(185 100% 50%)" />
            <stop offset="50%" stopColor="hsl(334 100% 50%)" />
            <stop offset="100%" stopColor="hsl(38 91% 55%)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="bigGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid rings */}
        {ringPaths.map((d, i) => (
          <path key={`ring-${i}`} d={d} fill="none"
            stroke={`hsl(var(--border) / ${0.06 + i * 0.03})`} strokeWidth="0.5" />
        ))}

        {/* Ring % labels */}
        {ringLabels.map((pct, i) => {
          const r = ((i + 1) / RINGS) * MAX_RADIUS;
          const pos = polarToCartesian(0, r);
          return (
            <text key={`rl-${i}`} x={pos.x + 8} y={pos.y - 5}
              className="font-mono select-none pointer-events-none"
              style={{ fontSize: '6px', fill: 'hsl(var(--muted-foreground) / 0.15)' }}
            >{pct}%</text>
          );
        })}

        {/* Axis lines */}
        {skills.map((skill, i) => {
          const angle = i * angleStep;
          const end = polarToCartesian(angle, MAX_RADIUS);
          const isHov = hoveredIndex === i;
          return (
            <line key={`axis-${i}`} x1={CENTER} y1={CENTER} x2={end.x} y2={end.y}
              stroke={isHov ? `hsl(${skill.accent} / 0.3)` : 'hsl(var(--border) / 0.06)'}
              strokeWidth={isHov ? '1' : '0.5'}
              style={{ transition: 'all 0.3s ease' }} />
          );
        })}

        {/* Outer glow shape */}
        <path ref={glowPathRef} d={buildPath(animated ? 1 : 0)}
          fill="none" stroke="url(#radarStroke)" strokeWidth="8"
          strokeLinejoin="round" opacity="0.12" filter="url(#bigGlow)" />

        {/* Main radar shape */}
        <path ref={pathRef} d={buildPath(animated ? 1 : 0)}
          fill="url(#radarFill)" stroke="url(#radarStroke)" strokeWidth="2"
          strokeLinejoin="round" filter="url(#glow)" />

        {/* Data points, logos & labels */}
        {skills.map((skill, i) => {
          const angle = i * angleStep;
          const r = (skill.level / 100) * MAX_RADIUS;
          const point = polarToCartesian(angle, r);
          const labelR = MAX_RADIUS + 28;
          const labelPoint = polarToCartesian(angle, labelR);
          const isHov = hoveredIndex === i;
          const dotSize = isHov ? 7 : 5;

          return (
            <g key={skill.name}>
              {/* Hit area - covers dot and label area */}
              <circle cx={labelPoint.x} cy={labelPoint.y} r={24} fill="transparent" className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)} />
              <circle cx={point.x} cy={point.y} r={18} fill="transparent" className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)} />

              {/* Connection line on hover */}
              {isHov && (
                <line x1={point.x} y1={point.y}
                  x2={polarToCartesian(angle, MAX_RADIUS + 10).x}
                  y2={polarToCartesian(angle, MAX_RADIUS + 10).y}
                  stroke={`hsl(${skill.accent} / 0.3)`} strokeWidth="0.5" strokeDasharray="2 2" />
              )}

              {/* Glow rings on hover */}
              {isHov && (
                <>
                  <circle cx={point.x} cy={point.y} r={12}
                    fill={`hsl(${skill.accent} / 0.06)`}
                    stroke={`hsl(${skill.accent} / 0.2)`} strokeWidth="0.5" />
                  <circle cx={point.x} cy={point.y} r={20}
                    fill="none" stroke={`hsl(${skill.accent} / 0.06)`} strokeWidth="0.5" />
                </>
              )}

              {/* Data point — bigger */}
              <circle cx={point.x} cy={point.y} r={dotSize}
                fill={`hsl(${skill.accent})`}
                filter={isHov ? 'url(#glow)' : 'none'}
                opacity={isHov ? 1 : 0.7}
                style={{ transition: 'all 0.3s ease' }} />

              {/* Name label — bigger */}
              <text x={labelPoint.x} y={labelPoint.y}
                textAnchor="middle" dominantBaseline="middle"
                className="font-mono select-none pointer-events-none"
                style={{
                  fontSize: isHov ? '12px' : '11px',
                  fill: isHov ? `hsl(${skill.accent})` : `hsl(var(--foreground) / ${0.4 + (skill.level / 100) * 0.4})`,
                  fontWeight: isHov ? 700 : skill.level >= 80 ? 600 : 500,
                  transition: 'all 0.3s ease',
                  filter: isHov ? `drop-shadow(0 0 4px hsl(${skill.accent} / 0.4))` : 'none',
                }}
              >
                {skill.name}
              </text>

              {/* Level badge on hover */}
              {isHov && (
                <g>
                  <rect x={point.x - 18} y={point.y - 26} width="36" height="15" rx="3"
                    fill={`hsl(${skill.accent} / 0.15)`}
                    stroke={`hsl(${skill.accent} / 0.3)`} strokeWidth="0.5" />
                  <text x={point.x} y={point.y - 18.5}
                    textAnchor="middle" dominantBaseline="middle"
                    className="font-mono"
                    style={{ fontSize: '9px', fill: `hsl(${skill.accent})`, fontWeight: 700 }}
                  >{skill.level}%</text>
                </g>
              )}
            </g>
          );
        })}

        <circle cx={CENTER} cy={CENTER} r="2" fill="hsl(var(--foreground) / 0.1)" />
      </svg>
    </div>
  );
};

/* ── Skill bar list with logos ── */
const SkillListItem = ({ skill, index }: { skill: Skill; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="stagger-card flex items-center gap-3 py-3 cursor-default"
      onMouseEnter={() => { setHovered(true); gsap.to(ref.current, { x: 4, duration: 0.2 }); }}
      onMouseLeave={() => { setHovered(false); gsap.to(ref.current, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' }); }}
    >
      {/* Logo */}
      <img
        src={skill.logo}
        alt={skill.name}
        className="w-5 h-5 transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0.35 }}
      />

      <span
        className="text-sm font-display font-semibold w-24 transition-colors duration-300"
        style={{ color: hovered ? `hsl(${skill.accent})` : 'hsl(var(--foreground) / 0.75)' }}
      >
        {skill.name}
      </span>

      <div className="flex-1 h-[4px] rounded-full overflow-hidden" style={{ background: 'hsl(var(--border) / 0.15)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${skill.level}%`,
            background: hovered
              ? `linear-gradient(90deg, hsl(${skill.accent}), hsl(${skill.accent} / 0.5))`
              : `linear-gradient(90deg, hsl(${skill.accent} / 0.4), hsl(${skill.accent} / 0.15))`,
            boxShadow: hovered ? `0 0 12px hsl(${skill.accent} / 0.3)` : 'none',
          }}
        />
      </div>

      <span
        className="font-mono text-sm font-bold tabular-nums w-10 text-right transition-all duration-300"
        style={{
          color: hovered ? `hsl(${skill.accent})` : `hsl(${skill.accent} / ${0.2 + (skill.level / 100) * 0.5})`,
          textShadow: hovered ? `0 0 8px hsl(${skill.accent} / 0.3)` : 'none',
        }}
      >
        {skill.level}
      </span>
    </div>
  );
};

const SkillsSection = () => {
  return (
    <section id="skills-section" className="section-reveal py-24 md:py-32">
      <span className="section-label mb-8 block">02 — Skills</span>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight max-w-2xl mb-16">
        Technologies I{' '}
        <span className="gradient-text-warm">work with</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <RadarChart />
        <div>
          {skills.map((skill, i) => (
            <SkillListItem key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
