
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

// Define settings interface
interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  language: string;
  dateFormat: string;
}

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      inApp: true,
    },
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
  });
  
  // Load settings from local storage
  useEffect(() => {
    const storedSettings = localStorage.getItem('user_settings');
    
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
      } catch (e) {
        console.error('Failed to parse stored settings', e);
      }
    }
  }, []);
  
  // Save settings to local storage
  const saveSettings = () => {
    localStorage.setItem('user_settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated."
    });
  };
  
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme }));
    
    // Apply theme immediately
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };
  
  const handleNotificationChange = (key: keyof typeof settings.notifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences.</p>
      </div>
      
      <Tabs defaultValue="appearance">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the application appearance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-light">Light Theme</Label>
                  <Switch
                    id="theme-light"
                    checked={settings.theme === 'light'}
                    onCheckedChange={() => handleThemeChange('light')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-dark">Dark Theme</Label>
                  <Switch
                    id="theme-dark"
                    checked={settings.theme === 'dark'}
                    onCheckedChange={() => handleThemeChange('dark')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-system">Use System Preference</Label>
                  <Switch
                    id="theme-system"
                    checked={settings.theme === 'system'}
                    onCheckedChange={() => handleThemeChange('system')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications-email">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="notifications-email"
                    checked={settings.notifications.email}
                    onCheckedChange={(value) => handleNotificationChange('email', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications-push">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch
                    id="notifications-push"
                    checked={settings.notifications.push}
                    onCheckedChange={(value) => handleNotificationChange('push', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications-inapp">In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                  </div>
                  <Switch
                    id="notifications-inapp"
                    checked={settings.notifications.inApp}
                    onCheckedChange={(value) => handleNotificationChange('inApp', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="localization" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Language & Format</CardTitle>
              <CardDescription>Configure language and display preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}
                  >
                    <SelectTrigger id="date-format" className="w-full">
                      <SelectValue placeholder="Select Date Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={saveSettings}>Save Settings</Button>
      </div>
    </div>
  );
}
