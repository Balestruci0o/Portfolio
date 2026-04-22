import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/* ── Simulated code that types out ── */
const codeLines = [
  { text: 'const ', color: 'hsl(334 100% 50%)' },
  { text: 'developer', color: 'hsl(185 100% 50%)' },
  { text: ' = {', color: 'hsl(220 10% 55%)' },
  { text: '\n  name', color: 'hsl(185 100% 50%)' },
  { text: ': ', color: 'hsl(220 10% 55%)' },
  { text: '"Martin Pavlik"', color: 'hsl(38 91% 55%)' },
  { text: ',', color: 'hsl(220 10% 55%)' },
  { text: '\n  focus', color: 'hsl(185 100% 50%)' },
  { text: ': ', color: 'hsl(220 10% 55%)' },
  { text: '["Web", "Godot", "Low-Level"]', color: 'hsl(38 91% 55%)' },
  { text: ',', color: 'hsl(220 10% 55%)' },
  { text: '\n  passion', color: 'hsl(185 100% 50%)' },
  { text: ': ', color: 'hsl(220 10% 55%)' },
  { text: 'Infinity', color: 'hsl(334 100% 50%)' },
  { text: ',', color: 'hsl(220 10% 55%)' },
  { text: '\n};', color: 'hsl(220 10% 55%)' },
];

const TypedCode = () => {
  const [displayed, setDisplayed] = useState<{ text: string; color: string }[]>([]);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    const fullText = codeLines.map(s => s.text).join('');
    if (currentChar >= fullText.length) return;

    const timeout = setTimeout(() => {
      // Find which segment & char position
      let charCount = 0;
      const newDisplayed: { text: string; color: string }[] = [];
      
      for (const segment of codeLines) {
        const segEnd = charCount + segment.text.length;
        if (currentChar >= segEnd) {
          newDisplayed.push({ text: segment.text, color: segment.color });
        } else if (currentChar >= charCount) {
          const visibleChars = currentChar - charCount + 1;
          newDisplayed.push({ text: segment.text.substring(0, visibleChars), color: segment.color });
        }
        charCount = segEnd;
      }
      
      setDisplayed(newDisplayed);
      setCurrentChar(prev => prev + 1);
    }, 35 + Math.random() * 25);

    return () => clearTimeout(timeout);
  }, [currentChar]);

  return (
    <pre className="font-mono text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre">
      {displayed.map((seg, i) => (
        <span key={i} style={{ color: seg.color }}>{seg.text}</span>
      ))}
      <span className="border-r-2 animate-typing-cursor ml-px">&nbsp;</span>
    </pre>
  );
};

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from('.hero-greeting', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      })
      .from('.hero-name', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.3')
      .from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.4')
      .from(codeRef.current, {
        opacity: 0,
        y: 30,
        scale: 0.97,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.3')
      .from(scrollRef.current, {
        opacity: 0,
        duration: 0.5,
      }, '-=0.2');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, hsl(185 100% 50%), transparent 70%)' }} />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, hsl(334 100% 50%), transparent 70%)' }} />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(220 10% 92%) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div ref={contentRef} className="relative z-10 w-full max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div>
            <p className="hero-greeting font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-4">
              Hello, World
            </p>
            <h1 className="hero-name font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] text-foreground mb-6">
              Martin
              <br />
              <span className="gradient-text">Pavlik</span>
            </h1>
            <p className="hero-subtitle text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
              Tech enthusiast & student building interactive systems 
              — from transistors to beautiful interfaces.
            </p>
          </div>

          {/* Right: Code editor */}
          <div ref={codeRef}>
            <div className="rounded-lg border border-border overflow-hidden" style={{ background: 'hsl(240 20% 5%)' }}>
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(0 70% 50%)' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(38 91% 55%)' }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(120 60% 45%)' }} />
                </div>
                <span className="font-mono text-[0.6rem] text-muted-foreground/40 ml-2">developer.ts</span>
              </div>
              {/* Code area */}
              <div className="p-5 min-h-[180px]">
                <TypedCode />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll */}
      <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-muted-foreground/30">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary/30 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
