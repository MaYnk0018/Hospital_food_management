import React from 'react';
import { Moon, Sun } from 'lucide-react';

const Header = () => {
  const [theme, setTheme] = React.useState('light');

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex h-16 items-center justify-between px-4">
        <span className="text-2xl font-serif text-indigo-600">
          Hospital Food Manager
        </span>
        
        <div className="flex items-center gap-4">
          <span>
          <div>
            
          </div>
          </span>
          <button
            onClick={handleThemeToggle}
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Hospital Management
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;