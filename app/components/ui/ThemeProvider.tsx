import React, { createContext, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useStore } from '../../hooks/useStore';
import { Theme } from '../../types';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const { theme, toggleTheme, setTheme } = useStore();

  useEffect(() => {
    if (colorScheme) {
      setTheme(colorScheme as Theme);
    }
  }, [colorScheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider; 