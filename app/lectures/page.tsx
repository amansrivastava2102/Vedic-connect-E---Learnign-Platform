'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Video, Play, Clock, Eye, Plus, Search, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LecturesPage() {
  const [userRole, setUserRole] = useState('student');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole') || 'student');
  }, []);

  const lectures = [
    {
      id: 1,
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
    {
      id: 2,
      title: 'Sanskrit Pronunciation Fundamentals',
      course: 'Sanskrit Fundamentals',
      instructor: 'Prof. Meera Gupta',
      duration: '32 min',
      views: 890,
      uploadDate: '2024-01-08',
      thumbnail: 'https://images.pexels.com/photos/5212339/pexels-photo-5212339.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Master the correct pronunciation of Sanskrit letters and common mantras.',
      category: 'Language',
      difficulty: 'Beginner',
    },
    {
      id: 3,
      title: 'Advanced Vedic Mathematics - Multiplication Techniques',
      course: 'Vedic Mathematics',
      instructor: 'Dr. Amit Patel',
      duration: '58 min',
      views: 2340,
      uploadDate: '2024-01-05',
      thumbnail: 'https://images.pexels.com/photos/6238020/pexels-photo-6238020.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Explore advanced multiplication techniques using Vedic mathematical principles.',
      category: 'Mathematics',
      difficulty: 'Advanced',
    },
    {
      id: 4,
      title: 'Ayurvedic Diet and Lifestyle',
      course: 'Ayurveda Fundamentals',
      instructor: 'Dr. Priya Singh',
      duration: '41 min',
      views: 1580,
      uploadDate: '2024-01-03',
      thumbnail: 'https://images.pexels.com/photos/4047148/pexels-photo-4047148.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Learn about Ayurvedic principles for maintaining optimal health through diet and lifestyle.',
      category: 'Health',
      difficulty: 'Intermediate',
    },
    {
      id: 5,
      title: 'Meditation Techniques from Ancient Texts',
      course: 'Spiritual Practices',
      instructor: 'Swami Ananda',
      duration: '52 min',
      views: 3120,
      uploadDate: '2024-01-01',
      thumbnail: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Discover traditional meditation techniques as described in ancient Vedic texts.',
      category: 'Spirituality',
      difficulty: 'Intermediate',
    },
    {
      id: 6,
      title: 'Yoga Philosophy and Practice',
      course: 'Yoga Studies',
      instructor: 'Guru Krishnan',
      duration: '38 min',
      views: 2890,
      uploadDate: '2023-12-28',
      thumbnail: 'https://images.pexels.com/photos/3822702/pexels-photo-3822702.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Understand the philosophical foundations of yoga and its practical applications.',
      category: 'Philosophy',
      difficulty: 'Intermediate',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLectures = lectures.filter(lecture =>
    lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecture.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lecture.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userRole === 'instructor' ? 'Manage Lectures' : 'Video Lectures'}
            </h1>
            <p className="text-gray-600 mt-1">
              {userRole === 'instructor' 
                ? "Upload and manage your video content" 
                : "Access comprehensive video lectures from expert instructors"
              }
            </p>
          </div>
          {userRole === 'instructor' && (
            <div className="mt-4 sm:mt-0">
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="vedic-gradient hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Lecture
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Upload New Lecture</DialogTitle>
                    <DialogDescription>
                      Add a new video lecture to your course.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="lecture-title">Lecture Title</Label>
                      <Input id="lecture-title" placeholder="Enter lecture title" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="course">Course</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bhagavad-gita">Bhagavad Gita Study</SelectItem>
                          <SelectItem value="sanskrit">Sanskrit Fundamentals</SelectItem>
                          <SelectItem value="vedic-math">Vedic Mathematics</SelectItem>
                          <SelectItem value="ayurveda">Ayurveda Fundamentals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="video-url">Video URL (YouTube)</Label>
                      <Input id="video-url" placeholder="https://youtube.com/watch?v=..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="philosophy">Philosophy</SelectItem>
                            <SelectItem value="language">Language</SelectItem>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="spirituality">Spirituality</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Lecture description" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="vedic-gradient hover:opacity-90">
                      Upload Lecture
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search lectures, courses, or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-blue-100">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{lectures.length}</p>
                  <p className="text-sm text-gray-600">Total Lectures</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-green-100">
                  <Play className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">12,079</p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-orange-100">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.5h</p>
                  <p className="text-sm text-gray-600">Avg. Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-purple-100">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">95%</p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lectures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lecture) => (
            <Card key={lecture.id} className="card-hover overflow-hidden">
              <div className="relative">
                <img
                  src={lecture.thumbnail}
                  alt={lecture.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="sm" className="vedic-gradient hover:opacity-90">
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                  {lecture.duration}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg line-clamp-2">{lecture.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{lecture.category}</Badge>
                      <Badge className={getDifficultyColor(lecture.difficulty)}>
                        {lecture.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {lecture.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Course: {lecture.course}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>by {lecture.instructor}</span>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{lecture.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Uploaded {new Date(lecture.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button className="flex-1 vedic-gradient hover:opacity-90">
                    <Play className="h-4 w-4 mr-2" />
                    Watch
                  </Button>
                  {userRole === 'instructor' && (
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}