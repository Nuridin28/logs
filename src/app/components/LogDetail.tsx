import { useParams, Link, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Bug,
  Clock,
  Server,
  Box
} from 'lucide-react';
import { mockLogs, LogLevel } from '../utils/mockLogs';

export default function LogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const log = mockLogs.find(l => l.id === id);

  if (!log) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <AlertCircle className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Log Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">The requested log entry could not be found.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Logs
        </Link>
      </div>
    );
  }

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warn':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'debug':
        return <Bug className="w-5 h-5" />;
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'warn':
        return 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'success':
        return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'debug':
        return 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatStepTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
      hour12: false
    });
  };

  const hasError = log.steps.some(step => step.level === 'error');
  const errorStepIndex = log.steps.findIndex(step => step.level === 'error');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Logs</span>
      </button>

      {/* Log Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border-2 ${getLevelColor(log.level)}`}>
                {getLevelIcon(log.level)}
                {log.level.toUpperCase()}
              </span>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white break-words">{log.message}</h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Log ID: {log.id}</p>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg flex-shrink-0">
              <Clock className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Timestamp</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white break-all">{formatTimestamp(log.timestamp)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg flex-shrink-0">
              <Box className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Container</p>
              <p className="text-sm font-medium font-mono text-slate-900 dark:text-white break-all">{log.container}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg flex-shrink-0">
              <Server className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Service</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{log.service}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Host</p>
          <p className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all">{log.host}</p>
        </div>
      </div>

      {/* Error Alert */}
      {hasError && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 p-4 mb-4 sm:mb-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900 dark:text-red-300 mb-1">Error Detected in Execution</h3>
              <p className="text-sm text-red-700 dark:text-red-400">
                An error occurred at step {errorStepIndex + 1} of {log.steps.length}. 
                Review the execution trace below for details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Execution Trace */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">Execution Trace</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6">Step-by-step execution log showing {log.steps.length} total steps</p>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

          {/* Steps */}
          <div className="space-y-4 sm:space-y-6">
            {log.steps.map((step, index) => {
              const isError = step.level === 'error';

              return (
                <div key={step.id} className="relative pl-12 sm:pl-14">
                  {/* Step Number Circle */}
                  <div className={`absolute left-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 flex items-center justify-center font-semibold text-xs sm:text-sm z-10 ${
                    isError 
                      ? 'bg-red-100 dark:bg-red-900/50 border-red-400 dark:border-red-600 text-red-700 dark:text-red-400'
                      : step.level === 'success'
                      ? 'bg-green-100 dark:bg-green-900/50 border-green-400 dark:border-green-600 text-green-700 dark:text-green-400'
                      : step.level === 'warn'
                      ? 'bg-amber-100 dark:bg-amber-900/50 border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Step Content */}
                  <div className={`border-2 rounded-lg p-3 sm:p-4 transition-all ${
                    isError
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-800 shadow-lg'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${getLevelColor(step.level)}`}>
                          {getLevelIcon(step.level)}
                          {step.level.toUpperCase()}
                        </span>
                        <h3 className={`font-medium text-sm sm:text-base break-words ${isError ? 'text-red-900 dark:text-red-300' : 'text-slate-900 dark:text-white'}`}>
                          {step.message}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                        {formatStepTime(step.timestamp)}
                      </span>
                    </div>

                    {step.details && (
                      <div className={`mt-3 p-2 sm:p-3 rounded-lg font-mono text-xs break-all ${
                        isError 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}>
                        {step.details}
                      </div>
                    )}

                    {isError && (
                      <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                        <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 font-medium">
                          ⚠️ Execution failed at this step
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 sm:p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Steps</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{log.steps.length}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 sm:p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Duration</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {(new Date(log.steps[log.steps.length - 1].timestamp).getTime() - 
                  new Date(log.steps[0].timestamp).getTime())}ms
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 sm:p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Status</p>
              <p className={`text-2xl font-semibold ${
                hasError ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'
              }`}>
                {hasError ? 'Failed' : 'Success'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}