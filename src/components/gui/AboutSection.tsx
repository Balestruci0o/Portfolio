const stats = [
  { value: '5+', label: 'Projects', accent: 'hsl(var(--foreground))' },
  { value: '9', label: 'Technologies', accent: 'hsl(185 100% 50%)' },
  { value: '∞', label: 'Curiosity', accent: 'hsl(185 100% 50%)' },
  { value: 'Godot', label: 'Engine', accent: 'hsl(var(--foreground))' },
  { value: '2+', label: 'Years', accent: 'hsl(334 100% 50%)' },
  { value: '24/7', label: 'Learning', accent: 'hsl(38 91% 55%)' },
];

const AboutSection = () => {
  return (
    <section id="about-section" className="section-reveal py-24 md:py-32">
      <span className="section-label mb-8 block">01 — About</span>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-3">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
            Building the bridge between{' '}
            <span className="gradient-text">hardware & software</span>
          </h2>
        </div>

        <div className="lg:col-span-2 space-y-5 text-muted-foreground text-base leading-[1.8]">
          <p>
            Hi, I'm <span className="text-foreground font-medium">Martin Pavlik</span>, a tech enthusiast and student specializing in Intelligent Technologies. Since childhood, I've been fascinated by how computers work – from transistors to the terminal.
          </p>
          <p>
            I enjoy creating educational tools, interactive systems, and functional UIs. My projects blend low-level logic with creative user experience. I believe that understanding both hardware and software gives me a unique edge in building smart, user-driven applications.
          </p>
        </div>
      </div>

      {/* Marquee — stats */}
      <div
        className="mt-20 relative overflow-hidden border-y py-6"
        style={{
          borderColor: 'hsl(var(--border) / 0.3)',
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <div className="flex gap-16 animate-marquee whitespace-nowrap items-center">
          {[...stats, ...stats, ...stats].map((stat, i) => (
            <span key={i} className="flex items-center gap-16 shrink-0">
              <span className="flex items-baseline gap-3">
                <span
                  className="font-display text-4xl md:text-5xl font-bold"
                  style={{ color: stat.accent }}
                >
                  {stat.value}
                </span>
                <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground/60">
                  {stat.label}
                </span>
              </span>
              <span className="text-primary/30 text-2xl">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
