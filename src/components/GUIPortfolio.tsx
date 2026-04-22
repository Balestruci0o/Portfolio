import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './gui/HeroSection';
import AboutSection from './gui/AboutSection';
import SkillsSection from './gui/SkillsSection';
import ProjectsSection from './gui/ProjectsSection';
import ContactSection from './gui/ContactSection';
import FooterSection from './gui/FooterSection';
import FloatingNav from './gui/FloatingNav';

gsap.registerPlugin(ScrollTrigger);

interface GUIPortfolioProps {
  onToggleCLI: () => void;
}

const GUIPortfolio = ({ onToggleCLI }: GUIPortfolioProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = containerRef.current;
    if (!scroller) return;

    const ctx = gsap.context(() => {
      // Reveal sections on scroll
      gsap.utils.toArray<HTMLElement>('.section-reveal').forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            scroller,
          },
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });

      // Line reveals
      gsap.utils.toArray<HTMLElement>('.line-reveal').forEach((el) => {
        const child = el.children[0] as HTMLElement;
        if (!child) return;
        gsap.to(child, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            scroller,
          },
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
        });
      });

      // Stagger cards – scale + slide without hiding
      ScrollTrigger.batch('.stagger-card', {
        scroller,
        start: 'top 92%',
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { scale: 0.92, y: 30 },
            { scale: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' }
          );
        },
        once: true,
      });

      // Skill bars (width)
      ScrollTrigger.batch('.skill-bar-fill', {
        scroller,
        start: 'top 90%',
        onEnter: (elements) => {
          elements.forEach((el) => {
            const level = Number(el.getAttribute('data-width') || 0);
            gsap.to(el, { width: `${level}%`, duration: 1.2, ease: 'power2.out', delay: 0.1 });
          });
        },
        once: true,
      });

    }, scroller);

    return () => ctx.revert();
  }, []);

  // Mouse glow on bento cards
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cards = containerRef.current?.querySelectorAll('.bento-card');
    cards?.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      (card as HTMLElement).style.setProperty('--mouse-x', `${x}%`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}%`);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden noise-bg"
      onMouseMove={handleMouseMove}
    >
      <FloatingNav onToggleCLI={onToggleCLI} scroller={containerRef} />
      <HeroSection />
      <div className="max-w-7xl mx-auto px-5 md:px-10 pb-16">
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </div>
      <FooterSection />
    </div>
  );
};

export default GUIPortfolio;
