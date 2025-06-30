'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Download, Upload, Search, Filter, Eye, Folder } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DocumentsPage() {
  const [userRole, setUserRole] = useState('student');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole') || 'student');
  }, []);

  const documents = [
    {
      id: 1,
      title: 'Bhagavad Gita - Complete Text with Commentary',
      course: 'Bhagavad Gita Study',
      instructor: 'Dr. Rajesh Sharma',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: '2024-01-10',
      downloads: 1250,
      description: 'Complete Sanskrit text with English translation and detailed commentary',
      category: 'Scripture',
      difficulty: 'Intermediate',
    },
    {
      id: 2,
      title: 'Sanskrit Devanagari Script Practice Sheets',
      course: 'Sanskrit Fundamentals',
      instructor: 'Prof. Meera Gupta',
      type: 'pdf',
      size: '1.8 MB',
      uploadDate: '2024-01-08',
      downloads: 890,
      description: 'Practice worksheets for learning Devanagari script writing',
      category: 'Worksheet',
      difficulty: 'Beginner',
    },
    {
      id: 3,
      title: 'Vedic Mathematics Formula Reference',
      course: 'Vedic Mathematics',
      instructor: 'Dr. Amit Patel',
      type: 'pdf',
      size: '956 KB',
      uploadDate: '2024-01-05',
      downloads: 2340,
      description: 'Comprehensive reference guide for all Vedic mathematics formulas and techniques',
      category: 'Reference',
      difficulty: 'Advanced',
    },
    {
      id: 4,
      title: 'Ayurvedic Herbs and Their Properties',
      course: 'Ayurveda Fundamentals',
      instructor: 'Dr. Priya Singh',
      type: 'docx',
      size: '3.2 MB',
      uploadDate: '2024-01-03',
      downloads: 1580,
      description: 'Detailed guide to medicinal herbs used in Ayurvedic practice',
      category: 'Study Guide',
      difficulty: 'Intermediate',
    },
    {
      id: 5,
      title: 'Meditation Postures and Techniques',
      course: 'Spiritual Practices',
      instructor: 'Swami Ananda',
      type: 'pdf',
      size: '4.1 MB',
      uploadDate: '2024-01-01',
      downloads: 3120,
      description: 'Illustrated guide to traditional meditation postures and breathing techniques',
      category: 'Manual',
      difficulty: 'Beginner',
    },
    {
      id: 6,
      title: 'Yoga Sutras of Patanjali - Analysis',
      course: 'Yoga Studies',
      instructor: 'Guru Krishnan',
      type: 'pdf',
      size: '2.7 MB',
      uploadDate: '2023-12-28',
      downloads: 2890,
      description: 'In-depth analysis and interpretation of Patanjali\'s Yoga Sutras',
      category: 'Commentary',
      difficulty: 'Advanced',
    },
    {
      id: 7,
      title: 'Vedic Calendar and Festival Guide',
      course: 'Cultural Studies',
      instructor: 'Prof. Lakshmi Devi',
      type: 'pdf',
      size: '1.5 MB',
      uploadDate: '2023-12-25',
      downloads: 1456,
      description: 'Complete guide to Vedic calendar system and important festivals',
      category: 'Reference',
      difficulty: 'Beginner',
    },
    {
      id: 8,
      title: 'Chanting Guide - Vedic Mantras',
      course: 'Spiritual Practices',
      instructor: 'Pandit Sharma',
      type: 'pdf',
      size: '2.9 MB',
      uploadDate: '2023-12-20',
      downloads: 2156,
      description: 'Pronunciation guide and meanings of essential Vedic mantras',
      category: 'Audio Guide',
      difficulty: 'Intermediate',
    },
  ];

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'pptx':
        return <FileText className="h-8 w-8 text-orange-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Scripture':
        return 'bg-purple-100 text-purple-800';
      case 'Worksheet':
        return 'bg-blue-100 text-blue-800';
      case 'Reference':
        return 'bg-indigo-100 text-indigo-800';
      case 'Study Guide':
        return 'bg-green-100 text-green-800';
      case 'Manual':
        return 'bg-orange-100 text-orange-800';
      case 'Commentary':
        return 'bg-pink-100 text-pink-800';
      case 'Audio Guide':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group documents by course
  const documentsByCourse = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.course]) {
      acc[doc.course] = [];
    }
    acc[doc.course].push(doc);
    return acc;
  }, {} as Record<string, typeof documents>);

  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloads, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userRole === 'instructor' ? 'Manage Documents' : 'Study Materials'}
            </h1>
            <p className="text-gray-600 mt-1">
              {userRole === 'instructor' 
                ? "Upload and organize course materials for your students" 
                : "Access comprehensive study materials and resources"
              }
            </p>
          </div>
          {userRole === 'instructor' && (
            <div className="mt-4 sm:mt-0">
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="vedic-gradient hover:opacity-90">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Upload New Document</DialogTitle>
                    <DialogDescription>
                      Add a new study material to your course.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="doc-title">Document Title</Label>
                      <Input id="doc-title" placeholder="Enter document title" />
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
                      <Label htmlFor="file-upload">File</Label>
                      <Input id="file-upload" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scripture">Scripture</SelectItem>
                            <SelectItem value="worksheet">Worksheet</SelectItem>
                            <SelectItem value="reference">Reference</SelectItem>
                            <SelectItem value="study-guide">Study Guide</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="commentary">Commentary</SelectItem>
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
                      <Textarea id="description" placeholder="Document description" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="vedic-gradient hover:opacity-90">
                      Upload Document
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
              placeholder="Search documents, courses, or categories..."
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
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                  <p className="text-sm text-gray-600">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-green-100">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalDownloads.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-orange-100">
                  <Folder className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(documentsByCourse).length}</p>
                  <p className="text-sm text-gray-600">Courses</p>
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
                  <p className="text-2xl font-bold text-gray-900">18.5MB</p>
                  <p className="text-sm text-gray-600">Total Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents by Course */}
        <div className="space-y-8">
          {Object.entries(documentsByCourse).map(([course, courseDocuments]) => (
            <div key={course}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg vedic-gradient">
                  <Folder className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{course}</h2>
                <Badge variant="secondary">{courseDocuments.length} documents</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseDocuments.map((document) => (
                  <Card key={document.id} className="card-hover">
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-lg bg-gray-50">
                          {getFileTypeIcon(document.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-2">{document.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className={getCategoryColor(document.category)}>
                              {document.category}
                            </Badge>
                            <Badge className={getDifficultyColor(document.difficulty)}>
                              {document.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2 mt-2">
                        {document.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>by {document.instructor}</span>
                          <span className="uppercase font-medium">{document.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{document.size}</span>
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{document.downloads.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Uploaded {new Date(document.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button className="flex-1 vedic-gradient hover:opacity-90">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
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
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}