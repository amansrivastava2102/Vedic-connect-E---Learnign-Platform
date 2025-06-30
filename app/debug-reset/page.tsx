'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugResetPage() {
  const searchParams = useSearchParams();
  
  // Get all URL parameters
  const allParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    allParams[key] = value;
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Password Reset Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Current URL Parameters:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(allParams, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Current URL:</h3>
              <p className="bg-gray-100 p-4 rounded text-sm break-all">
                {typeof window !== 'undefined' ? window.location.href : 'Loading...'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Expected Parameters for Password Reset:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><code>type=recovery</code> - Should be present for password reset</li>
                <li><code>access_token</code> - Supabase access token</li>
                <li><code>refresh_token</code> - Supabase refresh token</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Status:</h3>
              <div className="space-y-2">
                <p>
                  <strong>Has type=recovery:</strong> {allParams.type === 'recovery' ? '✅ Yes' : '❌ No'}
                </p>
                <p>
                  <strong>Has access_token:</strong> {allParams.access_token ? '✅ Yes' : '❌ No'}
                </p>
                <p>
                  <strong>Has refresh_token:</strong> {allParams.refresh_token ? '✅ Yes' : '❌ No'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>If all parameters are present, the reset should work</li>
                <li>If parameters are missing, check your Supabase email settings</li>
                <li>Make sure the redirect URL in your auth page is correct</li>
                <li>Check if your Supabase project has email templates configured</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 