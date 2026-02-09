import React, { createContext, useContext, useState, useEffect } from 'react';

export type OfficeType = 'morning' | 'midday' | 'evening' | 'compline' | 'lectionary';

interface AppContextType {
  theme: string;
  toggleTheme: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  currentOffice: OfficeType;
  setCurrentOffice: (office: OfficeType) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Theme State
  const [theme, setTheme] = useState<string>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Sidebar State -- default closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Office State -- always calculate based on time for fresh entry
  const [currentOffice, setCurrentOffice] = useState<OfficeType>(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "morning";
    if (hour >= 11 && hour < 14) return "midday";
    if (hour >= 14 && hour < 20) return "evening";
    return "compline";
  });

  // Apply theme to document
  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark-mode');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
    // REMOVED: localStorage.setItem('theme', theme); 
    // We only save when user explicitly toggles.
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme); // Explicitly save user choice
      return newTheme;
    });
  };
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      isSidebarOpen, toggleSidebar, closeSidebar,
      currentOffice, setCurrentOffice
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
