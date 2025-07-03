"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import React from 'react';

const courses = [
  {
    title: 'Introduction to Vedic Mathematics',
    description: 'Learn the basics of Vedic math techniques for faster calculations.',
    duration: '4 weeks',
  },
  {
    title: 'Upanishads: Ancient Wisdom',
    description: 'Explore the core teachings of the Upanishads and their relevance today.',
    duration: '6 weeks',
  },
  {
    title: 'Sanskrit for Beginners',
    description: 'Start your journey into the Sanskrit language with easy lessons.',
    duration: '8 weeks',
  },
  {
    title: 'Yoga Philosophy',
    description: 'Understand the philosophy behind Yoga and its practical applications.',
    duration: '5 weeks',
  },
];

export default function CoursesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Courses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <Card key={idx} className="flex flex-col justify-between h-full">
              <CardHeader>
                <CardTitle className="text-xl text-black">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="inline-block bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium mb-2">
                  Duration: {course.duration}
                </span>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 