"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import React from 'react';

const students = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@email.com',
    course: 'Vedic Mathematics',
    date: '2024-04-01',
    status: 'Active',
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    course: 'Sanskrit for Beginners',
    date: '2024-03-15',
    status: 'Inactive',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@email.com',
    course: 'Yoga Philosophy',
    date: '2024-02-20',
    status: 'Active',
  },
  {
    name: 'Sneha Iyer',
    email: 'sneha.iyer@email.com',
    course: 'Upanishads: Ancient Wisdom',
    date: '2024-01-10',
    status: 'Active',
  },
];

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Students</h1>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={idx} className="border-b last:border-b-0 hover:bg-orange-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
} 