import { useEffect, useState } from 'react';

// Hook to manage dark mode preference with persistence and system preference
export default function useDarkMode() {
  const getInitial = () => {
    const stored = localStorage.getItem('greencart_darkmode');
    if (stored !== null) return stored === 'true';
    // respect user system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState(getInitial);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('greencart_darkmode', String(darkMode));
  }, [darkMode]);

  return [darkMode, setDarkMode];
}
