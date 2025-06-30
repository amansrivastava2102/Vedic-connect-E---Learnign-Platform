'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Clock, Users, Plus, VideoIcon, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LiveSessionsPage() {
  const [userRole, setUserRole] = useState('student');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole') || 'student');
  }, []);

  const liveSessions = [
    {
      id: 1,
      title: 'Interactive Bhagavad Gita Discussion',
      course: 'Bhagavad Gita Study',
      instructor: 'Dr. Rajesh Sharma',
      date: '2024-01-15',
      time: '3:00 PM - 4:30 PM',
      duration: 90,
      participants: 45,
      maxParticipants: 50,
      status: 'upcoming',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      description: 'Deep dive into Chapter 2 with live Q&A session',
      category: 'Discussion',
    },
    {
      id: 2,
      title: 'Sanskrit Pronunciation Workshop',
      course: 'Sanskrit Fundamentals',
      instructor: 'Prof. Meera Gupta',
      date: '2024-01-18',
      time: '10:00 AM - 11:30 AM',
      duration: 90,
      participants: 25,
      maxParticipants: 30,
      status: 'upcoming',
      meetLink: 'https://meet.google.com/xyz-abcd-efg',
      description: 'Practice session for correct Sanskrit pronunciation',
      category: 'Workshop',
    },
    {
      id: 3,
      title: 'Vedic Math Problem Solving',
      course: 'Vedic Mathematics',
      instructor: 'Dr. Amit Patel',
      date: '2024-01-20',
      time: '2:00 PM - 3:00 PM',
      duration: 60,
      participants: 38,
      maxParticipants: 40,
      status: 'upcoming',
      meetLink: 'https://meet.google.com/pqr-stuv-wxy',
      description: 'Live problem-solving session with advanced techniques',
      category: 'Tutorial',
    },
    {
      id: 4,
      title: 'Meditation and Mindfulness Session',
      course: 'Spiritual Practices',
      instructor: 'Swami Ananda',
      date: '2024-01-12',
      time: '6:00 AM - 7:00 AM',
      duration: 60,
      participants: 78,
      maxParticipants: 80,
      status: 'completed',
      meetLink: 'https://meet.google.com/mno-pqrs-tuv',
      description: 'Guided meditation and breathing exercises',
      category: 'Practice',
      recordingUrl: 'https://drive.google.com/file/d/recording123',
    },
    {
      id: 5,
      title: 'Ayurveda Q&A with Expert',
      course: 'Ayurveda Fundamentals',
      instructor: 'Dr. Priya Singh',
      date: '2024-01-10',
      time: '4:00 PM - 5:30 PM',
      duration: 90,
      participants: 56,
      maxParticipants: 60,
      status: 'completed',
      meetLink: 'https://meet.google.com/hij-klmn-opq',
      description: 'Open Q&A session about Ayurvedic principles',
      category: 'QnA',
      recordingUrl: 'https://drive.google.com/file/d/recording456',
    },
    {
      id: 6,
      title: 'Yoga Philosophy Deep Dive',
      course: 'Yoga Studies',
      instructor: 'Guru Krishnan',
      date: '2024-01-22',
      time: '11:00 AM - 12:30 PM',
      duration: 90,
      participants: 15,
      maxParticipants: 25,
      status: 'upcoming',
      meetLink: 'https://meet.google.com/def-ghij-klm',
      description: 'Exploring the philosophical foundations of yoga practice',
      category: 'Lecture',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800 pulse-animation';
      case 'upcoming':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Discussion':
        return 'bg-blue-100 text-blue-800';
      case 'Workshop':
        return 'bg-purple-100 text-purple-800';
      case 'Tutorial':
        return 'bg-green-100 text-green-800';
      case 'Practice':
        return 'bg-orange-100 text-orange-800';
      case 'QnA':
        return 'bg-pink-100 text-pink-800';
      case 'Lecture':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingSessions = liveSessions.filter(session => session.status === 'upcoming');
  const completedSessions = liveSessions.filter(session => session.status === 'completed');
  const liveSessions_current = liveSessions.filter(session => session.status === 'live');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Sessions</h1>
            <p className="text-gray-600 mt-1">
              {userRole === 'instructor' 
                ? "Schedule and manage your live teaching sessions" 
                : "Join interactive live sessions with expert instructors"
              }
            </p>
          </div>
          {userRole === 'instructor' && (
            <div className="mt-4 sm:mt-0">
              <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="vedic-gradient hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Live Session</DialogTitle>
                    <DialogDescription>
                      Create a new live session for your students.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="session-title">Session Title</Label>
                      <Input id="session-title" placeholder="Enter session title" />
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Input id="time" type="time" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input id="duration" type="number" placeholder="90" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="max-participants">Max Participants</Label>
                        <Input id="max-participants" type="number" placeholder="50" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="discussion">Discussion</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                          <SelectItem value="practice">Practice</SelectItem>
                          <SelectItem value="qna">Q&A</SelectItem>
                          <SelectItem value="lecture">Lecture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Session description" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="vedic-gradient hover:opacity-90">
                      Schedule Session
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-red-100">
                  <VideoIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{liveSessions_current.length}</p>
                  <p className="text-sm text-gray-600">Live Now</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-orange-100">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{upcomingSessions.length}</p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-green-100">
                  <Video className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{completedSessions.length}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">234</p>
                  <p className="text-sm text-gray-600">Total Participants</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Sessions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <div className="flex space-x-2">
                        <Badge className={getCategoryColor(session.category)}>
                          {session.category}
                        </Badge>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{session.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{session.time} ({session.duration} min)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{session.participants}/{session.maxParticipants} registered</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-gray-600">Course: {session.course}</p>
                      <p className="text-sm text-gray-600">Instructor: {session.instructor}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button className="flex-1 vedic-gradient hover:opacity-90">
                      <VideoIcon className="h-4 w-4 mr-2" />
                      {userRole === 'student' ? 'Join Session' : 'Start Session'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Sessions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Sessions</h2>
          <div className="space-y-4">
            {completedSessions.map((session) => (
              <Card key={session.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-full bg-green-100">
                        <Video className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{session.title}</h3>
                        <p className="text-sm text-gray-600">{session.course} • {session.instructor}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">
                            {new Date(session.date).toLocaleDateString()} • {session.time}
                          </span>
                          <Badge className={getCategoryColor(session.category)}>
                            {session.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{session.participants} attended</p>
                      {session.recordingUrl && (
                        <Button variant="outline" size="sm" className="mt-2">
                          <Video className="h-4 w-4 mr-2" />
                          Watch Recording
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}