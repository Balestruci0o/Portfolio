document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo({ top: 0});
    const cliContainer = document.getElementById('cli-container');
    const cliOutput = document.getElementById('cli-output');
    const cliInput = document.getElementById('cli-input');
    const cliInputContainer = document.getElementById('cli-input-container');
    
    const guiContainer = document.getElementById('gui-container');
    const terminalToggle = document.getElementById('terminal-toggle');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
    let commandHistory = [];
    let historyIndex = -1;
    
    const SYSTEM_FILES = ['about.txt', 'projects.txt', 'contact.txt'];

    function initFileStorage() {
        if (!localStorage.getItem('terminal_files')) {
            const defaultFiles = {
                'about.txt': "I'm a full-stack developer with expertise in both low-level systems\nand modern UI/UX design. My journey began with command-line interfaces\nand has evolved to creating beautiful, interactive experiences.",
                'projects.txt': "1. CLI Framework - Modular framework for command-line apps\n2. UI Component Library - Animated, accessible components\n3. Logic Simulator - Educational tool built with Godot",
                'contact.txt': "Email: contact@example.com\nGitHub: github.com/username\nLinkedIn: linkedin.com/in/username"
            };
            localStorage.setItem('terminal_files', JSON.stringify(defaultFiles));
        }
    }
    
    initFileStorage();
    
    function getFiles() {
        return JSON.parse(localStorage.getItem('terminal_files'));
    }
    
    function saveFiles(files) {
        localStorage.setItem('terminal_files', JSON.stringify(files));
    }
    
    function fileExists(filename) {
        return filename in getFiles();
    }
    
    function isSystemFile(filename) {
        return SYSTEM_FILES.includes(filename);
    }
    
    const easterEggs = {
        'memfail': () => {
            simulateMemoryCorruption();
        },
        'sudo rm -rf /': () => {
            window.location.replace("page-not-found.html");
        }
    };
    
    const commands = {
        'help': {
            description: 'Show available commands',
            execute: () => {
                typeOutput("Available commands:");
                typeOutput("  help       - Show this help message");
                typeOutput("  ls         - List directory contents");
                typeOutput("  cat [file] - Show file contents");
                typeOutput("  clear      - Clear the terminal");
                typeOutput("  launch gui - Launch graphical interface");
                typeOutput("  touch [file] - Create a new file");
                typeOutput("  rm [file]    - Remove a file");
                typeOutput("  edit [file]  - Edit a file");
            }
        },
        'ls': {
            description: 'List directory contents',
            execute: () => {
                const files = getFiles();
                const fileList = Object.keys(files).join('    ');
                typeOutput(fileList);
            }
        },
        'cat': {
            description: 'Show file contents',
            execute: (args) => {
                if (args.length < 1) {
                    typeOutput("Usage: cat [filename]");
                    return;
                }
                
                const filename = args[0];
                const files = getFiles();
                
                if (fileExists(filename)) {
                    typeOutput(files[filename]);
                } else {
                    typeOutput(`cat: ${filename}: No such file or directory`);
                }
            }
        },
        'clear': {
            description: 'Clear the terminal',
            execute: () => {
                cliOutput.innerHTML = '';
            }
        },
        'launch': {
            description: 'Launch graphical interface',
            execute: (args) => {
                if (args.length > 0 && args[0] === 'gui') {
                    typeOutput("Initializing graphical interface...");
                    setTimeout(() => {
                        launchGUI();
                    }, 1000);
                } else {
                    typeOutput("Usage: launch gui");
                }
            }
        },
        'touch': {
            description: 'Create a new file',
            execute: (args) => {
                if (args.length < 1) {
                    typeOutput("Usage: touch [filename]");
                    return;
                }
                
                const filename = args[0];
                const files = getFiles();
                
                if (fileExists(filename)) {
                    typeOutput(`File '${filename}' already exists`);
                } else {
                    files[filename] = "";
                    saveFiles(files);
                    typeOutput(`Created empty file '${filename}'`);
                }
            }
        },
        'rm': {
            description: 'Remove a file',
            execute: (args) => {
                if (args.length < 1) {
                    typeOutput("Usage: rm [filename]");
                    return;
                }
                
                const filename = args[0];
                const files = getFiles();
                
                if (!fileExists(filename)) {
                    typeOutput(`rm: cannot remove '${filename}': No such file`);
                } else if (isSystemFile(filename)) {
                    typeOutput(`rm: cannot remove '${filename}': System files are protected`);
                } else {
                    delete files[filename];
                    saveFiles(files);
                    typeOutput(`Removed file '${filename}'`);
                }
            }
        },
        'edit': {
            description: 'Edit a file',
            execute: (args) => {
                if (args.length < 1) {
                    typeOutput("Usage: edit [filename]");
                    return;
                }
                
                const filename = args[0];
                const files = getFiles();
                
                if (!fileExists(filename)) {
                    typeOutput(`edit: cannot edit '${filename}': No such file`);
                } else if (isSystemFile(filename)) {
                    typeOutput(`edit: cannot edit '${filename}': System files are protected`);
                } else {
                    typeOutput(`Editing '${filename}'. Type your content and press Enter. Type 'EOF' on a new line to save.`);
                    typeOutput("Current content:");
                    typeOutput(files[filename]);
                    
                    const originalProcessCommand = window.processCommand;
                    
                    window.processCommand = function(content) {
                        if (content === 'EOF') {
                            files[filename] = editingContent.join('\n');
                            saveFiles(files);
                            typeOutput(`File '${filename}' saved`);
                            
                            window.processCommand = originalProcessCommand;
                            return;
                        }
                        
                        editingContent.push(content);
                    };
                    
                    const editingContent = [];
                }
            }
        }
    };
    
    function typeOutput(text, callback) {
        const lines = text.split('\n');
        let currentLine = 0;
        
        function typeLine() {
            if (currentLine >= lines.length) {
                if (callback) callback();
                return;
            }
            
            const line = lines[currentLine];
            if (line.trim() === '') {
                const p = document.createElement('p');
                cliOutput.appendChild(p);
                currentLine++;
                setTimeout(typeLine, 50);
                return;
            }
            
            const p = document.createElement('p');
            cliOutput.appendChild(p);
            
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < line.length) {
                    p.textContent += line.charAt(i);
                    i++;
                    cliOutput.scrollTop = cliOutput.scrollHeight;
                } else {
                    clearInterval(typingInterval);
                    currentLine++;
                    setTimeout(typeLine, 100);
                }
            }, 20);
        }
        
        typeLine();
    }
    
    window.processCommand = function(command) {
        commandHistory.push(command);
        historyIndex = commandHistory.length;
        
        const p = document.createElement('p');
        p.innerHTML = `<span style="color:#0f0">user@portfolio:~$</span> ${command}`;
        cliOutput.appendChild(p);
        
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        const lowerCommand = command.toLowerCase();
        if (easterEggs[lowerCommand]) {
            easterEggs[lowerCommand]();
            return;
        }
        
        if (commands[cmd]) {
            commands[cmd].execute(args);
        } else {
            typeOutput(`Command not found: ${cmd}. Type 'help' for available commands.`);
        }
        
        cliOutput.scrollTop = cliOutput.scrollHeight;
    };
    
    function launchGUI() {
        cliContainer.classList.add('glitch');
        
        setTimeout(() => {
            cliContainer.style.opacity = '0';
            cliContainer.style.transform = 'scale(0.9)';
            
            guiContainer.classList.add('gui-active');
            
            sections.forEach((section, index) => {
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 200 * index);
            });
            
            setTimeout(() => {
                cliContainer.classList.remove('glitch');
                document.body.style.overflow = "auto";
                document.body.style.height = "100%";
            }, 1000);
        }, 800);
    }
    
    function toggleCLI() {
        if (cliContainer.style.opacity === '0') {
            document.body.style.height = "100vh";
            cliContainer.style.opacity = '1';
            cliContainer.style.transform = 'scale(1)';
            guiContainer.classList.remove('gui-active');
            setTimeout(() => {
                window.scrollTo({ top: 0});
                cliInput.focus();
            }, 1100);
            document.body.style.overflow = "hidden";

        } else {
            document.body.style.height = "100%";
            document.body.style.overflow = "auto";
            cliContainer.style.opacity = '0';
            cliContainer.style.transform = 'scale(0.9)';
            guiContainer.classList.add('gui-active');
        }
    }
    
    function toggleAccessibilityMode() {
        document.body.classList.toggle('accessibility-mode');
    }
    
    cliInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim();
            if (command) {
                processCommand(command);
            }
            this.value = '';
        } else if (e.key === 'ArrowUp') {
            if (commandHistory.length > 0 && historyIndex > 0) {
                historyIndex--;
                this.value = commandHistory[historyIndex];
                e.preventDefault();
            }
        } else if (e.key === 'ArrowDown') {
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.value = commandHistory[historyIndex];
                e.preventDefault();
            } else if (historyIndex === commandHistory.length - 1) {
                historyIndex++;
                this.value = '';
                e.preventDefault();
            }
        } else if (e.ctrlKey && e.key === '~') {
            toggleCLI();
            e.preventDefault();
        }
    });

    cliInputContainer.addEventListener('submit', function(e) {
        e.preventDefault();
        const command = cliInput.value.trim();
        if (command) {
            processCommand(command);
        }
        cliInput.value = '';
    });
    
    terminalToggle.addEventListener('click', toggleCLI);
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            document.getElementById(`${section}-section`).scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
    
    setTimeout(() => {
        typeOutput("System ready. Type 'help' for available commands.");
    }, 1000);
    
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'a') {
            toggleAccessibilityMode();
        }
    });

    function simulateMemoryCorruption() {
        const segments = ["0x0000", "0x1000", "0x2000"];
        const errors = [
            "Segmentation fault (core dumped)",
            "Page fault at address: " + segments[Math.floor(Math.random() * 3)],
            "Memory parity error at " + segments[Math.floor(Math.random() * 3)]
        ];

        typeOutput("WARNING: Memory controller reporting ECC errors");
        setTimeout(() => document.body.classList.add("lag-effect"), 1400);

        setTimeout(() => typeOutput(errors[0]), 2400);
        setTimeout(() => typeOutput("Kernel panic - not syncing: " + errors[1]), 3400);
        setTimeout(() => typeOutput("System halted."), 7000);

        setTimeout(() => {
            document.body.classList.remove("lag-effect");
        }, 6000);
    }
});
