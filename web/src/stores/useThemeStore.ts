import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

type ThemeStoreProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStoreProps>()(
  persist(
    (set, get) => ({
      theme: (() => {
        if (typeof window === 'undefined') return 'light';
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored) {
          return stored;
        }
        return document.documentElement.classList.contains('dark')
          ? 'dark'
          : 'light';
      })(),
      setTheme: (theme: Theme) => {
        set({ theme });
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'theme',
    }
  )
);

// Initialize theme on mount - sync DOM with stored theme
if (typeof window !== 'undefined') {
  const initializeTheme = () => {
    const root = document.documentElement;
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      if (stored === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  // Initialize immediately
  initializeTheme();

  // Also listen for storage events (in case theme is changed in another tab)
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      initializeTheme();
    }
  });
}
