export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  avatar?: string;
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  students: number;
  duration: string;
  createdAt: Date;
}

export interface Lecture {
  id: string;
  title: string;
  course: string;
  instructor: string;
  duration: string;
  views: number;
  uploadDate: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Event {
  id: string;
  title: string;
  type: 'lecture' | 'workshop' | 'exam' | 'seminar';
  date: string;
  time: string;
  instructor: string;
  location: string;
  description: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface Document {
  id: string;
  title: string;
  course: string;
  instructor: string;
  type: 'pdf' | 'docx' | 'pptx';
  size: string;
  uploadDate: string;
  downloads: number;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface LiveSession {
  id: string;
  title: string;
  course: string;
  instructor: string;
  date: string;
  time: string;
  duration: number;
  participants: number;
  maxParticipants: number;
  status: 'live' | 'upcoming' | 'completed';
  meetLink: string;
  description: string;
  category: string;
  recordingUrl?: string;
}