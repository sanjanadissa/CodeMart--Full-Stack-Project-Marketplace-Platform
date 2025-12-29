// Dummy data for CodeMart User Dashboard

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  occupation: string;
  companyName: string;
  profilePicture: string;
  isAdmin: boolean;
}

export interface Project {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  projectUrl: string;
  videoUrl: string;
  uploadDate: string;
  imageUrls: string[];
  primaryLanguage: string;
  secondaryLanguages: string[];
  sales?: number;
  revenue?: number;
  status?: 'active' | 'draft' | 'paused';
}

export interface Transaction {
  id: number;
  projectId: number;
  project: Project;
  type: 'purchase';
  amount: number;
  orderDate: string;
  status: 'completed';
  buyer: User;
}

export interface CartItem {
  id: number;
  project: Project;
  addedAt: string;
}

// Current user data
export const currentUser: User = {
  id: 1,
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex.johnson@example.com",
  occupation: "Full Stack Developer",
  companyName: "TechNova Solutions",
  profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  isAdmin: false,
};

// User's selling projects
export const sellingProjects: Project[] = [
  {
    id: 1,
    name: "E-Commerce Dashboard Pro",
    category: "Web Application",
    description: "A comprehensive e-commerce dashboard with analytics, inventory management, and order tracking.",
    price: 149,
    projectUrl: "https://github.com/example/ecommerce-dashboard",
    videoUrl: "https://youtube.com/watch?v=demo1",
    uploadDate: "2024-01-15",
    imageUrls: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"],
    primaryLanguage: "TypeScript",
    secondaryLanguages: ["React", "Node.js", "PostgreSQL"],
    sales: 47,
    revenue: 7003,
    status: 'active',
  },
  {
    id: 2,
    name: "AI Chat Widget",
    category: "Plugin",
    description: "Embeddable AI-powered chat widget with customizable themes and multi-language support.",
    price: 79,
    projectUrl: "https://github.com/example/ai-chat-widget",
    videoUrl: "https://youtube.com/watch?v=demo2",
    uploadDate: "2024-02-20",
    imageUrls: ["https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=300&fit=crop"],
    primaryLanguage: "JavaScript",
    secondaryLanguages: ["Vue.js", "OpenAI API"],
    sales: 23,
    revenue: 1817,
    status: 'active',
  },
  {
    id: 3,
    name: "Mobile App Starter Kit",
    category: "Mobile",
    description: "React Native starter template with authentication, push notifications, and analytics pre-configured.",
    price: 199,
    projectUrl: "https://github.com/example/mobile-starter",
    videoUrl: "https://youtube.com/watch?v=demo3",
    uploadDate: "2024-03-10",
    imageUrls: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop"],
    primaryLanguage: "TypeScript",
    secondaryLanguages: ["React Native", "Firebase"],
    sales: 12,
    revenue: 2388,
    status: 'draft',
  },
];

// User's bought projects
export const boughtProjects: Project[] = [
  {
    id: 101,
    name: "Admin Panel Template",
    category: "Web Application",
    description: "Modern admin panel with dark mode, charts, and user management.",
    price: 89,
    projectUrl: "https://github.com/seller/admin-panel",
    videoUrl: "https://youtube.com/watch?v=demo4",
    uploadDate: "2023-11-05",
    imageUrls: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"],
    primaryLanguage: "TypeScript",
    secondaryLanguages: ["Next.js", "Tailwind CSS"],
  },
  {
    id: 102,
    name: "Payment Gateway Integration",
    category: "Backend",
    description: "Complete Stripe and PayPal integration with webhook handling.",
    price: 59,
    projectUrl: "https://github.com/seller/payment-gateway",
    videoUrl: "https://youtube.com/watch?v=demo5",
    uploadDate: "2023-12-18",
    imageUrls: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"],
    primaryLanguage: "Node.js",
    secondaryLanguages: ["Express", "Stripe API"],
  },
];

// User's wishlist
export const wishlistProjects: Project[] = [
  {
    id: 201,
    name: "Real-time Collaboration Tool",
    category: "SaaS",
    description: "Figma-like collaboration features with real-time cursors and editing.",
    price: 299,
    projectUrl: "https://github.com/seller/collab-tool",
    videoUrl: "https://youtube.com/watch?v=demo6",
    uploadDate: "2024-01-25",
    imageUrls: ["https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"],
    primaryLanguage: "TypeScript",
    secondaryLanguages: ["React", "Socket.io", "Y.js"],
  },
  {
    id: 202,
    name: "Video Editor SDK",
    category: "Library",
    description: "Browser-based video editing SDK with timeline, effects, and export.",
    price: 449,
    projectUrl: "https://github.com/seller/video-sdk",
    videoUrl: "https://youtube.com/watch?v=demo7",
    uploadDate: "2024-02-01",
    imageUrls: ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop"],
    primaryLanguage: "TypeScript",
    secondaryLanguages: ["WebCodecs", "Canvas API"],
  },
  {
    id: 203,
    name: "Authentication Boilerplate",
    category: "Backend",
    description: "Complete auth system with OAuth, 2FA, and session management.",
    price: 129,
    projectUrl: "https://github.com/seller/auth-boilerplate",
    videoUrl: "https://youtube.com/watch?v=demo8",
    uploadDate: "2024-02-15",
    imageUrls: ["https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop"],
    primaryLanguage: "Python",
    secondaryLanguages: ["FastAPI", "JWT", "Redis"],
  },
];

// User's cart items
export const cartItems: CartItem[] = [
  {
    id: 1,
    project: {
      id: 301,
      name: "CRM System Pro",
      category: "Web Application",
      description: "Full-featured CRM with lead tracking, email automation, and reporting.",
      price: 349,
      projectUrl: "https://github.com/seller/crm-pro",
      videoUrl: "https://youtube.com/watch?v=demo9",
      uploadDate: "2024-03-01",
      imageUrls: ["https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop"],
      primaryLanguage: "TypeScript",
      secondaryLanguages: ["React", "Node.js", "MongoDB"],
    },
    addedAt: "2024-03-15",
  },
  {
    id: 2,
    project: {
      id: 302,
      name: "Invoice Generator",
      category: "Tool",
      description: "Professional invoice generation with PDF export and client management.",
      price: 79,
      projectUrl: "https://github.com/seller/invoice-gen",
      videoUrl: "https://youtube.com/watch?v=demo10",
      uploadDate: "2024-02-28",
      imageUrls: ["https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop"],
      primaryLanguage: "JavaScript",
      secondaryLanguages: ["Vue.js", "PDF-lib"],
    },
    addedAt: "2024-03-18",
  },
];

// User's transactions
export const transactions: Transaction[] = [
  {
    id: 1,
    projectId: 1,
    projectName: "E-Commerce Dashboard Pro",
    type: 'sale',
    amount: 149,
    date: "2024-03-20",
    status: 'completed',
    buyerName: "Sarah M.",
  },
  {
    id: 2,
    projectId: 101,
    projectName: "Admin Panel Template",
    type: 'purchase',
    amount: 89,
    date: "2024-03-18",
    status: 'completed',
  },
  {
    id: 3,
    projectId: 2,
    projectName: "AI Chat Widget",
    type: 'sale',
    amount: 79,
    date: "2024-03-17",
    status: 'completed',
    buyerName: "Michael K.",
  },
  {
    id: 4,
    projectId: 1,
    projectName: "E-Commerce Dashboard Pro",
    type: 'sale',
    amount: 149,
    date: "2024-03-15",
    status: 'completed',
    buyerName: "David L.",
  },
  {
    id: 5,
    projectId: 2,
    projectName: "AI Chat Widget",
    type: 'sale',
    amount: 79,
    date: "2024-03-14",
    status: 'pending',
    buyerName: "Emma W.",
  },
  {
    id: 6,
    projectId: 102,
    projectName: "Payment Gateway Integration",
    type: 'purchase',
    amount: 59,
    date: "2024-03-10",
    status: 'completed',
  },
  {
    id: 7,
    projectId: 1,
    projectName: "E-Commerce Dashboard Pro",
    type: 'sale',
    amount: 149,
    date: "2024-03-08",
    status: 'refunded',
    buyerName: "John P.",
  },
];

// Calculate totals
export const dashboardStats = {
  totalRevenue: sellingProjects.reduce((sum, p) => sum + (p.revenue || 0), 0),
  totalSales: sellingProjects.reduce((sum, p) => sum + (p.sales || 0), 0),
  activeProjects: sellingProjects.filter(p => p.status === 'active').length,
  wishlistCount: wishlistProjects.length,
  cartTotal: cartItems.reduce((sum, item) => sum + item.project.price, 0),
  purchasedCount: boughtProjects.length,
};
