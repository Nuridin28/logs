import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, ArrowRight, Network, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function RequestIdEntry() {
  const [requestId, setRequestId] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestId.trim()) {
      navigate(`/${requestId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          {/* Icon and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
              <Network className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white mb-2">
              Request Flow Visualization
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Enter a request ID to view the complete flow path
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="mb-6">
              <label 
                htmlFor="requestId" 
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Request ID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  id="requestId"
                  type="text"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  placeholder="e.g., req-001, req-003..."
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors"
                  autoFocus
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Enter the unique identifier for the request you want to trace
              </p>
            </div>

            <button
              type="submit"
              disabled={!requestId.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              View Request Flow
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Example IDs */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Try these examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['req-001', 'req-003', 'req-005'].map(id => (
                <button
                  key={id}
                  onClick={() => setRequestId(id)}
                  className="px-3 py-1.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}