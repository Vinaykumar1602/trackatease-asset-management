
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
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  }
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
  notifications: {
    email: true,
    push: true,
    inApp: true
  }
};

export const loadSettings = (): SettingsType => {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
};

export const saveSettings = (settings: SettingsType): void => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

// Apply theme based on settings
export const applyTheme = (theme: 'light' | 'dark' | 'system'): void => {
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    // System preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem('theme', 'system');
    
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

// Initialize theme based on stored settings
export const initializeTheme = (): void => {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    if (settings.theme) {
      applyTheme(settings.theme);
    }
  } else {
    // Use system preference by default
    applyTheme('system');
  }
};
