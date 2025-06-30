'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { Settings as SettingsIcon, Moon, Sun, Monitor } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Example setting

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <SettingsIcon className="h-8 w-8" />
          <span>Settings</span>
        </h1>
        <p className="text-gray-600">Manage your application preferences.</p>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-select" className="text-base font-medium">Theme</Label>
              <Select value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2"><Sun className="h-4 w-4" /> Light</div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2"><Moon className="h-4 w-4" /> Dark</div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2"><Monitor className="h-4 w-4" /> System</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications-switch" className="text-base font-medium">Enable Email Notifications</Label>
              <Switch
                id="notifications-switch"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* You can add more settings sections here */}

      </div>
    </DashboardLayout>
  );
} 