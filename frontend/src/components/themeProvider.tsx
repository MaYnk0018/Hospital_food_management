import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; 


interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  // Get the theme from the Redux store with correct type
  const { theme } = useSelector((state: RootState) => state.theme);

  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
}
