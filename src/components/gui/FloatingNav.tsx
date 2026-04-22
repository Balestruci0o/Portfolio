import { useEffect, useState, RefObject } from 'react';
import { Terminal } from 'lucide-react';

interface FloatingNavProps {
  onToggleCLI: () => void;
  scroller: RefObject<HTMLDivElement>;
}

const navItems = [
  { label: 'About', id: 'about-section' },
  { label: 'Skills', id: 'skills-section' },
  { label: 'Projects', id: 'projects-section' },
  { label: 'Contact', id: 'contact-section' },
];

const FloatingNav = ({ onToggleCLI, scroller }: FloatingNavProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const onScroll = () => {
      setScrolled(el.scrollTop > 80);
      for (const item of [...navItems].reverse()) {
        const section = document.getElementById(item.id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 200) {
            setActive(item.id);
            break;
          }
        }
      }
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scroller]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border border-border/30 rounded-full px-1.5 py-1.5'
          : 'bg-transparent px-4 py-4'
      }`}
    >
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => scroller.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display font-bold text-sm px-3 py-1.5 rounded-full text-foreground hover:text-primary transition-colors duration-300"
        >
          MP
        </button>

        <div className={`h-3 w-px bg-border/30 mx-1 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

        <div className={`flex items-center gap-0.5 transition-all duration-500 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-2.5 py-1.5 rounded-full text-[0.65rem] font-mono transition-all duration-300 ${
                active === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground/50 hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={`h-3 w-px bg-border/30 mx-1 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

        <button
          onClick={onToggleCLI}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[0.65rem] font-mono text-muted-foreground/50 hover:text-primary transition-all duration-300"
        >
          <Terminal className="w-3 h-3" />
          <span className="hidden sm:inline">CLI</span>
        </button>
      </div>
    </nav>
  );
};

export default FloatingNav;
