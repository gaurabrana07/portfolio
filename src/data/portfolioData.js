// Personal Information
export const personalInfo = {
  name: "Gaurab Rana",
  title: "Full-Stack Developer • Systems Engineer • AI Enthusiast",
  tagline: "I don't build projects. I build universes.",
  subTagline: "Each universe solves a different problem.",
  email: "ranagaurav892@gmail.com",
  phone: "+91 7895319203",
  location: "Dehradun, India",
  resumeLink: "https://drive.google.com/file/d/1hk4YFtr_PlSXt6819rjjNtfAKACzCuu3/view?usp=drivesdk",
  profilePhoto: "/profile.jpg",
  availableForWork: true,
  education: {
    degree: "B.Tech in Computer Science Engineering",
    institution: "Graphic Era Hill University",
    location: "Dehradun",
    year: "2022 - 2026",
    cgpa: "8.09",
  },
  social: {
    github: "https://github.com/gaurabrana07",
    linkedin: "https://www.linkedin.com/in/gaurab-rana-3569242b8",
    leetcode: "https://leetcode.com/gaurabrana07",
    twitter: "", // Add your Twitter handle
    instagram: "", // Add your Instagram link
  },
  about: {
    intro: "In one universe, I optimized systems. In another, I trained machines. In this one, I connect ideas into reality.",
    description: "A passionate builder who thrives at the intersection of systems programming and full-stack development. From crafting operating systems to building scalable web platforms, I believe in understanding technology from the ground up.",
    vision: "My mission is to create technology that makes a real impact — elegant solutions that solve complex problems while remaining accessible to everyone.",
  }
};

// Skills Data organized by galaxies
export const skillsData = {
  languages: [
    { name: "C++", level: 95, problems: 125, color: "#00599C" },
    { name: "C", level: 90, problems: 19, color: "#A8B9CC" },
    { name: "JavaScript", level: 88, color: "#F7DF1E" },
    { name: "Python", level: 85, color: "#3776AB" },
    { name: "Java", level: 80, color: "#ED8B00" },
    { name: "Rust", level: 70, color: "#CE422B" },
    { name: "Go", level: 65, color: "#00ADD8" },
    { name: "MySQL", level: 75, problems: 4, color: "#4479A1" },
  ],
  frameworks: [
    { name: "React.js", level: 90, color: "#61DAFB" },
    { name: "Node.js", level: 85, color: "#339933" },
    { name: "Express.js", level: 82, color: "#000000" },
    { name: "TensorFlow", level: 75, color: "#FF6F00" },
    { name: "OpenCV", level: 78, color: "#5C3EE8" },
  ],
  tools: [
    { name: "Git", level: 88, color: "#F05032" },
    { name: "Linux", level: 85, color: "#FCC624" },
    { name: "Docker", level: 70, color: "#2496ED" },
    { name: "QEMU", level: 75, color: "#FF6600" },
    { name: "MongoDB", level: 80, color: "#47A248" },
    { name: "Supabase", level: 78, color: "#3ECF8E" },
  ],
  concepts: [
    { name: "Data Structures", level: 92, color: "#10b981" },
    { name: "Algorithms", level: 90, color: "#06b6d4" },
    { name: "Operating Systems", level: 88, color: "#8b5cf6" },
    { name: "Compiler Design", level: 85, color: "#f59e0b" },
    { name: "Distributed Systems", level: 75, color: "#ef4444" },
    { name: "Machine Learning", level: 78, color: "#ec4899" },
  ]
};

// LeetCode Stats
export const leetcodeStats = {
  totalSolved: 143,
  totalProblems: 3792,
  acceptance: "65.65%",
  ranking: 1011226,
  contestRating: 1387,
  easy: { solved: 70, total: 918 },
  medium: { solved: 63, total: 1978 },
  hard: { solved: 10, total: 896 },
  activeDays: 71,
  maxStreak: 33,
  skills: {
    advanced: ["Dynamic Programming", "Backtracking", "Divide and Conquer"],
    intermediate: ["Math", "Hash Table", "Binary Search"],
    fundamental: ["Array", "Two Pointers", "Sorting"]
  }
};

// Projects Data - Star Systems
export const projectsData = [
  {
    id: 1,
    name: "ARGON OS",
    tagline: "Lightweight Modular x86 Operating System",
    description: "A custom operating system built from scratch, featuring a modular architecture designed for learning and experimentation with low-level systems programming.",
    techStack: ["C", "x86 Assembly", "QEMU", "GCC", "Make"],
    challenges: ["Memory management", "Interrupt handling", "Hardware abstraction"],
    innovation: "Custom bootloader with multi-stage boot process",
    color: "#8b5cf6",
    type: "systems",
    github: "https://github.com/gaurabrana07/argon-os",
    status: "In Development",
  },
  {
    id: 2,
    name: "GRAN Compiler",
    tagline: "Statically Typed Compiled Language",
    description: "A complete compiler implementation with custom IR and LLVM backend, featuring static typing and modern language features.",
    techStack: ["C++", "LLVM", "Custom IR", "Lexer/Parser"],
    challenges: ["Type inference", "Code optimization", "IR generation"],
    innovation: "Custom intermediate representation for optimization",
    color: "#f97316",
    type: "systems",
    github: "https://github.com/gaurabrana07/gran-compiler",
    status: "In Development",
  },
  {
    id: 3,
    name: "Char Dham Tourism Platform",
    tagline: "Smart Tourism Solution for Uttarakhand",
    description: "A comprehensive tourism platform providing information, booking, and travel planning for the sacred Char Dham pilgrimage circuit.",
    techStack: ["React.js", "Node.js", "MongoDB", "Express.js"],
    challenges: ["Real-time availability", "Multi-language support", "Offline access"],
    innovation: "AI-powered travel recommendations based on weather and crowd data",
    color: "#3b82f6",
    type: "fullstack",
    github: "https://github.com/gaurabrana07/char-dham-tourism", // UPDATE: Add actual repo link
    live: "", // UPDATE: Add live demo link when available
    status: "Completed",
  },
  {
    id: 4,
    name: "Face Age & Gender Detector",
    tagline: "Real-time CNN-based Classification",
    description: "Deep learning model for real-time age and gender prediction using convolutional neural networks and computer vision.",
    techStack: ["Python", "TensorFlow", "OpenCV", "CNN", "Keras"],
    challenges: ["Real-time processing", "Model accuracy", "Edge deployment"],
    innovation: "Optimized model for real-time inference on standard hardware",
    color: "#a855f7",
    type: "ai",
    github: "https://github.com/gaurabrana07/age-gender-prediction",
    status: "Completed",
  },
  {
    id: 5,
    name: "Desk AI",
    tagline: "Desktop AI Assistant",
    description: "An intelligent desktop assistant built with Rust, providing AI-powered productivity features and system automation.",
    techStack: ["Rust", "AI/ML", "Desktop APIs"],
    challenges: ["System integration", "Performance optimization", "Cross-platform support"],
    innovation: "Native Rust implementation for maximum performance",
    color: "#CE422B",
    type: "ai",
    github: "https://github.com/gaurabrana07/desk-ai",
    status: "In Development",
  },
  {
    id: 6,
    name: "Insight Engine",
    tagline: "Data Analysis Platform",
    description: "A Python-based data analysis and visualization platform for extracting insights from complex datasets.",
    techStack: ["Python", "Pandas", "NumPy", "Matplotlib"],
    challenges: ["Large dataset handling", "Visualization performance", "User interface"],
    innovation: "Automated insight generation using statistical analysis",
    color: "#10b981",
    type: "ai",
    github: "https://github.com/gaurabrana07/insight-engine",
    status: "In Development",
  },
  {
    id: 7,
    name: "Amazon Clone",
    tagline: "E-commerce Platform",
    description: "A full-featured e-commerce platform replicating core Amazon functionalities with modern web technologies.",
    techStack: ["JavaScript", "React.js", "Node.js", "MongoDB"],
    challenges: ["Cart management", "Payment integration", "Product search"],
    innovation: "Responsive design with optimized performance",
    color: "#f59e0b",
    type: "fullstack",
    github: "https://github.com/gaurabrana07/amazon_clone",
    status: "Completed",
  },
  {
    id: 8,
    name: "Verifi-OneHub",
    tagline: "Verification Platform",
    description: "A unified verification and authentication platform for streamlined identity management.",
    techStack: ["JavaScript", "React.js", "Authentication APIs"],
    challenges: ["Security implementation", "Multi-factor auth", "User experience"],
    innovation: "Unified verification workflow",
    color: "#06b6d4",
    type: "fullstack",
    github: "https://github.com/gaurabrana07/Verifi-OneHub",
    status: "Completed",
  }
];

// Galaxies Configuration
export const galaxiesConfig = [
  {
    id: "developer",
    name: "Developer Galaxy",
    subtitle: "Full-Stack & Web Development",
    color: "#3b82f6",
    secondaryColor: "#60a5fa",
    description: "The realm of web technologies, where ideas transform into interactive experiences.",
    icon: "🌐",
    skills: ["React.js", "Node.js", "JavaScript", "MongoDB", "Express.js"],
    position: [4, 2, -3],
  },
  {
    id: "ai",
    name: "AI / ML Galaxy",
    subtitle: "Machine Learning & Intelligence",
    color: "#a855f7",
    secondaryColor: "#c084fc",
    description: "Where machines learn to think and data reveals its secrets.",
    icon: "🧠",
    skills: ["Python", "TensorFlow", "OpenCV", "CNN", "Deep Learning"],
    position: [-4, 1, -2],
  },
  {
    id: "systems",
    name: "Systems Galaxy",
    subtitle: "OS & Compiler Engineering",
    color: "#8b5cf6",
    secondaryColor: "#a78bfa",
    description: "The foundation of computing - operating systems, compilers, and low-level magic.",
    icon: "⚙️",
    skills: ["C", "C++", "Assembly", "LLVM", "Linux"],
    position: [0, -3, -4],
  },
  {
    id: "problemsolver",
    name: "Problem Solver Galaxy",
    subtitle: "DSA & Competitive Programming",
    color: "#10b981",
    secondaryColor: "#34d399",
    description: "The arena where algorithms battle and optimal solutions emerge.",
    icon: "🧩",
    skills: ["Data Structures", "Algorithms", "Dynamic Programming", "Problem Solving"],
    position: [3, -2, 2],
  },
  {
    id: "builder",
    name: "Builder Galaxy",
    subtitle: "Projects & Innovation",
    color: "#f97316",
    secondaryColor: "#fb923c",
    description: "Where creativity meets code to build impactful solutions.",
    icon: "🚀",
    skills: ["Project Architecture", "System Design", "Innovation", "Product Development"],
    position: [-3, -1, 3],
  },
];

// Journey Timeline
export const journeyData = [
  {
    year: "2022",
    title: "The Beginning",
    description: "Started B.Tech in Computer Science at Graphic Era Hill University. First exposure to programming with C and Python.",
    type: "education",
    milestone: true,
  },
  {
    year: "2023",
    title: "Deep Dive into DSA",
    description: "Began competitive programming journey on LeetCode. Mastered fundamental data structures and algorithms.",
    type: "learning",
    milestone: true,
  },
  {
    year: "2023",
    title: "Full-Stack Awakening",
    description: "Learned React.js, Node.js, and MongoDB. Built first major project - Char Dham Tourism Platform.",
    type: "project",
    milestone: true,
  },
  {
    year: "2024",
    title: "Systems Programming",
    description: "Started exploring operating systems and compiler design. Began work on ARGON OS.",
    type: "learning",
    milestone: false,
  },
  {
    year: "2024",
    title: "AI/ML Exploration",
    description: "Ventured into machine learning with TensorFlow. Built Face Age & Gender Detector using CNNs.",
    type: "project",
    milestone: true,
  },
  {
    year: "2024",
    title: "GRAN Compiler",
    description: "Started developing a statically typed compiled language with LLVM backend.",
    type: "project",
    milestone: false,
  },
  {
    year: "2025",
    title: "Pre-Final Year & Beyond",
    description: "Continuing to build impactful projects while preparing for the next chapter in tech.",
    type: "current",
    milestone: true,
  },
];

// Achievements & Certifications
export const achievementsData = [
  {
    id: 1,
    title: "Placeholder Achievement", // UPDATE: Add your actual achievement
    description: "Description of achievement",
    date: "2024",
    type: "achievement",
    icon: "🏆",
    link: "", // Add certificate/proof link
  },
  {
    id: 2,
    title: "Placeholder Certification", // UPDATE: Add your actual certification
    description: "Description of certification",
    issuer: "Issuing Organization",
    date: "2024",
    type: "certification",
    icon: "📜",
    link: "", // Add certificate link
  },
  // Add more achievements and certifications here
];

// Navigation Sections for recruiter mode
export const sections = [
  { id: "home", label: "Hub", icon: "🌌" },
  { id: "about", label: "Identity", icon: "✨" },
  { id: "skills", label: "Powers", icon: "⚡" },
  { id: "projects", label: "Creations", icon: "🚀" },
  { id: "journey", label: "Timeline", icon: "⏳" },
  { id: "contact", label: "Signal", icon: "📡" },
];
