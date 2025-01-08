import React, { useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/theme/themeSlice';
import type { RootState } from '../../redux/store'; // Make sure to create this type in your store setup

const Navbar: FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const navigate = useNavigate();

  useEffect(() => {
    // Update document class when theme changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeToggle = (): void => {
    dispatch(toggleTheme());
  };

  const handleBack = (): void => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center flex-1 gap-4">
          <button 
            onClick={handleBack}
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
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

export default Navbar;