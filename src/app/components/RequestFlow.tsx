import { useParams, Link } from 'react-router';
import { useState, useMemo } from 'react';
import { 
  Smartphone, 
  Globe, 
  Server, 
  Database, 
  Layers,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import { mockLogs, RequestFlowNode } from '../utils/mockLogs';
import Pagination from './Pagination';

export default function RequestFlow() {
  const { requestId } = useParams<{ requestId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Find the log matching the request ID
  const selectedLog = mockLogs.find(log => log.requestId === requestId);

  const totalNodes = selectedLog?.requestFlow?.length || 0;
  const totalPages = Math.ceil(totalNodes / itemsPerPage);
  
  const paginatedNodes = useMemo(() => {
    if (!selectedLog?.requestFlow) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return selectedLog.requestFlow.slice(startIndex, endIndex);
  }, [selectedLog, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getNodeIcon = (type: RequestFlowNode['type']) => {
    switch (type) {
      case 'client':
        return <Smartphone className="w-5 h-5" />;
      case 'gateway':
        return <Globe className="w-5 h-5" />;
      case 'service':
        return <Server className="w-5 h-5" />;
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'cache':
        return <Layers className="w-5 h-5" />;
      case 'external':
        return <Globe className="w-5 h-5" />;
    }
  };

  const getNodeColor = (status: RequestFlowNode['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800 text-green-700 dark:text-green-400';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400';
      case 'pending':
        return 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getNodeBorderColor = (status: RequestFlowNode['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-400 dark:border-green-600';
      case 'error':
        return 'border-red-400 dark:border-red-600';
      case 'pending':
        return 'border-slate-400 dark:border-slate-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white mb-2">Request Flow</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Complete trace from source to destination</p>
      </div>

      {/* Flow Visualization */}
      {selectedLog && selectedLog.requestFlow ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex-1">
              <h3 className="font-semibold text-lg sm:text-xl text-slate-900 dark:text-white mb-1">
                {selectedLog.service}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{selectedLog.message}</p>
            </div>
            <Link
              to={`/${requestId}/log/${selectedLog.id}`}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View Full Log</span>
              <span className="sm:hidden">Details</span>
            </Link>
          </div>

          {/* Flow Diagram */}
          <div className="space-y-4 sm:space-y-6">
            {paginatedNodes.map((node, index) => (
              <div key={node.id}>
                {/* Node Card */}
                <div className={`border-2 rounded-lg p-3 sm:p-4 ${getNodeColor(node.status)}`}>
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`p-2 sm:p-2.5 rounded-lg bg-white dark:bg-slate-900 border-2 flex-shrink-0 ${getNodeBorderColor(node.status)}`}>
                      {getNodeIcon(node.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base sm:text-lg mb-0.5">{node.name}</h4>
                          <p className="text-xs sm:text-sm opacity-80 capitalize">{node.type}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {node.status === 'success' && (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                          {node.status === 'error' && (
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <p className="text-xs sm:text-sm font-mono bg-white/50 dark:bg-slate-900/50 px-2 py-1 rounded break-all">
                          {node.details}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(node.timestamp).toLocaleTimeString()}</span>
                          </div>
                          {node.duration !== undefined && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Duration:</span>
                              <span>{node.duration}ms</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                {index < paginatedNodes.length - 1 && (
                  <div className="flex justify-center py-2 sm:py-3">
                    <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      node.status === 'error' ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-slate-600'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalNodes}
          />

          {/* Summary */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Request Summary</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Hops</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {selectedLog.requestFlow.length}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Duration</p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {selectedLog.requestFlow[selectedLog.requestFlow.length - 1].duration || 0}ms
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 col-span-2 sm:col-span-1">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Status</p>
                <p className={`text-xl sm:text-2xl font-semibold ${
                  selectedLog.level === 'error' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'
                }`}>
                  {selectedLog.level === 'error' ? 'Failed' : 'Success'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 dark:text-slate-600 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Request Not Found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No request flow data found for ID: <span className="font-mono font-semibold">{requestId}</span>
          </p>
        </div>
      )}
    </div>
  );
}