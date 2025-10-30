import { useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

function App() {
  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
