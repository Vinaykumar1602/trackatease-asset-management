
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mail, Settings as SettingsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SettingsType, loadSettings, saveSettings } from "./utils/settingsUtils";

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    emailNotifications: true,
    maintenanceAlerts: true,
    warrantyAlerts: true,
    email: "admin@company.com",
    theme: "light",
    language: "en",
  });
  
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Settings
            </CardTitle>
            <CardDescription>Configure your email preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
              />
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
