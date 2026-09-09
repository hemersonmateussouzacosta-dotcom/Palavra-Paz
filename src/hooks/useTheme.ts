import { useState, useEffect, useCallback } from 'react';
import { ThemeMode } from '../types';
import { StorageService } from '../services/storageService';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => StorageService.getThemePreference());
  const [isDark, setIsDark] = useState<boolean>(() => StorageService.resolveIsDark(theme));

  // Function to apply theme class and meta theme-color to document
  const applyTheme = useCallback((mode: ThemeMode) => {
    const effectiveDark = StorageService.resolveIsDark(mode);
    setIsDark(effectiveDark);

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (effectiveDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }

      // Update mobile browser status bar / theme-color meta tag
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', effectiveDark ? '#0c0a09' : '#78350f');
      }
    }
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    StorageService.setThemePreference(newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  // Initial mount and system/timer listener
  useEffect(() => {
    applyTheme(theme);

    // If auto, listen to system dark mode changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleMediaChange = () => {
        if (theme === 'auto') {
          applyTheme('auto');
        }
      };

      mediaQuery.addEventListener('change', handleMediaChange);

      // Check time transitions every 2 minutes for night-time auto shift
      const interval = setInterval(() => {
        if (theme === 'auto') {
          applyTheme('auto');
        }
      }, 120000);

      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
        clearInterval(interval);
      };
    }
  }, [theme, applyTheme]);

  return {
    theme,
    isDark,
    setTheme
  };
}
