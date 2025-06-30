'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function TestApiPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testEndpoints = [
    { name: 'Courses API', test: () => api.courses.getAll() },
    { name: 'Events API', test: () => api.events.getAll() },
    { name: 'Documents API', test: () => api.documents.getAll() },
    { name: 'Live Sessions API', test: () => api.liveSessions.getAll() },
    { name: 'Enrollments API', test: () => api.enrollments.getMyEnrollments() },
  ];

  const runTest = async (endpointName: string, testFn: () => Promise<any>) => {
    setLoading(endpointName);
    try {
      const result = await testFn();
      setResults((prev: any) => ({
        ...prev,
        [endpointName]: result
      }));
    } catch (error: any) {
      setResults((prev: any) => ({
        ...prev,
        [endpointName]: { error: error.message }
      }));
    } finally {
      setLoading(null);
    }
  };

  const runAllTests = async () => {
    setLoading('all');
    const allResults: any = {};
    
    for (const endpoint of testEndpoints) {
      try {
        const result = await endpoint.test();
        allResults[endpoint.name] = result;
      } catch (error: any) {
        allResults[endpoint.name] = { error: error.message };
      }
    }
    
    setResults(allResults);
    setLoading(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">API Test Page</h1>
        <p className="text-gray-600">Test your backend API endpoints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={runAllTests} 
              disabled={loading === 'all'}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading === 'all' ? 'Testing...' : 'Test All Endpoints'}
            </Button>
            
            {testEndpoints.map((endpoint) => (
              <Button
                key={endpoint.name}
                onClick={() => runTest(endpoint.name, endpoint.test)}
                disabled={loading === endpoint.name}
                variant="outline"
              >
                {loading === endpoint.name ? 'Testing...' : endpoint.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {Object.entries(results).map(([endpointName, result]) => (
          <Card key={endpointName}>
            <CardHeader>
              <CardTitle className="text-lg">{endpointName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(results).length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No test results yet. Click "Test All Endpoints" to start.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 