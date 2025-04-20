
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Settings as SettingsIcon, Globe, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SettingsType, loadSettings, saveSettings, defaultSettings } from "./utils/settingsUtils";

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = loadSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleSettingChange = (key: keyof SettingsType, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      saveSettings(newSettings);
      return newSettings;
    });
  };

  const handleSaveSettings = () => {
    saveSettings(settings);
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you want to receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-alerts">Maintenance Alerts</Label>
              <Switch
                id="maintenance-alerts"
                checked={settings.maintenanceAlerts}
                onCheckedChange={(checked) => handleSettingChange('maintenanceAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="warranty-alerts">Warranty Expiration Alerts</Label>
              <Switch
                id="warranty-alerts"
                checked={settings.warrantyAlerts}
                onCheckedChange={(checked) => handleSettingChange('warrantyAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="system-updates">System Updates</Label>
              <Switch
                id="system-updates"
                checked={settings.systemUpdates}
                onCheckedChange={(checked) => handleSettingChange('systemUpdates', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="security-alerts">Security Alerts</Label>
              <Switch
                id="security-alerts"
                checked={settings.securityAlerts}
                onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="task-reminders">Task Reminders</Label>
              <Switch
                id="task-reminders"
                checked={settings.taskReminders}
                onCheckedChange={(checked) => handleSettingChange('taskReminders', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Localization
            </CardTitle>
            <CardDescription>Configure your regional preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="language">Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => handleSettingChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleSettingChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select
                value={settings.dateFormat}
                onValueChange={(value) => handleSettingChange('dateFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
