
import { useEffect } from "react";
import { initializeTheme } from "@/pages/settings/utils/settingsUtils";

export function AppInitializer() {
  useEffect(() => {
    // Initialize theme based on saved settings
    initializeTheme();

    // Set up listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'system') {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
