import { useState, useRef, useCallback, lazy, Suspense } from 'react';
import gsap from 'gsap';
import CLITerminal from '@/components/CLITerminal';

const GUIPortfolio = lazy(() => import('@/components/GUIPortfolio'));

type Mode = 'cli' | 'gui' | 'transitioning';

const Index = () => {
  const [mode, setMode] = useState<Mode>('cli');
  const containerRef = useRef<HTMLDivElement>(null);
  const cliRef = useRef<HTMLDivElement>(null);
  const guiRef = useRef<HTMLDivElement>(null);

  const launchGUI = useCallback(() => {
    if (mode !== 'cli') return;
    setMode('transitioning');

    const tl = gsap.timeline({
      onComplete: () => setMode('gui'),
    });

    // Glitch effect on CLI
    tl.to(cliRef.current, {
      duration: 0.15,
      x: () => Math.random() * 10 - 5,
      y: () => Math.random() * 6 - 3,
      repeat: 6,
      yoyo: true,
      ease: 'none',
    })
    .to(cliRef.current, {
      opacity: 0,
      scale: 0.92,
      filter: 'blur(8px)',
      duration: 0.6,
      ease: 'power2.in',
    })
    .fromTo(guiRef.current, 
      { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
      '-=0.2'
    );
  }, [mode]);

  const toggleCLI = useCallback(() => {
    if (mode === 'transitioning') return;

    if (mode === 'gui') {
      setMode('transitioning');
      const tl = gsap.timeline({
        onComplete: () => setMode('cli'),
      });
      tl.to(guiRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: 'power2.in',
      })
      .fromTo(cliRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      );
    } else {
      launchGUI();
    }
  }, [mode, launchGUI]);

  const showCLI = mode === 'cli' || mode === 'transitioning';
  const showGUI = mode === 'gui' || mode === 'transitioning';

  return (
    <div ref={containerRef} className="relative w-screen h-screen overflow-hidden bg-background">
      {/* CLI Layer */}
      <div
        ref={cliRef}
        className="absolute inset-0 z-10"
        style={{
          pointerEvents: mode === 'cli' ? 'auto' : 'none',
          opacity: mode === 'gui' ? 0 : 1,
        }}
      >
        {showCLI && <CLITerminal onLaunchGUI={launchGUI} />}
      </div>

      {/* GUI Layer */}
      <div
        ref={guiRef}
        className="absolute inset-0 z-20"
        style={{
          pointerEvents: mode === 'gui' ? 'auto' : 'none',
          opacity: mode === 'cli' ? 0 : mode === 'gui' ? 1 : 0,
        }}
      >
        {showGUI && (
          <Suspense fallback={null}>
            <GUIPortfolio onToggleCLI={toggleCLI} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Index;
