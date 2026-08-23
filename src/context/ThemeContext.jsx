import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'taskflow.theme';

const THEMES = { light: 'light', dark: 'dark', system: 'system' };

const resolveSystemTheme = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const readStoredTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return Object.values(THEMES).includes(stored) ? stored : null;
  } catch {
    return null;
  }
};

const applyTheme = (theme) => {
  const resolved = theme === THEMES.system ? resolveSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.style.colorScheme = resolved;
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readStoredTheme() ?? THEMES.system);
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    theme === THEMES.system ? resolveSystemTheme() : theme
  );

  useEffect(() => {
    const resolved = theme === THEMES.system ? resolveSystemTheme() : theme;
    applyTheme(theme);
    setResolvedTheme(resolved);
    if (theme !== THEMES.system) return undefined;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      applyTheme(THEMES.system);
      setResolvedTheme(resolveSystemTheme());
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  const selectTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      /* storage unavailable (private mode) - keep in-memory preference */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    selectTheme(resolvedTheme === 'dark' ? THEMES.light : THEMES.dark);
  }, [selectTheme, resolvedTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme: selectTheme, toggleTheme }),
    [theme, resolvedTheme, selectTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }
  return context;
}
