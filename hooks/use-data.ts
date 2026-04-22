import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  chatStorage,
  materialsStorage,
  doubtsStorage,
  progressStorage,
  ChatMessage,
  LearningMaterial,
  Doubt,
  StudentProgress,
  initializeSampleData,
} from '@/lib/mock-data';

// Initialize sample data on first load
if (typeof window !== 'undefined') {
  initializeSampleData();
}

// Chat Hooks
export const useChat = (classId: string) => {
  return useQuery({
    queryKey: ['chat', classId],
    queryFn: () => {
      const messages = chatStorage.getMessages(classId);
      return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    },
    staleTime: 0,
  });
};

export const useSendMessage = (classId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      const newMessage = chatStorage.addMessage(classId, message);
      return newMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', classId] });
    },
  });
};

// Materials Hooks
export const useMaterials = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: () => {
      const materials = materialsStorage.getMaterials();
      return materials.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUploadMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (material: Omit<LearningMaterial, 'id'>) => {
      return materialsStorage.addMaterial(material);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};

export const useDownloadMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (materialId: string) => {
      materialsStorage.incrementDownloads(materialId);
      return materialId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};

// Doubts Hooks
export const useDoubts = () => {
  return useQuery({
    queryKey: ['doubts'],
    queryFn: () => {
      const doubts = doubtsStorage.getDoubts();
      return doubts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    staleTime: 0,
  });
};

export const useDoubt = (doubtId: string) => {
  return useQuery({
    queryKey: ['doubt', doubtId],
    queryFn: () => doubtsStorage.getDoubtById(doubtId),
    staleTime: 0,
  });
};

export const useCreateDoubt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doubt: Parameters<typeof doubtsStorage.addDoubt>[0]) => {
      return doubtsStorage.addDoubt(doubt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doubts'] });
    },
  });
};

export const useReplyToDoubt = (doubtId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reply: Parameters<typeof doubtsStorage.addReply>[1]) => {
      return doubtsStorage.addReply(doubtId, reply);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doubt', doubtId] });
      queryClient.invalidateQueries({ queryKey: ['doubts'] });
    },
  });
};

export const useUpdateDoubtStatus = (doubtId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: Doubt['status']) => {
      doubtsStorage.updateDoubtStatus(doubtId, status);
      return status;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doubt', doubtId] });
      queryClient.invalidateQueries({ queryKey: ['doubts'] });
    },
  });
};

export const useUpvoteDoubt = (doubtId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      doubtsStorage.upvoteDoubt(doubtId);
      return doubtId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doubt', doubtId] });
      queryClient.invalidateQueries({ queryKey: ['doubts'] });
    },
  });
};

// Progress Hooks
export const useStudentProgress = (userId: string) => {
  return useQuery({
    queryKey: ['progress', userId],
    queryFn: () => progressStorage.getProgress(userId),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<StudentProgress> }) => {
      progressStorage.updateProgress(userId, updates);
      return updates;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.userId] });
    },
  });
};
