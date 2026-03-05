import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { 
  ArrowUpDown, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Bug,
  Eye
} from 'lucide-react';
import { mockLogs, logFields as initialFields, Log, LogLevel } from '../utils/mockLogs';
import FieldSelector from './FieldSelector';
import Pagination from './Pagination';

type SortField = 'timestamp' | 'container' | 'service' | 'level';
type SortDirection = 'asc' | 'desc';

export default function LogsOverview() {
  const { requestId } = useParams<{ requestId: string }>();
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [fields, setFields] = useState(initialFields.map(f => ({ ...f })));
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sortedLogs = useMemo(() => {
    // First filter by requestId
    let filtered = mockLogs.filter(log => log.requestId === requestId);
    
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    return filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'timestamp') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortField, sortDirection, selectedLevel, requestId]);

  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedLogs.slice(startIndex, endIndex);
  }, [sortedLogs, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'debug':
        return <Bug className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'warn':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'debug':
        return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const enabledFields = fields.filter(f => f.enabled);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white mb-2">Logs Overview</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Monitor and analyze system logs in real-time</p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by level:</span>
            <div className="flex flex-wrap gap-2">
              {(['all', 'error', 'warn', 'info', 'success', 'debug'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <FieldSelector fields={fields} onFieldsChange={setFields} />
        </div>
      </div>

      {/* Logs Table - Desktop */}
      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {enabledFields.map(field => (
                  <th
                    key={field.key}
                    className="px-4 py-3 text-left"
                  >
                    <button
                      onClick={() => handleSort(field.key as SortField)}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    >
                      {field.label}
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-left">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {paginatedLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {enabledFields.map(field => (
                    <td key={field.key} className="px-4 py-3">
                      {field.key === 'timestamp' && (
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      )}
                      {field.key === 'level' && (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getLevelColor(log.level)}`}>
                          {getLevelIcon(log.level)}
                          {log.level.toUpperCase()}
                        </span>
                      )}
                      {field.key === 'container' && (
                        <span className="text-sm font-mono text-slate-700 dark:text-slate-300">
                          {log.container}
                        </span>
                      )}
                      {field.key === 'service' && (
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {log.service}
                        </span>
                      )}
                      {field.key === 'message' && (
                        <span className="text-sm text-slate-900 dark:text-white">
                          {log.message}
                        </span>
                      )}
                      {field.key === 'host' && (
                        <span className="text-sm font-mono text-slate-600 dark:text-slate-400">
                          {log.host}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Link
                      to={`/${requestId}/log/${log.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {paginatedLogs.map((log) => (
          <div key={log.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getLevelColor(log.level)}`}>
                {getLevelIcon(log.level)}
                {log.level.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatTimestamp(log.timestamp)}
              </span>
            </div>
            
            <h3 className="font-medium text-slate-900 dark:text-white mb-2 line-clamp-2">{log.message}</h3>
            
            <div className="space-y-1.5 mb-3 text-sm">
              {enabledFields.map(field => {
                if (field.key === 'timestamp' || field.key === 'level' || field.key === 'message') return null;
                
                return (
                  <div key={field.key} className="flex items-center justify-between gap-2">
                    <span className="text-slate-600 dark:text-slate-400 text-xs">{field.label}:</span>
                    {field.key === 'container' && (
                      <span className="font-mono text-slate-900 dark:text-white text-xs break-all">{log.container}</span>
                    )}
                    {field.key === 'service' && (
                      <span className="text-slate-900 dark:text-white text-xs">{log.service}</span>
                    )}
                    {field.key === 'host' && (
                      <span className="font-mono text-slate-700 dark:text-slate-300 text-xs break-all">{log.host}</span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <Link
              to={`/${requestId}/log/${log.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors w-full justify-center"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
          </div>
        ))}
      </div>

      {paginatedLogs.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <Info className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">No logs found matching your filters</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPage={itemsPerPage}
        totalItems={sortedLogs.length}
      />
    </div>
  );
}