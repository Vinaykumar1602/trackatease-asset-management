
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { defaultSettings, SettingsType, applyTheme } from "./utils/settingsUtils";

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load settings from database or local storage as fallback
  useEffect(() => {
    const loadUserSettings = async () => {
      // Try to load from Supabase if user is authenticated
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('user_settings')
            .select('settings')
            .eq('user_id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data && data.settings) {
            // The data.settings is a JSONB field from Supabase
            const userSettings = data.settings as unknown;
            setSettings({ ...defaultSettings, ...userSettings as object });
            // Also update localStorage for offline access
            localStorage.setItem('app_settings', JSON.stringify(data.settings));
            return;
          }
        } catch (error) {
          console.error('Error loading settings from database:', error);
        }
      }
      
      // Fallback to localStorage if no database settings or not authenticated
      const storedSettings = localStorage.getItem('app_settings');
      if (storedSettings) {
        try {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings({ ...defaultSettings, ...parsedSettings });
        } catch (e) {
          console.error('Failed to parse stored settings', e);
          setSettings(defaultSettings);
        }
      }
    };
    
    loadUserSettings();
  }, [user]);
  
  // Save settings to database and local storage
  const saveSettings = async () => {
    setIsSaving(true);
    
    // Always save to localStorage
    localStorage.setItem('app_settings', JSON.stringify(settings));
    
    // Save to database if authenticated
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('user_settings')
          .upsert({ 
            user_id: user.id, 
            settings: settings as unknown as Record<string, unknown>,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'user_id' 
          });
          
        if (error) throw error;
        
      } catch (error) {
        console.error('Error saving settings to database:', error);
        toast({
          title: "Error",
          description: "Failed to save settings to the server. Your settings are saved locally.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }
    }
    
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated."
    });
    
    // Apply theme immediately
    applyTheme(settings.theme);
  };
  
  // Handle theme change
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme }));
    applyTheme(theme);
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
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
