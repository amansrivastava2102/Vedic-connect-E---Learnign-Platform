import { Course, Event, Lecture, Document, LiveSession } from './types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Bhagavad Gita Study',
    description: 'Comprehensive study of the Bhagavad Gita with modern interpretations',
    instructor: 'Dr. Rajesh Sharma',
    category: 'Philosophy',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.pexels.com/photos/5428831/pexels-photo-5428831.jpeg?auto=compress&cs=tinysrgb&w=400',
    students: 1250,
    duration: '12 weeks',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Sanskrit Fundamentals',
    description: 'Learn the basics of Sanskrit language, script, and pronunciation',
    instructor: 'Prof. Meera Gupta',
    category: 'Language',
    difficulty: 'Beginner',
    thumbnail: 'https://images.pexels.com/photos/5212339/pexels-photo-5212339.jpeg?auto=compress&cs=tinysrgb&w=400',
    students: 890,
    duration: '8 weeks',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    title: 'Vedic Mathematics',
    description: 'Master ancient mathematical techniques for modern applications',
    instructor: 'Dr. Amit Patel',
    category: 'Mathematics',
    difficulty: 'Advanced',
    thumbnail: 'https://images.pexels.com/photos/6238020/pexels-photo-6238020.jpeg?auto=compress&cs=tinysrgb&w=400',
    students: 2340,
    duration: '10 weeks',
    createdAt: new Date('2024-01-01'),
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Bhagavad Gita Discussion Session',
    type: 'lecture',
    date: '2024-01-15',
    time: '3:00 PM - 4:30 PM',
    instructor: 'Dr. Rajesh Sharma',
    location: 'Virtual - Google Meet',
    description: 'Deep dive into Chapter 2 of the Bhagavad Gita with interactive Q&A',
    attendees: 45,
    maxAttendees: 50,
    status: 'upcoming',
  },
];

export const mockLectures: Lecture[] = [
  {
    id: '1',
    title: 'Introduction to Bhagavad Gita',
    course: 'Bhagavad Gita Study',
    instructor: 'Dr. Rajesh Sharma',
    duration: '45 min',
    views: 1250,
    uploadDate: '2024-01-10',
    thumbnail: 'https://images.pexels.com/photos/5428831/pexels-photo-5428831.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'An introductory lecture covering the essence and significance of the Bhagavad Gita in modern life.',
    category: 'Philosophy',
    difficulty: 'Beginner',
  },
];