import { useState, useRef, useEffect, useCallback } from 'react';

const ASCII_ART = `
 ██████╗  █████╗ ██╗   ██╗██╗     ██╗██╗  ██╗
 ██╔══██╗██╔══██╗██║   ██║██║     ██║██║ ██╔╝
 ██████╔╝███████║██║   ██║██║     ██║█████╔╝ 
 ██╔═══╝ ██╔══██║██║   ██║██║     ██║██╔═██╗ 
 ██║     ██║  ██║╚██████╔╝███████╗██║██║  ██╗
 ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═╝`;

const SYSTEM_FILES: Record<string, string> = {
  'about.txt': "I'm a full-stack developer with expertise in both low-level systems\nand modern UI/UX design. My journey began with command-line interfaces\nand has evolved to creating beautiful, interactive experiences.",
  'projects.txt': "1. How Computers Work - Interactive educational game (Godot)\n2. MotiMate - PHP motivation journal\n3. Linux Terminal - Browser-based terminal emulator\n4. AI Learning Project - Personal AI experiments\n5. Future Shape - Dynamic web animations",
  'contact.txt': "Email: contact@martinpavlik.dev\nGitHub: github.com/Balestruci0o\nLinkedIn: linkedin.com/in/martinpavlik"
};

interface OutputLine {
  id: number;
  content: string;
  type: 'command' | 'output' | 'error' | 'system';
}

interface CLITerminalProps {
  onLaunchGUI: () => void;
}

let lineId = 0;

const CLITerminal = ({ onLaunchGUI }: CLITerminalProps) => {
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [displayedAscii, setDisplayedAscii] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [userFiles, setUserFiles] = useState<Record<string, string>>({});

  const getAllFiles = useCallback(() => ({ ...SYSTEM_FILES, ...userFiles }), [userFiles]);

  // ASCII art typing animation
  useEffect(() => {
    const asciiLines = ASCII_ART.split('\n');
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine <= asciiLines.length) {
        setDisplayedAscii(asciiLines.slice(0, currentLine).join('\n'));
        currentLine++;
      } else {
        clearInterval(interval);
        // After ASCII, show welcome message
        setTimeout(() => {
          addLine("System ready. Type 'help' for available commands.", 'system');
        }, 300);
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [lines]);

  const addLine = (content: string, type: OutputLine['type'] = 'output') => {
    setLines(prev => [...prev, { id: lineId++, content, type }]);
  };

  const typeLines = async (textLines: string[]) => {
    setIsTyping(true);
    for (const line of textLines) {
      await new Promise<void>(resolve => {
        setTimeout(() => {
          addLine(line);
          resolve();
        }, 40);
      });
    }
    setIsTyping(false);
  };

  const processCommand = async (command: string) => {
    addLine(`user@portfolio:~$ ${command}`, 'command');
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    const parts = command.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const files = getAllFiles();

    switch (cmd) {
      case 'help':
        await typeLines([
          'Available commands:',
          '  help        — Show this help message',
          '  ls          — List directory contents',
          '  cat [file]  — Show file contents',
          '  clear       — Clear the terminal',
          '  launch gui  — Launch graphical interface',
          '  touch [f]   — Create a new file',
          '  rm [file]   — Remove a file',
          '  whoami      — Display current user',
          '  neofetch    — System information',
        ]);
        break;

      case 'ls':
        addLine(Object.keys(files).join('    '));
        break;

      case 'cat':
        if (!args[0]) { addLine('Usage: cat [filename]', 'error'); break; }
        if (files[args[0]]) {
          await typeLines(files[args[0]].split('\n'));
        } else {
          addLine(`cat: ${args[0]}: No such file or directory`, 'error');
        }
        break;

      case 'clear':
        setLines([]);
        break;

      case 'launch':
        if (args[0] === 'gui') {
          addLine('Initializing graphical interface...', 'system');
          await new Promise(r => setTimeout(r, 600));
          addLine('Loading modules...', 'system');
          await new Promise(r => setTimeout(r, 400));
          addLine('GUI ready. Transitioning...', 'system');
          await new Promise(r => setTimeout(r, 500));
          onLaunchGUI();
        } else {
          addLine('Usage: launch gui', 'error');
        }
        break;

      case 'touch':
        if (!args[0]) { addLine('Usage: touch [filename]', 'error'); break; }
        if (files[args[0]]) {
          addLine(`File '${args[0]}' already exists`, 'error');
        } else {
          setUserFiles(prev => ({ ...prev, [args[0]]: '' }));
          addLine(`Created empty file '${args[0]}'`);
        }
        break;

      case 'rm':
        if (!args[0]) { addLine('Usage: rm [filename]', 'error'); break; }
        if (SYSTEM_FILES[args[0]]) {
          addLine(`rm: cannot remove '${args[0]}': System files are protected`, 'error');
        } else if (userFiles[args[0]] !== undefined) {
          setUserFiles(prev => {
            const next = { ...prev };
            delete next[args[0]];
            return next;
          });
          addLine(`Removed file '${args[0]}'`);
        } else {
          addLine(`rm: cannot remove '${args[0]}': No such file`, 'error');
        }
        break;

      case 'whoami':
        addLine('martin@portfolio');
        break;

      case 'neofetch':
        await typeLines([
          '         ▄▄▄▄▄▄▄▄▄▄▄         martin@portfolio',
          '       ▄▀░░░░░░░░░░░▀▄       ─────────────────',
          '      █░░░░░░░░░░░░░░░█      OS: PortfolioOS 2.0',
          '     █░░░░░░░░░░░░░░░░█      Host: Martin Pavlik',
          '    █░░░░░░░░░░░░░░░░░█      Kernel: React 18.3',
          '    █░░░░▀▀▀▀▀░░░░░░░█       Shell: CLI v2.0',
          '    █░░░░░░░░░░░░░░░░█       Skills: JS, PHP, GDScript',
          '     █░░░░░░░░░░░░░░█        Theme: Cyberpunk [Dark]',
          '      ▀▄░░░░░░░░░░▄▀        ',
          '        ▀▀▀▀▀▀▀▀▀▀          ',
        ]);
        break;

      case 'sudo':
        if (command.toLowerCase().includes('rm -rf')) {
          addLine('Nice try. 😈', 'error');
          await new Promise(r => setTimeout(r, 500));
          addLine('Permission denied: You do not have root access.', 'error');
        } else {
          addLine(`sudo: command not found`, 'error');
        }
        break;

      default:
        addLine(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() && !isTyping) {
      processCommand(input.trim());
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const getLineColor = (type: OutputLine['type']) => {
    switch (type) {
      case 'command': return 'text-cli-green font-semibold';
      case 'error': return 'text-destructive';
      case 'system': return 'text-cli-amber';
      default: return 'text-cli-green/80';
    }
  };

  return (
    <div
      className="absolute inset-0 bg-cli-bg font-mono text-sm md:text-base p-4 md:p-8 flex flex-col cursor-text scanline overflow-hidden"
      onClick={handleContainerClick}
    >
      {/* ASCII Header */}
      <div className="text-cli-green text-glow-green mb-4 text-[0.5rem] sm:text-[0.65rem] md:text-xs lg:text-sm leading-tight whitespace-pre select-none shrink-0">
        {displayedAscii}
      </div>
      
      {showWelcome && (
        <p className="text-cli-green/70 mb-4 text-xs md:text-sm shrink-0">
          Welcome to my interactive portfolio. Type 'help' for available commands.
        </p>
      )}

      {/* Output */}
      <div ref={outputRef} className="flex-1 overflow-y-auto overflow-x-hidden space-y-0.5 min-h-0">
        {lines.map(line => (
          <p key={line.id} className={`${getLineColor(line.type)} whitespace-pre-wrap break-words leading-relaxed`}>
            {line.content}
          </p>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 mt-2 shrink-0">
        <span className="text-cli-green text-glow-green whitespace-nowrap">user@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-cli-green caret-cli-green font-mono"
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
        <span className="w-2.5 h-5 bg-cli-green animate-blink" />
      </div>
    </div>
  );
};

export default CLITerminal;
