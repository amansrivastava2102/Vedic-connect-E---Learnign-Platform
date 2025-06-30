'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Users, Video, Calendar, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'instructor'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration
  const [resetEmail, setResetEmail] = useState(''); // For password reset
  const [activeTab, setActiveTab] = useState('login');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  useEffect(() => {
    // Check for type=recovery in query or hash and get tokens
    let params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    let type = params?.get('type');
    let access_token = params?.get('access_token');
    let refresh_token = params?.get('refresh_token');

    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
      if (!type) type = hashParams.get('type');
      if (!access_token) access_token = hashParams.get('access_token');
      if (!refresh_token) refresh_token = hashParams.get('refresh_token');
    }

    if (type === 'recovery' && access_token && refresh_token) {
      setRecoveryMode(true);
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) setResetError('Invalid or expired recovery link. Please request a new one.');
      });
    }
  }, []);

  const handleAuth = async (type: 'login' | 'register') => {
    setIsLoading(true);
    try {
      if (type === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("Login failed:", error.message);
          toast.error(`Login failed: ${error.message}`);
        } else if (data.user) {
          // Optionally, you can store the user's role in a profile table upon successful login/signup
          // For now, we'll just redirect.
          localStorage.setItem('userRole', userRole); // Store selected role (for this demo)
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userName', data.user.email || 'User');
          router.push('/dashboard');
        }
      } else { // Register
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              full_name: name, // Store full name as user metadata
              role: userRole, // Store role as user metadata
            },
          },
        });

        if (error) {
          console.error("Registration failed:", error.message);
          toast.error(`Registration failed: ${error.message}`);
        } else if (data.user) {
          if (data.session === null) {
            toast.info("Please check your email to confirm your account.");
          } else {
            // This case happens if email confirmation is turned OFF in Supabase.
            // User is automatically logged in but we still redirect to login page as per request.
            toast.success("Registration successful! Please log in.");
          }
          router.push('/auth'); // Redirect to the auth page (login tab by default)
        } else if (data.user === null && data.session === null) {
          // Fallback for unexpected Supabase behavior, or if email confirmation is required but no user data is returned immediately
          console.log("Signup initiated, please check your email.");
          toast.info("Signup initiated. Please check your email to confirm your account.");
          router.push('/auth');
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: redirectUrl,
      });
      if (error) {
        if (error.message.includes('User not found')) {
          toast.error("No account found with this email address.");
        } else if (error.message.includes('rate limit')) {
          toast.error("Too many requests. Please try again later.");
        } else {
          toast.error(`Password reset failed: ${error.message}`);
        }
        setResetEmail('');
      } else {
        toast.success("Password reset email sent! Check your inbox and spam folder. If you don't receive it, try again later.");
        setResetEmail('');
        setActiveTab('login');
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("A network or server error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setResetError('');
    setResetSuccess('');
    if (!newPassword || !confirmNewPassword) {
      setResetError('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long.');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setResetError(error.message);
      } else {
        setResetSuccess('Password updated! You can now log in with your new password.');
        setTimeout(() => {
          setRecoveryMode(false);
          setActiveTab('login');
        }, 2000);
      }
    } catch (err) {
      setResetError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (recoveryMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50 p-4">
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
            <CardDescription>Enter your new password below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            </div>
            {resetError && <div className="text-red-600 text-sm">{resetError}</div>}
            {resetSuccess && <div className="text-green-600 text-sm">{resetSuccess}</div>}
            <Button className="w-full vedic-gradient hover:opacity-90 transition-opacity" onClick={handlePasswordUpdate} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="p-3 rounded-full vedic-gradient">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold vedic-text-gradient">VedicConnect</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-gray-900">
              Bridging Ancient Wisdom with Modern Learning
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Join thousands of students and instructors in exploring the depths of Vedic knowledge 
              through interactive lectures, live sessions, and comprehensive study materials.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg">
              <Users className="h-6 w-6 text-orange-500" />
              <div>
                <p className="font-semibold text-gray-900">Expert Instructors</p>
                <p className="text-sm text-gray-600">Learn from authenticated scholars</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white/50 rounded-lg">
              <Video className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-semibold text-gray-900">Live Sessions</p>
                <p className="text-sm text-gray-600">Interactive learning experiences</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Authentication */}
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="reset">Reset</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="your@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={userRole} onValueChange={(value: 'student' | 'instructor') => setUserRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full vedic-gradient hover:opacity-90 transition-opacity" 
                  onClick={() => handleAuth('login')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-sm text-gray-600 hover:text-orange-600"
                    onClick={() => setActiveTab('reset')}
                  >
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="your@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={userRole} onValueChange={(value: 'student' | 'instructor') => setUserRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full vedic-gradient hover:opacity-90 transition-opacity" 
                  onClick={() => handleAuth('register')}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </TabsContent>

              <TabsContent value="reset" className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Reset Password</h3>
                  <p className="text-sm text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input 
                    id="reset-email" 
                    placeholder="your@email.com" 
                    type="email" 
                    value={resetEmail} 
                    onChange={(e) => setResetEmail(e.target.value)} 
                  />
                </div>
                <Button 
                  className="w-full vedic-gradient hover:opacity-90 transition-opacity" 
                  onClick={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-sm text-gray-600 hover:text-orange-600"
                    onClick={() => setActiveTab('login')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}