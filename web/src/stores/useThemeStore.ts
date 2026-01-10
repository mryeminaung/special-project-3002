import { create } from 'zustand';

type Theme = 'light' | 'dark';

type ThemeStoreProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored) {
    const root = document.documentElement;
    if (stored === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    return stored;
  }

  // Default to light
  return 'light';
};

export const useThemeStore = create<ThemeStoreProps>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme: Theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
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
}));
