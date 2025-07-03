"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React from 'react';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">1,234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">567</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-72 flex flex-col">
            <CardHeader>
              <CardTitle>Weekly Active Users</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              {/* Replace with actual chart later */}
              <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Line Chart Placeholder
              </div>
            </CardContent>
          </Card>
          <Card className="h-72 flex flex-col">
            <CardHeader>
              <CardTitle>Most Popular Courses</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              {/* Replace with actual chart later */}
              <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Bar Chart Placeholder
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 