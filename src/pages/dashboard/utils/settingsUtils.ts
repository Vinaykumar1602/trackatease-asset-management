
export interface SettingsType {
  emailNotifications: boolean;
  maintenanceAlerts: boolean;
  warrantyAlerts: boolean;
  systemUpdates: boolean;
  securityAlerts: boolean;
  taskReminders: boolean;
  darkMode: boolean;
  email: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
}

const SETTINGS_STORAGE_KEY = 'app_settings';

export const defaultSettings: SettingsType = {
  emailNotifications: true,
  maintenanceAlerts: true,
  warrantyAlerts: true,
  systemUpdates: true,
  securityAlerts: true,
  taskReminders: true,
  darkMode: false,
  email: "admin@company.com",
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'MM/DD/YYYY',
};

export const loadSettings = (): SettingsType => {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
};

export const saveSettings = (settings: SettingsType): void => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};
