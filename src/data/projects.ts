export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'ai' | 'web' | 'uiux';
  tech: string[];
  image?: string;
  video?: string;
  gallery?: string[];
  figma?: string;
  github?: string;
  overview?: string;
  problem?: string;
  keyFeatures?: string[];
  results?: string[];
}

export const projectsData: Project[] = [
  {
    id: 'cv-object-detection',
    title: 'Computer Vision Object Detection and Area Estimation',
    description: 'Production-grade Mask R-CNN system for automated building detection and area estimation from drone imagery with 82% mAP and sub-5% area prediction error.',
    category: 'ai',
    tech: ['Python', 'Mask R-CNN', 'ResNet-50 FPN', 'COCO Format', 'Roboflow', 'OpenCV', 'Computer Vision'],
    video: 'https://9ux2eygn6gyic5xn.public.blob.vercel-storage.com/mask.mp4',
    gallery: [
      '/media/fotohasildeteksi/deteksifk.jpg',
      '/media/fotohasildeteksi/deteksifkip.jpg',
      '/media/fotohasildeteksi/deteksifmipa.jpg'
    ],
    image: '/media/fotohasildeteksi/deteksifk.jpg',
    github: 'https://github.com/muhammadbayutiar/cv-mask-rcnn',
    overview: 'Implemented Mask R-CNN with ResNet-50 FPN backbone for automated building detection and precise area estimation from drone imagery. The system performs instance segmentation at pixel-level accuracy and converts segmentation masks to real-world area measurements using calibrated scale factors.',
    problem: 'Manual building measurement and campus mapping is time-consuming and error-prone. Traditional methods require physical surveys and lack scalability for large-area analysis, making spatial planning and infrastructure management inefficient.',
    keyFeatures: [
      'Instance segmentation with Mask R-CNN (ResNet-50 FPN backbone)',
      'COCO-format dataset pipeline with polygon annotations',
      'Automated pixel-to-meter conversion using weighted median scale factors',
      'Multi-threshold evaluation (AP50, AP75, mAP) for robust performance assessment',
      'Real-time visualization with bounding boxes and segmentation masks'
    ],
    results: [
      'Achieved 82.03% mAP with 88.12% mean IoU, enabling precise building boundary detection',
      'AP50 of 94.52% demonstrates robust object detection across varied building sizes',
      'Area estimation accuracy: 4.21% MAPE and 3.58% WAPE with 8.06m² average error',
      'Consistent performance: validation (81.74% mAP) vs testing (82.03% mAP) shows stable generalization',
      'Automated measurement of 17,121m² total area with <1% cumulative error'
    ]
  },
  {
    id: 'logistics-website',
    title: 'Logistics Website System',
    description: 'Full-stack logistics management system with responsive landing page and database integration.',
    category: 'web',
    tech: ['React', 'Next.js', 'Tailwind', 'MySQL', 'Java'],
    video: 'https://9ux2eygn6gyic5xn.public.blob.vercel-storage.com/demo-landing-page-web-logistik.mp4',
    image: '/media/fotologistik/logistik.png',
    github: 'https://github.com/muhammadbayutiar/logistics-web',
    overview: 'Complete logistics web application.',
    problem: 'Need efficient logistics tracking system.',
    keyFeatures: [
      'Responsive design',
      'Database integration',
      'Landing page demo'
    ],
    results: [
      'Production-ready web system',
      'Smooth user experience'
    ]
  },
  {
    id: 'holynic-app',
    title: 'Holynic Mobile App',
    description: 'Modern mobile app UI/UX prototype designed in Figma.',
    category: 'uiux',
    tech: ['Figma', 'UI/UX Design'],
    image: '/media/project/Holynic.png',
    figma: 'https://embed.figma.com/design/fEd2Hg81W1wBMA6q3gm9En/Holynic-App-Mobile?node-id=0-1&embed-host=share',
    overview: 'Holynic mobile application prototype.',
    problem: 'Need engaging mobile UX.',
    keyFeatures: [
      'Modern mobile design',
      'Interactive prototype'
    ]
  },
  {
    id: 'eopro-event',
    title: 'EOPro Event Management System',
    description: 'Event management dashboard UI/UX prototype.',
    category: 'uiux',
    tech: ['Figma', 'UI/UX Design'],
    image: '/media/project/EOPro.png',
    figma: 'https://embed.figma.com/design/yPLUNgtX6Z8ZzVRyutBl0M/EOPRO---Event-Management-System?node-id=5-1133&embed-host=share',
    overview: 'Event management system design.',
    problem: 'Complex event planning UX.',
    keyFeatures: [
      'Dashboard design',
      'Interactive prototype'
    ]
  },
  {
    id: 'drakor-streaming',
    title: 'Drakor Streaming Website',
    description: 'Streaming platform website UI/UX prototype.',
    category: 'uiux',
    tech: ['Figma', 'UI/UX Design'],
    image: '/media/project/Drakor.png',
    figma: 'https://embed.figma.com/design/52QfZFTJgoz4NO1oZNdTz8/FilOn---Web-Film-Online?node-id=5-1133&embed-host=share',
    overview: 'Film streaming website design.',
    problem: 'Engaging streaming UI.',
    keyFeatures: [
      'Streaming layout',
      'Interactive prototype'
    ]
  }
];
