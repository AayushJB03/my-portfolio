export interface UtilityItem {
  key: string
  name: string
  description: string
  url?: string
}

export interface UtilityCategory {
  id: string
  title: string
  description: string
  items: UtilityItem[]
}

export const UTILITIES: UtilityCategory[] = [
  {
    id: "system-os",
    title: "System & OS",
    description: "Core platforms and environments powering my development workflows.",
    items: [
      {
        key: "linux",
        name: "Linux",
        description: "Primary operating system",
        url: "https://www.kernel.org"
      },
      {
        key: "arch-linux",
        name: "Arch Linux",
        description: "Rolling-release Linux distribution",
        url: "https://archlinux.org"
      },
      {
        key: "windows-11",
        name: "Windows 11",
        description: "Secondary/Desktop operating system",
        url: "https://www.microsoft.com/windows"
      }
    ]
  },
  {
    id: "terminal-cli",
    title: "Terminal & CLI",
    description: "Shell environments, version control systems, and command-line utilities.",
    items: [
      {
        key: "warp",
        name: "Warp",
        description: "Custom terminal workflow tools",
        url: "https://www.warp.dev"
      },
      {
        key: "github-cli",
        name: "GitHub CLI",
        description: "Command-line interface for GitHub",
        url: "https://cli.github.com"
      },
      {
        key: "git",
        name: "Git",
        description: "Distributed version control",
        url: "https://git-scm.com"
      },
      {
        key: "bash-powershell",
        name: "Bash & PowerShell",
        description: "Shell automation engines",
        url: "https://github.com/PowerShell/PowerShell"
      },
      {
        key: "windows-terminal",
        name: "Windows Terminal",
        description: "Modern command-line terminal emulator",
        url: "https://github.com/microsoft/terminal"
      }
    ]
  },
  {
    id: "dev-environment",
    title: "Development Environment",
    description: "Editors, databases, container platforms, runtime environments, and hostings.",
    items: [
      {
        key: "vs-code",
        name: "VS Code",
        description: "Core code editor",
        url: "https://code.visualstudio.com"
      },
      {
        key: "cursor",
        name: "Cursor",
        description: "Development workspace tool",
        url: "https://cursor.sh"
      },
      {
        key: "docker",
        name: "Docker & Compose",
        description: "Local container environment",
        url: "https://www.docker.com"
      },
      {
        key: "github-desktop",
        name: "GitHub Desktop",
        description: "Graphical git client",
        url: "https://desktop.github.com"
      },
      {
        key: "vercel-netlify",
        name: "Vercel & Netlify",
        description: "Web deployment and hosting platforms",
        url: "https://vercel.com"
      },
      {
        key: "typescript",
        name: "TypeScript",
        description: "Typed JavaScript superset",
        url: "https://www.typescriptlang.org"
      },
      {
        key: "prettier",
        name: "Prettier",
        description: "Opinionated code formatter",
        url: "https://prettier.io"
      },
      {
        key: "tableplus",
        name: "TablePlus",
        description: "Relational database GUI (Postgres, MySQL, etc.)",
        url: "https://tableplus.com"
      },
      {
        key: "nodejs",
        name: "Node.js",
        description: "JavaScript runtime environment",
        url: "https://nodejs.org"
      },
      {
        key: "supabase",
        name: "Supabase",
        description: "Backend-as-a-service database",
        url: "https://supabase.com"
      },
      {
        key: "postman",
        name: "Postman",
        description: "API development and client testing",
        url: "https://www.postman.com"
      },
      {
        key: "npm",
        name: "npm",
        description: "JavaScript package manager",
        url: "https://www.npmjs.com"
      }
    ]
  },
  {
    id: "ai-stack",
    title: "AI Stack & Agents",
    description: "Intelligent assistants, autonomous agents, and AI-enabled CLI helpers.",
    items: [
      {
        key: "antigravity-code",
        name: "Antigravity Code",
        description: "AI-assisted coding environment",
        url: "https://github.com/google-deepmind/antigravity"
      },
      {
        key: "codex-cli",
        name: "Codex CLI",
        description: "Terminal-based AI code interpreter"
      },
      {
        key: "claude-cli",
        name: "Claude CLI",
        description: "Claude-powered terminal workflow tool",
        url: "https://www.anthropic.com"
      },
      {
        key: "hermes",
        name: "Hermes",
        description: "Autonomous AI chief of staff/agent"
      },
      {
        key: "nemoclaw",
        name: "Nemoclaw",
        description: "Autonomous developer/AI assistant"
      }
    ]
  },
  {
    id: "design-productivity",
    title: "Design & Productivity",
    description: "Design tools, project tracking boards, and document management workspaces.",
    items: [
      {
        key: "figma-canva",
        name: "Figma & Canva",
        description: "Graphics, UI/UX prototyping, mockups",
        url: "https://www.figma.com"
      },
      {
        key: "notion",
        name: "Notion",
        description: "Workspace for documentation and projects",
        url: "https://www.notion.so"
      },
      {
        key: "obsidian",
        name: "Obsidian",
        description: "Local markdown wiki and notes",
        url: "https://obsidian.md"
      },
      {
        key: "linear",
        name: "Linear",
        description: "Project tracking, issues, Kanban board",
        url: "https://linear.app"
      },
      {
        key: "grammarly",
        name: "Grammarly",
        description: "AI writing assistant and grammar checker",
        url: "https://www.grammarly.com"
      }
    ]
  },
  {
    id: "comm-browsers",
    title: "Communication & Browsers",
    description: "Web browsers, chat hubs, and audio/music streaming services.",
    items: [
      {
        key: "browsers",
        name: "Browsers",
        description: "Google Chrome, Arc, Brave (privacy-first)"
      },
      {
        key: "chat",
        name: "Chat",
        description: "Telegram, Zoom, Discord, Slack"
      },
      {
        key: "entertainment-music",
        name: "Entertainment/Music",
        description: "Spotify, Amazon Music"
      }
    ]
  }
]
