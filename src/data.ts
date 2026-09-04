import { ServiceItem, PricingPlan, ProcessStep, ProjectStatus } from './types';

export const BRAND_INFO = {
  name: 'NEXORA',
  tagline: 'Build. Innovate. Grow.',
  instagram: '@aabidd_26',
  instagramUrl: 'https://instagram.com/aabidd_26',
  businessType: 'Website, mobile app and digital solution development.',
  whatsapp: '9709429070',
  phone: '9709429070',
  email: 'shahidimc786@gmail.com',
  whatsappDefaultMessage: 'Hello Nexora, I want to order a website/app.',
  getWhatsAppChatUrl: (customMessage?: string) => {
    const text = customMessage || 'Hello Nexora, I want to order a website/app.';
    return `https://wa.me/919709429070?text=${encodeURIComponent(text)}`;
  },
  getEmailMailtoUrl: (subject?: string, body?: string) => {
    const sub = encodeURIComponent(subject || 'Inquiry - Nexora Digital Development');
    const b = encodeURIComponent(body || 'Hello Nexora team,\n\nI want to order a website/app for my business.');
    return `mailto:shahidimc786@gmail.com?subject=${sub}&body=${b}`;
  }
};

export const PROJECT_STATUS_STEPS: {
  key: ProjectStatus;
  stepNumber: number;
  label: string;
  shortDesc: string;
  color: string;
}[] = [
  {
    key: 'received',
    stepNumber: 1,
    label: 'Order Received',
    shortDesc: 'Order details and requirements safely logged in Nexora system.',
    color: 'cyan'
  },
  {
    key: 'payment_verified',
    stepNumber: 2,
    label: 'Payment Verified',
    shortDesc: 'Project payment confirmed and reserved for sprint planning.',
    color: 'sky'
  },
  {
    key: 'requirement_review',
    stepNumber: 3,
    label: 'Requirement Review',
    shortDesc: 'Architecture, wireframes, pages and visual concept finalized.',
    color: 'blue'
  },
  {
    key: 'development',
    stepNumber: 4,
    label: 'Development',
    shortDesc: 'Active coding and crafting of custom responsive frontend & backend.',
    color: 'purple'
  },
  {
    key: 'testing',
    stepNumber: 5,
    label: 'Testing',
    shortDesc: 'Cross-device responsiveness, speed, forms & bug testing.',
    color: 'indigo'
  },
  {
    key: 'ready_for_delivery',
    stepNumber: 6,
    label: 'Ready for Delivery',
    shortDesc: 'Staging preview ready for customer review and approval.',
    color: 'amber'
  },
  {
    key: 'completed',
    stepNumber: 7,
    label: 'Completed',
    shortDesc: 'Live deployment or source handover complete with full guidance.',
    color: 'emerald'
  }
];

export const ORDER_PROJECT_TYPES = [
  {
    id: 'website',
    title: 'Website Development',
    startingPrice: 1499,
    formattedPrice: '₹1,499+',
    description: 'Modern, high-converting responsive websites for brands & businesses',
    icon: 'Globe'
  },
  {
    id: 'mobile_app',
    title: 'Mobile App Development',
    startingPrice: 4999,
    formattedPrice: '₹4,999+',
    description: 'Custom Android application with intuitive modern mobile UX',
    icon: 'Smartphone'
  },
  {
    id: 'combo',
    title: 'Website + App Combo',
    startingPrice: 5999,
    formattedPrice: '₹5,999+',
    description: 'Complete digital presence: synchronized website & Android app',
    icon: 'Layers'
  },
  {
    id: 'branding',
    title: 'Logo & Branding',
    startingPrice: 499,
    formattedPrice: '₹499+',
    description: 'Distinctive vector logo design and full brand visual identity kit',
    icon: 'Palette'
  }
];

export const POPULAR_FEATURES_LIST = [
  'Mobile & Desktop Responsive UI',
  'WhatsApp Live Chat Integration',
  'Contact / Lead Capture Form',
  'Admin Dashboard / Management',
  'Payment Gateway Integration',
  'User Authentication / Login',
  'Search Engine Optimization (SEO)',
  'Fast Loading & Performance Tuning',
  'Dark / Light Mode Theme',
  'Google Maps / Location Embed',
  'Social Media Integration',
  'Custom Animations & Transitions'
];

export const DELIVERY_INFO_CARDS = [
  {
    id: 'website-delivery',
    title: 'Website Delivery',
    subtitle: 'Live Deployment or Clean Source',
    description: 'Your completed website can be deployed directly to your custom live domain, or provided as clean, fully documented source code ready for your own host.',
    iconName: 'Globe2',
    bullets: ['Free setup on live staging/production', 'Clean, modern, lightweight code', 'Complete ownership of your digital assets']
  },
  {
    id: 'app-delivery',
    title: 'App Delivery',
    subtitle: 'Android APK + Full Code',
    description: 'We deliver a production-ready signed Android APK for instant installation and testing on your Android devices, plus full source code on request.',
    iconName: 'Smartphone',
    bullets: ['Signed release APK file', 'Device testing across Android screen sizes', 'Play Store submission guidance']
  },
  {
    id: 'review-revisions',
    title: 'Review & Revision Guarantee',
    subtitle: 'Zero Compromise on Quality',
    description: 'Every project includes a dedicated review period. You review the staging site or APK build, request refinements, and we adjust it until it meets your expectations.',
    iconName: 'CheckCheck',
    bullets: ['Structured review stage', 'Quick adjustments & feedback turnaround', '100% satisfaction focus before final sign-off']
  },
  {
    id: 'support-handover',
    title: 'Handover & Post-Delivery Support',
    subtitle: 'We Stay By Your Side',
    description: 'Nexora provides clear walkthroughs, video/text setup instructions, and direct WhatsApp support so you never feel stranded with your new digital product.',
    iconName: 'Headphones',
    bullets: ['Step-by-step handover guidance', 'Ongoing maintenance packages available', 'Direct developer assistance on WhatsApp']
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'website-development',
    title: 'Website Development',
    description: 'Modern, responsive and professional websites for businesses, creators and personal brands.',
    startingPrice: '₹1,499',
    iconName: 'Globe',
    badge: 'Popular',
    features: [
      'High-converting landing pages & business portfolios',
      'Flawless responsive layouts for mobile & desktop',
      'Ultra-fast loading speed & search engine readiness',
      'Custom modern UI with interactive elements'
    ]
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    description: 'Simple and useful Android applications built around your idea.',
    startingPrice: '₹4,999',
    iconName: 'Smartphone',
    badge: 'High Impact',
    features: [
      'Clean native & cross-platform Android architecture',
      'User-friendly modern design tailored to your vision',
      'Offline-friendly workflows and local data storage',
      'Testing, APK generation & deployment guidance'
    ]
  },
  {
    id: 'logo-branding',
    title: 'Logo & Branding',
    description: 'Clean and memorable visual identity for your brand.',
    startingPrice: '₹499',
    iconName: 'Palette',
    badge: 'Essential',
    features: [
      'Minimalist, iconic and modern vector logo designs',
      'Curated typography, color palettes & brand guidelines',
      'Social media profile kits & export-ready high-res assets',
      'Revisions until your visual identity feels just right'
    ]
  },
  {
    id: 'website-maintenance',
    title: 'Website Maintenance',
    description: 'Keep your website updated, secure and running smoothly.',
    startingPrice: '₹499',
    priceSuffix: '/month',
    iconName: 'ShieldCheck',
    badge: 'Reliability',
    features: [
      'Regular security checks & framework dependency updates',
      'Quick bug fixes, text adjustments & layout updates',
      'Speed optimization & uptime monitoring support',
      'Direct developer assistance whenever you need updates'
    ]
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'STARTER',
    price: '₹1,499+',
    description: 'Ideal for individuals, personal portfolios, and single-page launch sites.',
    popular: false,
    features: [
      '1-page website',
      'Responsive design',
      'Modern UI',
      'Basic contact section'
    ]
  },
  {
    id: 'business',
    name: 'BUSINESS',
    price: '₹2,999+',
    description: 'Perfect for small businesses, services, and creators needing multi-page presence.',
    popular: true,
    features: [
      'Up to 5 pages',
      'Responsive design',
      'Professional UI',
      'Contact/WhatsApp integration',
      'Basic SEO setup'
    ]
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: '₹4,999+',
    description: 'Tailored for advanced digital solutions, custom workflows, and high impact.',
    popular: false,
    features: [
      'Advanced website',
      'Custom sections',
      'Animations',
      'Forms/integrations',
      'Priority support'
    ]
  }
];

export const ABOUT_POINTS = [
  {
    title: 'Modern Design',
    description: 'Aesthetic, contemporary UI/UX engineered with precision, high-contrast readability, and sleek dark-tech elegance.'
  },
  {
    title: 'Responsive Experience',
    description: 'Every layout is tested across smartphones, tablets, laptops, and wide monitors for smooth responsiveness.'
  },
  {
    title: 'Clean Development',
    description: 'Written using modern lightweight web technologies with modular code, clean architecture, and rapid loading times.'
  },
  {
    title: 'Support After Delivery',
    description: 'We do not vanish after handover. You get direct support, guidance, and assistance for revisions and maintenance.'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Tell Us Your Idea',
    description: 'Reach out via our inquiry form or direct WhatsApp message. Share your business goals, target audience, and preferred style.',
    iconName: 'MessageSquareText'
  },
  {
    step: '02',
    title: 'Plan & Design',
    description: 'We structure the wireframe, visual direction, and feature breakdown to ensure the end product matches your vision.',
    iconName: 'LayoutGrid'
  },
  {
    step: '03',
    title: 'Build & Test',
    description: 'We develop your website or app with clean modern code, responsive layouts, fast performance, and thorough testing.',
    iconName: 'Code2'
  },
  {
    step: '04',
    title: 'Launch',
    description: 'We deploy your digital project to your live domain or deliver the ready-to-use assets, backed by post-delivery support.',
    iconName: 'Rocket'
  }
];
