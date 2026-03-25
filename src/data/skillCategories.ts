import { SkillCategory } from '@/components/ui/skills-accordion';
import { 
  FaPython, 
  FaReact, 
  FaDatabase,
  FaEye,
  FaCode
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiTailwindcss, 
  SiNextdotjs,
  SiMysql,
  SiTensorflow,
  SiOpencv
} from 'react-icons/si';

export const skillCategories: SkillCategory[] = [
  {
    id: 'ai-engineering',
    title: 'AI Engineering',
    description: 'Building with AI systems and automation workflows',
    image: '/media/skill/ai.png',
    iconColor: 'from-emerald-400 to-cyan-400',
    gradient: 'from-emerald-600/80 to-teal-600/80',
    techIcons: [
      { name: 'ChatGPT', image: '/media/icontools/chatgpt.png' },
      { name: 'Claude', image: '/media/icontools/claude.png' },
      { name: 'Gemini', image: '/media/icontools/gemini.png' },
      { name: 'Python', icon: FaPython, color: 'text-blue-400' },
    ],
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Computer vision and deep learning solutions',
    image: '/media/skill/ml.png',
    iconColor: 'from-blue-400 to-cyan-400',
    gradient: 'from-blue-600/80 to-cyan-600/80',
    techIcons: [
      { name: 'Python', icon: FaPython, color: 'text-blue-400' },
      { name: 'OpenCV', icon: SiOpencv, color: 'text-cyan-400' },
      { name: 'TensorFlow', icon: SiTensorflow, color: 'text-orange-400' },
      { name: 'Computer Vision', icon: FaEye, color: 'text-purple-400' },
    ],
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Modern frontend with React and Next.js',
    image: '/media/skill/web.png',
    iconColor: 'from-purple-400 to-pink-400',
    gradient: 'from-purple-600/80 to-pink-600/80',
    techIcons: [
      { name: 'React', icon: FaReact, color: 'text-cyan-400' },
      { name: 'Next.js', icon: SiNextdotjs, color: 'text-white' },
      { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-400' },
      { name: 'Tailwind', icon: SiTailwindcss, color: 'text-teal-400' },
    ],
  },
  {
    id: 'data-systems',
    title: 'Data & Systems',
    description: 'Database design and backend architecture',
    image: '/media/skill/data.png',
    iconColor: 'from-orange-400 to-amber-400',
    gradient: 'from-orange-600/80 to-red-600/80',
    techIcons: [
      { name: 'MySQL', icon: SiMysql, color: 'text-blue-400' },
      { name: 'Database', icon: FaDatabase, color: 'text-orange-400' },
      { name: 'Python', icon: FaPython, color: 'text-blue-400' },
      { name: 'Backend', icon: FaCode, color: 'text-amber-400' },
    ],
  },
];
