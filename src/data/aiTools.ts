export interface AITool {
  name: string;
  logo: string;
  description: string;
}

export const aiToolsData: AITool[] = [
  {
    name: 'Claude AI',
    logo: '/media/icontools/claude.png',
    description: 'AI model for complex reasoning, structured prompting, and long-context analysis.'
  },
  {
    name: 'Gemini',
    logo: '/media/icontools/gemini.png',
    description: 'Multimodal AI model used for code assistance, research, and data analysis.'
  },
  {
    name: 'ChatGPT',
    logo: '/media/icontools/chatgpt.png',
    description: 'AI assistant for coding, debugging, architecture planning, and documentation.'
  },
  {
    name: 'Blackbox AI',
    logo: '/media/icontools/blackbox.png',
    description: 'AI code search and autocomplete tool for rapid software development.'
  },
  {
    name: 'Cursor',
    logo: '/media/icontools/cursor.png',
    description: 'AI-first code editor with integrated LLM assistance for faster development.'
  },
  {
    name: 'Vercel',
    logo: '/media/icontools/vercel.png',
    description: 'Platform for deploying, hosting, and scaling modern web applications.'
  },
  {
    name: 'GitHub',
    logo: '/media/icontools/github.png',
    description: 'Version control platform for collaborative development and CI workflows.'
  },
  {
    name: 'Supabase',
    logo: '/media/icontools/supabase.png',
    description: 'Open source backend providing database, authentication, and APIs.'
  },
  {
    name: 'OpenClaw',
    logo: '/media/icontools/openclaw.png',
    description: 'Interface for experimenting with AI agents and autonomous workflows.'
  }
];

