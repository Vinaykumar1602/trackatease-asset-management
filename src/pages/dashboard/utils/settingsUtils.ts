
export interface SettingsType {
  emailNotifications: boolean;
  maintenanceAlerts: boolean;
  warrantyAlerts: boolean;
  email: string;
  theme: string;
  language: string;
}

const SETTINGS_STORAGE_KEY = 'app_settings';

export const loadSettings = (): SettingsType | null => {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  return savedSettings ? JSON.parse(savedSettings) : null;
};

export const saveSettings = (settings: SettingsType): void => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};
