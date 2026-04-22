import { Send, Mail, Github, MapPin } from 'lucide-react';
import { useRef, useState } from 'react';
import gsap from 'gsap';

const ContactSection = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const btn = formRef.current?.querySelector('button');
    if (btn) gsap.fromTo(btn, { scale: 0.96 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-md bg-muted/20 border outline-none transition-all duration-300 font-body text-foreground placeholder:text-muted-foreground/20 text-sm`;

  const inputStyle = (field: string, accent: string) => ({
    borderColor: focused === field ? `hsl(${accent} / 0.4)` : 'hsl(var(--border) / 0.4)',
    boxShadow: focused === field ? `0 0 15px hsl(${accent} / 0.06)` : 'none',
  });

  return (
    <section id="contact-section" className="section-reveal py-24 md:py-32">
      <span className="section-label mb-8 block">04 — Contact</span>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left */}
        <div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
            Let's{' '}
            <span className="gradient-text">connect</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-md">
            Have an idea, a project, or just want to say hi? I'm always open to interesting conversations.
          </p>

          {/* Info */}
          <div className="space-y-4">
            {[
              { icon: <Mail className="w-4 h-4" />, label: 'Email', value: 'contact@martinpavlik.dev', accent: '185 100% 50%' },
              { icon: <Github className="w-4 h-4" />, label: 'GitHub', value: 'github.com/Balestruci0o', accent: '334 100% 50%' },
              { icon: <MapPin className="w-4 h-4" />, label: 'Location', value: 'Slovakia, EU 🇸🇰', accent: '38 91% 55%' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center"
                  style={{ background: `hsl(${item.accent} / 0.08)`, color: `hsl(${item.accent} / 0.6)` }}
                >
                  {item.icon}
                </div>
                <div>
                  <span className="block font-mono text-[0.5rem] uppercase tracking-[0.2em] text-muted-foreground/30">{item.label}</span>
                  <span className="text-sm text-foreground/80">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="stagger-card space-y-4 rounded-lg border border-border/40 p-6 md:p-8"
          style={{ background: 'hsl(var(--card))' }}
        >
          <div>
            <label className="block text-[0.6rem] font-mono text-muted-foreground/40 mb-2 uppercase tracking-[0.2em]">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className={inputClass('name')}
              style={inputStyle('name', '185 100% 50%')}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
            />
          </div>
          <div>
            <label className="block text-[0.6rem] font-mono text-muted-foreground/40 mb-2 uppercase tracking-[0.2em]">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              className={inputClass('email')}
              style={inputStyle('email', '334 100% 50%')}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
            />
          </div>
          <div>
            <label className="block text-[0.6rem] font-mono text-muted-foreground/40 mb-2 uppercase tracking-[0.2em]">Message</label>
            <textarea
              placeholder="What's on your mind?"
              rows={4}
              className={`${inputClass('message')} resize-y`}
              style={inputStyle('message', '38 91% 55%')}
              onFocus={() => setFocused('message')}
              onBlur={() => setFocused(null)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md font-display font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, hsl(185 100% 50%), hsl(334 100% 50%))',
              color: 'hsl(var(--background))',
            }}
          >
            Send Message
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
