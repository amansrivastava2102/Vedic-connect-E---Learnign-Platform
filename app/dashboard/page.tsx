'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Calendar,
  FileText,
  Video,
  Users,
  TrendingUp,
  Clock,
  PlayCircle,
  CalendarDays,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/SupabaseProvider';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState('student');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedLectures: 0,
    upcomingEvents: 0,
    studyHours: 0,
    activeCourses: 0,
    totalStudents: 0,
    liveSessions: 0,
    engagementRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  
  const router = useRouter();
  const { supabase } = useSupabase();

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) return;

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("No active session found or error:", error);
        router.push('/auth');
        return;
      }

      setUserName(session.user.email || session.user.user_metadata.full_name || 'User');
      
      // Fetch user role from profiles table or user_metadata
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
        setUserRole('student'); // Default to student if role not found
      } else if (profile) {
        setUserRole(profile.role || 'student');
      } else if (session.user.user_metadata.role) {
        setUserRole(session.user.user_metadata.role);
      } else {
        setUserRole('student'); // Default if no role found
      }

      // Fetch dashboard data based on user role
      await fetchDashboardData(session.user.id, profile?.role || 'student');
    };

    checkUser();
  }, [router, supabase]);

  const fetchDashboardData = async (userId: string, role: string) => {
    try {
      if (role === 'student') {
        // Fetch student-specific data
        const [enrollmentsResponse, eventsResponse] = await Promise.all([
          api.enrollments.getMyEnrollments(),
          api.events.getAll({ status: 'upcoming' })
        ]);

        setStats({
          enrolledCourses: enrollmentsResponse.data?.length || 0,
          completedLectures: 0, // You can implement lecture progress tracking
          upcomingEvents: eventsResponse.data?.length || 0,
          studyHours: 0, // You can implement study time tracking
          activeCourses: 0,
          totalStudents: 0,
          liveSessions: 0,
          engagementRate: 0,
        });

        setUpcomingEvents(eventsResponse.data?.slice(0, 3) || []);
      } else {
        // Fetch instructor-specific data
        const [coursesResponse, eventsResponse, sessionsResponse] = await Promise.all([
          api.courses.getAll({ instructor: userId }),
          api.events.getAll({ instructor: userId }),
          api.liveSessions.getAll({ instructor: userId })
        ]);

        setStats({
          enrolledCourses: 0,
          completedLectures: 0,
          upcomingEvents: eventsResponse.data?.length || 0,
          studyHours: 0,
          activeCourses: coursesResponse.data?.length || 0,
          totalStudents: coursesResponse.data?.reduce((acc, course) => acc + (course.students || 0), 0) || 0,
          liveSessions: sessionsResponse.data?.length || 0,
          engagementRate: 94, // You can implement engagement calculation
        });

        setUpcomingEvents(eventsResponse.data?.slice(0, 3) || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const studentStats = [
    {
      title: 'Enrolled Courses',
      value: stats.enrolledCourses.toString(),
      description: '+2 this month',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completed Lectures',
      value: stats.completedLectures.toString(),
      description: '6 pending',
      icon: Video,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents.toString(),
      description: 'Next: Tomorrow',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Study Hours',
      value: `${stats.studyHours}h`,
      description: 'This week',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const instructorStats = [
    {
      title: 'Active Courses',
      value: stats.activeCourses.toString(),
      description: '3 new this month',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Students',
      value: stats.totalStudents.toString(),
      description: '+23 this week',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Live Sessions',
      value: stats.liveSessions.toString(),
      description: '2 scheduled today',
      icon: Video,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Engagement Rate',
      value: `${stats.engagementRate}%`,
      description: '+5% this month',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const currentStats = userRole === 'instructor' ? instructorStats : studentStats;

  // Fallback recent activity if no real data
  const fallbackRecentActivity = [
    {
      title: 'Bhagavad Gita - Chapter 2',
      description: 'New lecture uploaded',
      time: '2 hours ago',
      type: 'lecture',
    },
    {
      title: 'Sanskrit Grammar Workshop',
      description: 'Event reminder',
      time: '4 hours ago',
      type: 'event',
    },
    {
      title: 'Vedic Mathematics Quiz',
      description: 'Assignment due tomorrow',
      time: '1 day ago',
      type: 'assignment',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userName}
            </h1>
            <p className="text-gray-600 mt-1">
              {userRole === 'instructor' 
                ? "Ready to inspire your students today?" 
                : "Continue your journey of learning"
              }
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="vedic-gradient hover:opacity-90">
              {userRole === 'instructor' ? 'Create New Content' : 'Browse Courses'}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity and Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-orange-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(recentActivity.length > 0 ? recentActivity : fallbackRecentActivity).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.date}</p>
                        <p className="text-xs text-gray-400">{event.instructor}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No upcoming events</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}