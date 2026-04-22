import { Github, ArrowUpRight } from 'lucide-react';
import { useState, useRef } from 'react';
import gsap from 'gsap';

interface Project {
  title: string;
  desc: string;
  tech: string[];
  status: 'wip' | 'completed';
  preview: string;
  github: string;
  accent: string;
  year: string;
}

const projects: Project[] = [
  {
    title: 'How Computers Work',
    desc: 'An interactive educational game exploring how computers really work — from transistors to the terminal.',
    tech: ['JavaScript', 'Canvas API', 'Game Logic'],
    status: 'wip',
    preview: '',
    github: 'https://github.com/Balestruci0o/_Project-Logic_Gates-v2',
    accent: '185 100% 50%',
    year: '2024',
  },
  {
    title: 'Linux Terminal',
    desc: 'A browser-based Linux terminal emulator with real command execution and file system simulation.',
    tech: ['JavaScript', 'HTML/CSS', 'Shell'],
    status: 'wip',
    preview: 'https://balestruci0o.github.io/Linux-Terminal-Emulator/',
    github: 'https://github.com/Balestruci0o/Linux-Terminal-Emulator',
    accent: '334 100% 50%',
    year: '2024',
  },
  {
    title: 'MotiMate',
    desc: 'A PHP-based motivation app for setting goals, tracking progress and reading motivational quotes.',
    tech: ['PHP', 'MySQL', 'CSS'],
    status: 'completed',
    preview: '',
    github: 'https://github.com/Balestruci0o/MotiMate',
    accent: '38 91% 55%',
    year: '2024',
  },
  {
    title: 'AI Learning Project',
    desc: 'A personal project exploring AI by building models and experimenting with algorithms.',
    tech: ['Python', 'ML', 'Research'],
    status: 'wip',
    preview: '',
    github: '',
    accent: '185 100% 50%',
    year: '2025',
  },
  {
    title: 'Future Shape',
    desc: 'An experimental project creating modern, dynamic shapes with web technologies and animations.',
    tech: ['CSS', 'JavaScript', 'Animation'],
    status: 'completed',
    preview: 'https://balestruci0o.github.io/Future-Shape/',
    github: 'https://github.com/Balestruci0o/Future-Shape',
    accent: '334 100% 50%',
    year: '2024',
  },
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleEnter = () => {
    setHovered(true);
    if (cardRef.current) gsap.to(cardRef.current, { y: -3, duration: 0.4, ease: 'power3.out' });
  };

  const handleLeave = () => {
    setHovered(false);
    if (cardRef.current) gsap.to(cardRef.current, { y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  };

  return (
    <div
      ref={cardRef}
      className="stagger-card group relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        className="relative h-full p-6 md:p-8 rounded-lg border transition-all duration-500 overflow-hidden"
        style={{
          borderColor: hovered ? `hsl(${project.accent} / 0.3)` : 'hsl(var(--border))',
          background: hovered
            ? `linear-gradient(160deg, hsl(${project.accent} / 0.04), hsl(var(--card)))`
            : 'hsl(var(--card))',
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-all duration-500"
          style={{
            background: hovered
              ? `linear-gradient(90deg, transparent, hsl(${project.accent} / 0.6), transparent)`
              : 'transparent',
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[0.5rem] tracking-widest uppercase px-2 py-0.5 rounded-sm"
              style={{
                background: project.status === 'wip' ? 'hsl(var(--accent) / 0.1)' : 'hsl(var(--primary) / 0.1)',
                color: project.status === 'wip' ? 'hsl(var(--accent))' : 'hsl(var(--primary))',
              }}
            >
              {project.status === 'wip' ? 'In dev' : 'Shipped'}
            </span>
            <span className="font-mono text-[0.5rem] text-muted-foreground/25">{project.year}</span>
          </div>
          <span
            className="font-display text-3xl font-bold leading-none transition-colors duration-500"
            style={{ color: hovered ? `hsl(${project.accent} / 0.15)` : 'hsl(var(--border) / 0.3)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-display font-bold text-lg md:text-xl mb-2 transition-colors duration-300"
          style={{ color: hovered ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.85)' }}
        >
          {project.title}
        </h3>

        {/* Desc */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-md">
          {project.desc}
        </p>

        {/* Tech */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[0.6rem] text-muted-foreground/40 transition-colors duration-300"
              style={{ color: hovered ? `hsl(${project.accent} / 0.6)` : undefined }}
            >
              {t}
              {project.tech.indexOf(t) < project.tech.length - 1 && (
                <span className="ml-2 text-muted-foreground/15">·</span>
              )}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {project.preview ? (
            <a
              href={project.preview}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[0.6rem] tracking-wider uppercase transition-colors duration-300"
              style={{ color: `hsl(${project.accent})` }}
            >
              Demo <ArrowUpRight className="w-3 h-3" />
            </a>
          ) : (
            <span className="font-mono text-[0.6rem] tracking-wider uppercase text-muted-foreground/20">
              Soon
            </span>
          )}

          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[0.6rem] tracking-wider uppercase text-muted-foreground/40 hover:text-foreground transition-colors duration-300"
            >
              <Github className="w-3 h-3" /> Source
            </a>
          ) : (
            <span className="font-mono text-[0.6rem] tracking-wider uppercase text-muted-foreground/20">
              Private
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  return (
    <section id="projects-section" className="section-reveal py-24 md:py-32">
      <span className="section-label mb-8 block">03 — Projects</span>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight max-w-2xl mb-16">
        Things I've{' '}
        <span className="gradient-text">built</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
