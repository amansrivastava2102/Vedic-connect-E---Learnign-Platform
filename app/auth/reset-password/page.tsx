'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleResetLink = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      let errorMessage = '';
      
      if (type === 'recovery' && accessToken && refreshToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            errorMessage = 'This reset link is invalid or has expired.';
            setIsValidLink(false);
            setError(errorMessage);
            return;
          }
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsValidLink(true);
            setError('');
            toast.success("Reset link validated. You can now set your new password.");
          } else {
            errorMessage = 'This reset link is invalid or has expired.';
            setIsValidLink(false);
            setError(errorMessage);
          }
        } catch (error) {
          console.error("Error handling reset link:", error);
          errorMessage = 'An unexpected error occurred. Please try requesting a new reset link.';
          setIsValidLink(false);
          setError(errorMessage);
        }
      } else {
        errorMessage = 'This reset link is invalid or missing required information.';
        setIsValidLink(false);
        setError(errorMessage);
      }
    };
    handleResetLink();
  }, [searchParams, router]);

  const handlePasswordReset = async () => {
    if (!isValidLink) {
      toast.error("Please use a valid reset link");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error("Password update failed:", error.message);
        toast.error(`Password update failed: ${error.message}`);
      } else {
        toast.success("Password updated successfully! You can now sign in with your new password.");
        // Sign out the user after password reset
        await supabase.auth.signOut();
        router.push('/auth');
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while validating the link
  if (!isValidLink && searchParams.get('type') === 'recovery') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
          {error && (
            <div className="mt-4 text-red-600 font-semibold">{error}</div>
          )}
          {error && (
            <button
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              onClick={() => router.push('/auth')}
            >
              Request New Link
            </button>
          )}
        </div>
      </div>
    );
  }

  if (error && !isValidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50 p-4">
        <div className="text-center">
          <div className="text-red-600 font-semibold mb-4">{error}</div>
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            onClick={() => router.push('/auth')}
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  // If not a valid reset link, show nothing (will redirect)
  if (searchParams.get('type') !== 'recovery') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 rounded-full vedic-gradient">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold vedic-text-gradient">VedicConnect</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Reset Your Password</h2>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {/* Reset Password Form */}
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">New Password</CardTitle>
            <CardDescription>
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Button
                className="w-full vedic-gradient hover:opacity-90 transition-opacity"
                onClick={handlePasswordReset}
                disabled={isLoading}
              >
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/auth')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Password must be at least 6 characters long</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 