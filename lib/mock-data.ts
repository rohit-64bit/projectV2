// Mock data types and storage layer
export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  isAI?: boolean;
}

export interface LearningMaterial {
  id: string;
  title: string;
  subject: string;
  description: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Date;
  fileUrl: string;
  fileType: string;
  views: number;
  downloads: number;
}

export interface Doubt {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  subject: string;
  question: string;
  description: string;
  createdAt: Date;
  status: 'open' | 'answered' | 'closed';
  replies: DoubtReply[];
  upvotes: number;
}

export interface DoubtReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: Date;
  isAccepted?: boolean;
}

export interface StudentProgress {
  userId: string;
  totalLessonsCompleted: number;
  averageScore: number;
  currentStreak: number;
  studyHoursThisWeek: number;
  doubtsAsked: number;
  materialsDownloaded: number;
}

const STORAGE_KEYS = {
  CHAT_MESSAGES: 'brightflow_chat_messages',
  MATERIALS: 'brightflow_materials',
  DOUBTS: 'brightflow_doubts',
  STUDENT_PROGRESS: 'brightflow_student_progress',
};

// Chat Messages
export const chatStorage = {
  getMessages: (classId: string): ChatMessage[] => {
    if (typeof window === 'undefined') return [];
    const key = `${STORAGE_KEYS.CHAT_MESSAGES}_${classId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  addMessage: (classId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (typeof window === 'undefined') return;
    const key = `${STORAGE_KEYS.CHAT_MESSAGES}_${classId}`;
    const messages = chatStorage.getMessages(classId);
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date(),
    };
    messages.push(newMessage);
    localStorage.setItem(key, JSON.stringify(messages));
    return newMessage;
  },
};

// Learning Materials
export const materialsStorage = {
  getMaterials: (): LearningMaterial[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return data ? JSON.parse(data) : [];
  },

  addMaterial: (material: Omit<LearningMaterial, 'id'>) => {
    if (typeof window === 'undefined') return;
    const materials = materialsStorage.getMaterials();
    const newMaterial: LearningMaterial = {
      ...material,
      id: `mat_${Date.now()}`,
    };
    materials.push(newMaterial);
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
    return newMaterial;
  },

  incrementViews: (materialId: string) => {
    if (typeof window === 'undefined') return;
    const materials = materialsStorage.getMaterials();
    const material = materials.find((m) => m.id === materialId);
    if (material) {
      material.views += 1;
      localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
    }
  },

  incrementDownloads: (materialId: string) => {
    if (typeof window === 'undefined') return;
    const materials = materialsStorage.getMaterials();
    const material = materials.find((m) => m.id === materialId);
    if (material) {
      material.downloads += 1;
      localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
    }
  },
};

// Doubts
export const doubtsStorage = {
  getDoubts: (): Doubt[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.DOUBTS);
    return data ? JSON.parse(data) : [];
  },

  getDoubtById: (doubtId: string): Doubt | undefined => {
    const doubts = doubtsStorage.getDoubts();
    return doubts.find((d) => d.id === doubtId);
  },

  addDoubt: (doubt: Omit<Doubt, 'id' | 'createdAt' | 'replies' | 'upvotes'>) => {
    if (typeof window === 'undefined') return;
    const doubts = doubtsStorage.getDoubts();
    const newDoubt: Doubt = {
      ...doubt,
      id: `doubt_${Date.now()}`,
      createdAt: new Date(),
      replies: [],
      upvotes: 0,
    };
    doubts.push(newDoubt);
    localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
    return newDoubt;
  },

  addReply: (doubtId: string, reply: Omit<DoubtReply, 'id' | 'createdAt'>) => {
    if (typeof window === 'undefined') return;
    const doubts = doubtsStorage.getDoubts();
    const doubt = doubts.find((d) => d.id === doubtId);
    if (!doubt) return;

    const newReply: DoubtReply = {
      ...reply,
      id: `reply_${Date.now()}`,
      createdAt: new Date(),
    };
    doubt.replies.push(newReply);
    localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
    return newReply;
  },

  updateDoubtStatus: (doubtId: string, status: Doubt['status']) => {
    if (typeof window === 'undefined') return;
    const doubts = doubtsStorage.getDoubts();
    const doubt = doubts.find((d) => d.id === doubtId);
    if (doubt) {
      doubt.status = status;
      localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
    }
  },

  upvoteDoubt: (doubtId: string) => {
    if (typeof window === 'undefined') return;
    const doubts = doubtsStorage.getDoubts();
    const doubt = doubts.find((d) => d.id === doubtId);
    if (doubt) {
      doubt.upvotes += 1;
      localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
    }
  },
};

// Student Progress
export const progressStorage = {
  getProgress: (userId: string): StudentProgress => {
    if (typeof window === 'undefined') {
      return {
        userId,
        totalLessonsCompleted: 0,
        averageScore: 0,
        currentStreak: 0,
        studyHoursThisWeek: 0,
        doubtsAsked: 0,
        materialsDownloaded: 0,
      };
    }
    const key = `${STORAGE_KEYS.STUDENT_PROGRESS}_${userId}`;
    const data = localStorage.getItem(key);
    return data
      ? JSON.parse(data)
      : {
          userId,
          totalLessonsCompleted: 0,
          averageScore: 0,
          currentStreak: 0,
          studyHoursThisWeek: 0,
          doubtsAsked: 0,
          materialsDownloaded: 0,
        };
  },

  updateProgress: (userId: string, updates: Partial<StudentProgress>) => {
    if (typeof window === 'undefined') return;
    const key = `${STORAGE_KEYS.STUDENT_PROGRESS}_${userId}`;
    const current = progressStorage.getProgress(userId);
    const updated = { ...current, ...updates };
    localStorage.setItem(key, JSON.stringify(updated));
  },
};

// Initialize with sample data
export const initializeSampleData = () => {
  if (typeof window === 'undefined') return;

  const existingMaterials = materialsStorage.getMaterials();
  if (existingMaterials.length === 0) {
    const sampleMaterials: Omit<LearningMaterial, 'id'>[] = [
      {
        title: 'Introduction to React Hooks',
        subject: 'Programming',
        description: 'Comprehensive guide to React Hooks and their usage in modern applications.',
        uploadedBy: 'teacher_001',
        uploadedByName: 'Dr. Sarah Johnson',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        fileUrl: '#',
        fileType: 'pdf',
        views: 234,
        downloads: 45,
      },
      {
        title: 'Calculus: Derivatives and Integrals',
        subject: 'Mathematics',
        description: 'Step-by-step explanations of derivatives and integrals with examples.',
        uploadedBy: 'teacher_002',
        uploadedByName: 'Prof. James Chen',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        fileUrl: '#',
        fileType: 'pdf',
        views: 156,
        downloads: 32,
      },
      {
        title: 'World History: Renaissance Period',
        subject: 'History',
        description: 'Interactive presentation on the Renaissance period and its cultural impact.',
        uploadedBy: 'teacher_003',
        uploadedByName: 'Ms. Emma Wilson',
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        fileUrl: '#',
        fileType: 'pptx',
        views: 89,
        downloads: 18,
      },
    ];

    sampleMaterials.forEach((material) => materialsStorage.addMaterial(material));
  }

  const existingDoubts = doubtsStorage.getDoubts();
  if (existingDoubts.length === 0) {
    const sampleDoubt = doubtsStorage.addDoubt({
      studentId: 'student_001',
      studentName: 'Alex Kumar',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex@example.com',
      subject: 'Mathematics',
      question: 'How do I solve quadratic equations using the quadratic formula?',
      description:
        'I understand the formula but I\'m struggling with the step-by-step process and when to use it.',
      status: 'open',
    });

    if (sampleDoubt) {
      doubtsStorage.addReply(sampleDoubt.id, {
        authorId: 'teacher_002',
        authorName: 'Prof. James Chen',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james@example.com',
        content:
          'Great question! The quadratic formula helps find the roots of any quadratic equation. The formula is x = (-b ± √(b²-4ac)) / 2a. Let me break down the steps...',
      });
    }
  }
};
