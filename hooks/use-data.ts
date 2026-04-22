import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatMessage, LearningMaterial, Doubt, StudentProgress } from '@/lib/mock-data';

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data as T;
}

// Chat Hooks
export const useChat = (classId: string) => {
  return useQuery({
    queryKey: ['chat', classId],
    queryFn: async () => {
      const data = await apiRequest<{ messages: ChatMessage[] }>(`/api/chat/${encodeURIComponent(classId)}`);
      return data.messages;
    },
    staleTime: 0,
  });
};

export const useSendMessage = (classId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: Pick<ChatMessage, 'content'>) => {
      return apiRequest<{ message: ChatMessage }>(`/api/chat/${encodeURIComponent(classId)}`, {
        method: 'POST',
        body: JSON.stringify({ content: message.content }),
      });
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
    queryFn: async () => {
      const data = await apiRequest<{ materials: LearningMaterial[] }>('/api/materials');
      return data.materials;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUploadMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (material: Omit<LearningMaterial, 'id' | 'uploadedBy' | 'uploadedByName' | 'uploadedAt' | 'views' | 'downloads'> & Partial<Pick<LearningMaterial, 'fileUrl' | 'fileType'>>) => {
      return apiRequest<{ material: LearningMaterial }>('/api/materials', {
        method: 'POST',
        body: JSON.stringify(material),
      });
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
      return apiRequest<{ ok: boolean }>(`/api/materials/${materialId}/download`, {
        method: 'POST',
      });
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
    queryFn: async () => {
      const data = await apiRequest<{ doubts: Doubt[] }>('/api/doubts');
      return data.doubts;
    },
    staleTime: 0,
  });
};

export const useDoubt = (doubtId: string) => {
  return useQuery({
    queryKey: ['doubt', doubtId],
    queryFn: async () => {
      const data = await apiRequest<{ doubt: Doubt }>(`/api/doubts/${doubtId}`);
      return data.doubt;
    },
    enabled: !!doubtId,
    staleTime: 0,
  });
};

export const useCreateDoubt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doubt: Pick<Doubt, 'subject' | 'question' | 'description'>) => {
      return apiRequest<{ doubt: Doubt }>('/api/doubts', {
        method: 'POST',
        body: JSON.stringify(doubt),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doubts'] });
    },
  });
};

export const useReplyToDoubt = (doubtId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reply: Pick<Doubt['replies'][number], 'content'>) => {
      return apiRequest<{ doubt: Doubt }>(`/api/doubts/${doubtId}/replies`, {
        method: 'POST',
        body: JSON.stringify(reply),
      });
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
      return apiRequest<{ doubt: Doubt }>(`/api/doubts/${doubtId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
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
      return apiRequest<{ ok: boolean }>(`/api/doubts/${doubtId}/upvote`, {
        method: 'POST',
      });
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
    queryFn: async () => {
      const data = await apiRequest<{ progress: StudentProgress }>(`/api/progress/${userId}`);
      return data.progress;
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<StudentProgress> }) => {
      const data = await apiRequest<{ progress: StudentProgress }>(`/api/progress/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return data.progress;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.userId] });
    },
  });
};

// Admin Hooks
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive';
  avatar?: string;
  joinDate: string;
}

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const data = await apiRequest<{ users: AdminUser[] }>('/api/admin/users');
      return data.users;
    },
    staleTime: 0,
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      role: 'student' | 'teacher' | 'admin';
      password: string;
      status?: 'active' | 'inactive';
    }) => {
      return apiRequest<{ user: AdminUser }>('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<AdminUser> & { password?: string } }) => {
      return apiRequest<{ user: AdminUser }>(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest<{ ok: boolean }>(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};
