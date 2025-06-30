// API utility functions for VedicConnect
import { supabase } from './supabase';
import { Course, Lecture, Event, Document, LiveSession } from './types';

// Generic API response type
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Generic API function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.error || 'An error occurred' };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Network error' };
  }
}

// Course API functions
export const courseApi = {
  // Get all courses with optional filtering
  getAll: async (filters?: {
    category?: string;
    difficulty?: string;
    instructor?: string;
  }): Promise<ApiResponse<Course[]>> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.instructor) params.append('instructor', filters.instructor);

    return apiCall<Course[]>(`courses?${params.toString()}`);
  },

  // Get a specific course
  getById: async (id: string): Promise<ApiResponse<Course>> => {
    return apiCall<Course>(`courses/${id}`);
  },

  // Create a new course
  create: async (courseData: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    duration: string;
    thumbnail: string;
  }): Promise<ApiResponse<Course>> => {
    return apiCall<Course>('courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  // Update a course
  update: async (
    id: string,
    courseData: Partial<Course>
  ): Promise<ApiResponse<Course>> => {
    return apiCall<Course>(`courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  // Delete a course
  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>(`courses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Lecture API functions
export const lectureApi = {
  // Get all lectures with optional filtering
  getAll: async (filters?: {
    courseId?: string;
    category?: string;
    difficulty?: string;
    instructor?: string;
  }): Promise<ApiResponse<Lecture[]>> => {
    const params = new URLSearchParams();
    if (filters?.courseId) params.append('courseId', filters.courseId);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.instructor) params.append('instructor', filters.instructor);

    return apiCall<Lecture[]>(`lectures?${params.toString()}`);
  },

  // Create a new lecture
  create: async (lectureData: {
    title: string;
    description: string;
    courseId: string;
    duration: string;
    videoUrl: string;
    thumbnail: string;
    category: string;
    difficulty: string;
  }): Promise<ApiResponse<Lecture>> => {
    return apiCall<Lecture>('lectures', {
      method: 'POST',
      body: JSON.stringify(lectureData),
    });
  },
};

// Event API functions
export const eventApi = {
  // Get all events with optional filtering
  getAll: async (filters?: {
    type?: string;
    status?: string;
    instructor?: string;
  }): Promise<ApiResponse<Event[]>> => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.instructor) params.append('instructor', filters.instructor);

    return apiCall<Event[]>(`events?${params.toString()}`);
  },

  // Create a new event
  create: async (eventData: {
    title: string;
    type: string;
    date: string;
    time: string;
    location: string;
    description: string;
    maxAttendees: number;
  }): Promise<ApiResponse<Event>> => {
    return apiCall<Event>('events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },
};

// Document API functions
export const documentApi = {
  // Get all documents with optional filtering
  getAll: async (filters?: {
    courseId?: string;
    type?: string;
    category?: string;
  }): Promise<ApiResponse<Document[]>> => {
    const params = new URLSearchParams();
    if (filters?.courseId) params.append('courseId', filters.courseId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);

    return apiCall<Document[]>(`documents?${params.toString()}`);
  },

  // Upload a new document
  upload: async (documentData: {
    title: string;
    courseId: string;
    type: string;
    size: string;
    description: string;
    category: string;
    difficulty: string;
    fileUrl: string;
  }): Promise<ApiResponse<Document>> => {
    return apiCall<Document>('documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
  },
};

// Live Session API functions
export const liveSessionApi = {
  // Get all live sessions with optional filtering
  getAll: async (filters?: {
    status?: string;
    courseId?: string;
    instructor?: string;
  }): Promise<ApiResponse<LiveSession[]>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.courseId) params.append('courseId', filters.courseId);
    if (filters?.instructor) params.append('instructor', filters.instructor);

    return apiCall<LiveSession[]>(`live-sessions?${params.toString()}`);
  },

  // Create a new live session
  create: async (sessionData: {
    title: string;
    courseId: string;
    date: string;
    time: string;
    duration: number;
    maxParticipants: number;
    meetLink: string;
    description: string;
  }): Promise<ApiResponse<LiveSession>> => {
    return apiCall<LiveSession>('live-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },
};

// Enrollment API functions
export const enrollmentApi = {
  // Get user's enrollments
  getMyEnrollments: async (): Promise<ApiResponse<any[]>> => {
    return apiCall<any[]>('enrollments');
  },

  // Enroll in a course
  enroll: async (courseId: string): Promise<ApiResponse<any>> => {
    return apiCall<any>('enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  },
};

// Profile API functions
export const profileApi = {
  // Get current user's profile
  getProfile: async (): Promise<ApiResponse<any>> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  },

  // Update profile
  updateProfile: async (updates: {
    full_name?: string;
    bio?: string;
    avatar_url?: string;
  }): Promise<ApiResponse<any>> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  },
};

// File upload utility
export const uploadFile = async (
  file: File,
  bucket: string = 'documents'
): Promise<ApiResponse<{ path: string; url: string }>> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      return { data: null, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      data: { path: filePath, url: urlData.publicUrl },
      error: null,
    };
  } catch (error) {
    return { data: null, error: 'Upload failed' };
  }
};

// Export all APIs
export const api = {
  courses: courseApi,
  lectures: lectureApi,
  events: eventApi,
  documents: documentApi,
  liveSessions: liveSessionApi,
  enrollments: enrollmentApi,
  profile: profileApi,
  uploadFile,
}; 