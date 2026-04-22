import { Github } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer className="border-t border-border/15 py-8 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="font-mono text-[0.6rem] text-muted-foreground/30 tracking-wider">
          © 2025 Martin Pavlik
        </span>

        <a
          href="https://github.com/Balestruci0o"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground/30 hover:text-primary transition-colors duration-300"
          aria-label="GitHub"
        >
          <Github className="w-4 h-4" />
        </a>

        <span className="font-mono text-[0.6rem] text-muted-foreground/20 tracking-wider hidden sm:block">
          Built with passion & code
        </span>
      </div>
    </footer>
  );
};

export default FooterSection;
