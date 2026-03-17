import type { Log } from '../components/RequestFlow';

export type { Log, FlowNode, FlowEdge, LogLevel } from '../components/RequestFlow';

export const mockLogs: Log[] = [
  {
    id: '1',
    timestamp: '2026-03-02T10:15:23.456Z',
    container: 'api-gateway-01',
    service: 'API Gateway',
    level: 'error',
    message: 'Failed to process payment transaction',
    host: 'srv-prod-01.us-east',
    requestId: 'req-001',
    requestFlow: {
      nodes: [
        { id: 'n-1-1', name: 'Mobile App', type: 'client', status: 'success' },
        { id: 'n-1-2', name: 'API Gateway', type: 'gateway', status: 'success' },
        { id: 'n-1-3', name: 'Payment Service', type: 'service', status: 'success' },
        { id: 'n-1-4', name: 'Payment Processor', type: 'external', status: 'error' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-1-1', from: 'Mobile App', to: 'API Gateway', type: 'request', timestamp: '2026-03-02T10:15:23.000Z', status: 'success', label: 'POST /api/payments - User initiated payment' },
        { id: 'e-1-2', from: 'API Gateway', to: 'Payment Service', type: 'request', timestamp: '2026-03-02T10:15:23.050Z', status: 'success', label: 'Request authenticated and routed' },
        { id: 'e-1-3', from: 'Payment Service', to: 'Payment Processor', type: 'request', timestamp: '2026-03-02T10:15:23.150Z', status: 'success', label: 'Validating payment details' },
        // response arrows (backward) — error skips intermediaries, goes directly back
        { id: 'e-1-4', from: 'Payment Processor', to: 'Mobile App', type: 'response', timestamp: '2026-03-02T10:15:23.350Z', status: 'error', duration: 3000, label: 'Connection timeout - External API unreachable', isErrorSource: true },
      ]
    }
  },
  {
    id: '2',
    timestamp: '2026-03-02T10:14:18.789Z',
    container: 'auth-service-02',
    service: 'Authentication',
    level: 'success',
    message: 'User login successful',
    host: 'srv-prod-02.us-east',
    requestId: 'req-002',
    requestFlow: {
      nodes: [
        { id: 'n-2-1', name: 'Web Browser', type: 'client', status: 'success' },
        { id: 'n-2-2', name: 'Load Balancer', type: 'gateway', status: 'success' },
        { id: 'n-2-3', name: 'Auth Service', type: 'service', status: 'success' },
        { id: 'n-2-4', name: 'User Database', type: 'database', status: 'success' },
        { id: 'n-2-5', name: 'Redis Cache', type: 'cache', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-2-1', from: 'Web Browser', to: 'Load Balancer', type: 'request', timestamp: '2026-03-02T10:14:18.000Z', status: 'success', label: 'POST /api/auth/login' },
        { id: 'e-2-2', from: 'Load Balancer', to: 'Auth Service', type: 'request', timestamp: '2026-03-02T10:14:18.100Z', status: 'success', label: 'Forwarding to auth service' },
        { id: 'e-2-3', from: 'Auth Service', to: 'User Database', type: 'request', timestamp: '2026-03-02T10:14:18.150Z', status: 'success', label: 'Processing authentication' },
        { id: 'e-2-4', from: 'Auth Service', to: 'Redis Cache', type: 'request', timestamp: '2026-03-02T10:14:18.680Z', status: 'success', label: 'Storing session token' },
        // response arrows (backward)
        { id: 'e-2-5', from: 'User Database', to: 'Auth Service', type: 'response', timestamp: '2026-03-02T10:14:18.200Z', status: 'success', duration: 350, label: '350ms' },
        { id: 'e-2-6', from: 'Redis Cache', to: 'Auth Service', type: 'response', timestamp: '2026-03-02T10:14:18.680Z', status: 'success', duration: 9, label: '9ms' },
        { id: 'e-2-7', from: 'Auth Service', to: 'Load Balancer', type: 'response', timestamp: '2026-03-02T10:14:18.150Z', status: 'success', duration: 530, label: '530ms' },
        { id: 'e-2-8', from: 'Load Balancer', to: 'Web Browser', type: 'response', timestamp: '2026-03-02T10:14:18.100Z', status: 'success', duration: 50, label: '50ms' },
      ]
    }
  },
  {
    id: '3',
    timestamp: '2026-03-02T10:13:45.123Z',
    container: 'database-01',
    service: 'Database',
    level: 'warn',
    message: 'Slow query detected',
    host: 'db-prod-01.us-east',
    requestId: 'req-003',
    requestFlow: {
      nodes: [
        { id: 'n-3-1', name: 'Admin Dashboard', type: 'client', status: 'success' },
        { id: 'n-3-2', name: 'API Gateway', type: 'gateway', status: 'success' },
        { id: 'n-3-3', name: 'Analytics Service', type: 'service', status: 'success' },
        { id: 'n-3-4', name: 'PostgreSQL', type: 'database', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-3-1', from: 'Admin Dashboard', to: 'API Gateway', type: 'request', timestamp: '2026-03-02T10:13:40.000Z', status: 'success', label: 'GET /api/users/report' },
        { id: 'e-3-2', from: 'API Gateway', to: 'Analytics Service', type: 'request', timestamp: '2026-03-02T10:13:40.050Z', status: 'success', label: 'Routing to analytics service' },
        { id: 'e-3-3', from: 'Analytics Service', to: 'PostgreSQL', type: 'request', timestamp: '2026-03-02T10:13:40.100Z', status: 'success', label: 'Generating user report' },
        // response arrows (backward)
        { id: 'e-3-4', from: 'PostgreSQL', to: 'Analytics Service', type: 'response', timestamp: '2026-03-02T10:13:40.150Z', status: 'success', duration: 4973, label: '4973ms' },
        { id: 'e-3-5', from: 'Analytics Service', to: 'API Gateway', type: 'response', timestamp: '2026-03-02T10:13:40.100Z', status: 'success', duration: 5023, label: '5023ms' },
        { id: 'e-3-6', from: 'API Gateway', to: 'Admin Dashboard', type: 'response', timestamp: '2026-03-02T10:13:40.050Z', status: 'success', duration: 5073, label: '5073ms' },
      ]
    }
  },
  {
    id: '4',
    timestamp: '2026-03-02T10:12:30.456Z',
    container: 'worker-service-03',
    service: 'Background Worker',
    level: 'error',
    message: 'Failed to process job from queue',
    host: 'srv-prod-03.us-east',
    requestId: 'req-004',
    requestFlow: {
      nodes: [
        { id: 'n-4-1', name: 'Job Queue', type: 'cache', status: 'success' },
        { id: 'n-4-2', name: 'Worker Service', type: 'service', status: 'success' },
        { id: 'n-4-3', name: 'Template Service', type: 'service', status: 'error' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-4-1', from: 'Job Queue', to: 'Worker Service', type: 'request', timestamp: '2026-03-02T10:12:30.000Z', status: 'success', label: 'Dequeued job: send_email_campaign_1234' },
        { id: 'e-4-2', from: 'Worker Service', to: 'Template Service', type: 'request', timestamp: '2026-03-02T10:12:30.100Z', status: 'success', label: 'Processing email job' },
        // response arrows (backward)
        { id: 'e-4-3', from: 'Template Service', to: 'Worker Service', type: 'response', timestamp: '2026-03-02T10:12:30.200Z', status: 'error', duration: 180, label: 'Template rendering failed', isErrorSource: true },
        { id: 'e-4-4', from: 'Worker Service', to: 'Job Queue', type: 'response', timestamp: '2026-03-02T10:12:30.100Z', status: 'error', duration: 280, label: '280ms' },
      ]
    }
  },
  {
    id: '5',
    timestamp: '2026-03-02T10:11:15.789Z',
    container: 'cache-service-01',
    service: 'Redis Cache',
    level: 'success',
    message: 'Cache cleared successfully',
    host: 'srv-staging-01.us-west',
    requestId: 'req-005',
    requestFlow: {
      nodes: [
        { id: 'n-5-1', name: 'CLI Tool', type: 'client', status: 'success' },
        { id: 'n-5-2', name: 'Cache Service', type: 'service', status: 'success' },
        { id: 'n-5-3', name: 'Redis', type: 'cache', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-5-1', from: 'CLI Tool', to: 'Cache Service', type: 'request', timestamp: '2026-03-02T10:11:15.000Z', status: 'success', label: 'Command: cache-clear --pattern user:session:*' },
        { id: 'e-5-2', from: 'Cache Service', to: 'Redis', type: 'request', timestamp: '2026-03-02T10:11:15.100Z', status: 'success', label: 'Executing cache clear operation' },
        // response arrows (backward)
        { id: 'e-5-3', from: 'Redis', to: 'Cache Service', type: 'response', timestamp: '2026-03-02T10:11:15.200Z', status: 'success', duration: 589, label: '589ms' },
        { id: 'e-5-4', from: 'Cache Service', to: 'CLI Tool', type: 'response', timestamp: '2026-03-02T10:11:15.100Z', status: 'success', duration: 689, label: '689ms' },
      ]
    }
  },
  {
    id: '6',
    timestamp: '2026-03-02T10:10:05.234Z',
    container: 'api-gateway-02',
    service: 'API Gateway',
    level: 'info',
    message: 'Health check completed',
    host: 'srv-prod-02.us-east',
    requestId: 'req-006',
    requestFlow: {
      nodes: [
        { id: 'n-6-1', name: 'Monitoring System', type: 'external', status: 'success' },
        { id: 'n-6-2', name: 'API Gateway', type: 'gateway', status: 'success' },
        { id: 'n-6-3', name: 'Database', type: 'database', status: 'success' },
        { id: 'n-6-4', name: 'Redis Cache', type: 'cache', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-6-1', from: 'Monitoring System', to: 'API Gateway', type: 'request', timestamp: '2026-03-02T10:10:05.000Z', status: 'success', label: 'GET /health' },
        { id: 'e-6-2', from: 'API Gateway', to: 'Database', type: 'request', timestamp: '2026-03-02T10:10:05.050Z', status: 'success', label: 'Running health checks' },
        { id: 'e-6-3', from: 'API Gateway', to: 'Redis Cache', type: 'request', timestamp: '2026-03-02T10:10:05.150Z', status: 'success', label: 'Running health checks' },
        // response arrows (backward)
        { id: 'e-6-4', from: 'Database', to: 'API Gateway', type: 'response', timestamp: '2026-03-02T10:10:05.100Z', status: 'success', duration: 50, label: 'Ping: 12ms' },
        { id: 'e-6-5', from: 'Redis Cache', to: 'API Gateway', type: 'response', timestamp: '2026-03-02T10:10:05.150Z', status: 'success', duration: 30, label: 'Ping: 8ms' },
        { id: 'e-6-6', from: 'API Gateway', to: 'Monitoring System', type: 'response', timestamp: '2026-03-02T10:10:05.050Z', status: 'success', duration: 184, label: '184ms' },
      ]
    }
  },
  {
    id: '7',
    timestamp: '2026-03-02T10:09:45.567Z',
    container: 'notification-service-01',
    service: 'Notifications',
    level: 'error',
    message: 'Failed to send push notification',
    host: 'srv-prod-04.us-east',
    requestId: 'req-007',
    requestFlow: {
      nodes: [
        { id: 'n-7-1', name: 'Mobile App', type: 'client', status: 'success' },
        { id: 'n-7-2', name: 'Notification Service', type: 'service', status: 'success' },
        { id: 'n-7-3', name: 'FCM (Firebase)', type: 'external', status: 'error' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-7-1', from: 'Mobile App', to: 'Notification Service', type: 'request', timestamp: '2026-03-02T10:09:45.000Z', status: 'success', label: 'Triggered by order shipment' },
        { id: 'e-7-2', from: 'Notification Service', to: 'FCM (Firebase)', type: 'request', timestamp: '2026-03-02T10:09:45.100Z', status: 'success', label: 'Preparing push notification' },
        // response arrows (backward)
        { id: 'e-7-3', from: 'FCM (Firebase)', to: 'Notification Service', type: 'response', timestamp: '2026-03-02T10:09:45.250Z', status: 'error', duration: 317, label: 'Device token invalid', isErrorSource: true },
        { id: 'e-7-4', from: 'Notification Service', to: 'Mobile App', type: 'response', timestamp: '2026-03-02T10:09:45.100Z', status: 'error', duration: 467, label: '467ms' },
      ]
    }
  },
  {
    id: '8',
    timestamp: '2026-03-02T10:08:20.890Z',
    container: 'file-storage-01',
    service: 'File Storage',
    level: 'success',
    message: 'File upload completed',
    host: 'srv-prod-05.us-east',
    requestId: 'req-008',
    requestFlow: {
      nodes: [
        { id: 'n-8-1', name: 'Web Browser', type: 'client', status: 'success' },
        { id: 'n-8-2', name: 'API Gateway', type: 'gateway', status: 'success' },
        { id: 'n-8-3', name: 'Storage Service', type: 'service', status: 'success' },
        { id: 'n-8-4', name: 'AWS S3', type: 'external', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-8-1', from: 'Web Browser', to: 'API Gateway', type: 'request', timestamp: '2026-03-02T10:08:18.000Z', status: 'success', label: 'POST /api/files/upload' },
        { id: 'e-8-2', from: 'API Gateway', to: 'Storage Service', type: 'request', timestamp: '2026-03-02T10:08:18.100Z', status: 'success', label: 'Routing to storage service' },
        { id: 'e-8-3', from: 'Storage Service', to: 'AWS S3', type: 'request', timestamp: '2026-03-02T10:08:18.200Z', status: 'success', label: 'Validating and processing file' },
        // response arrows (backward)
        { id: 'e-8-4', from: 'AWS S3', to: 'Storage Service', type: 'response', timestamp: '2026-03-02T10:08:19.800Z', status: 'success', duration: 1090, label: '1090ms' },
        { id: 'e-8-5', from: 'Storage Service', to: 'API Gateway', type: 'response', timestamp: '2026-03-02T10:08:18.200Z', status: 'success', duration: 2690, label: '2690ms' },
        { id: 'e-8-6', from: 'API Gateway', to: 'Web Browser', type: 'response', timestamp: '2026-03-02T10:08:18.100Z', status: 'success', duration: 2790, label: '2790ms' },
      ]
    }
  },
  // Additional logs for req-001
  {
    id: '9',
    timestamp: '2026-03-02T10:15:24.123Z',
    container: 'payment-service-01',
    service: 'Payment Service',
    level: 'error',
    message: 'Payment retry mechanism activated',
    host: 'srv-prod-06.us-east',
    requestId: 'req-001',
    requestFlow: { nodes: [], edges: [] }
  },
  {
    id: '10',
    timestamp: '2026-03-02T10:15:25.456Z',
    container: 'payment-service-01',
    service: 'Payment Service',
    level: 'error',
    message: 'Payment retry failed',
    host: 'srv-prod-06.us-east',
    requestId: 'req-001',
    requestFlow: { nodes: [], edges: [] }
  },
  {
    id: '11',
    timestamp: '2026-03-02T10:15:26.789Z',
    container: 'api-gateway-01',
    service: 'API Gateway',
    level: 'warn',
    message: 'Sending error response to client',
    host: 'srv-prod-01.us-east',
    requestId: 'req-001',
    requestFlow: { nodes: [], edges: [] }
  },
  {
    id: '12',
    timestamp: '2026-03-02T10:15:27.234Z',
    container: 'monitoring-service',
    service: 'Monitoring',
    level: 'error',
    message: 'Alert triggered: Payment processor down',
    host: 'srv-monitoring-01.us-east',
    requestId: 'req-001',
    requestFlow: { nodes: [], edges: [] }
  },
  // More logs for req-002
  {
    id: '13',
    timestamp: '2026-03-02T10:14:19.123Z',
    container: 'session-manager-01',
    service: 'Session Manager',
    level: 'success',
    message: 'Session created successfully',
    host: 'srv-prod-07.us-east',
    requestId: 'req-002',
    requestFlow: { nodes: [], edges: [] }
  },
  {
    id: '14',
    timestamp: '2026-03-02T10:14:19.456Z',
    container: 'analytics-service-01',
    service: 'Analytics',
    level: 'info',
    message: 'User login event tracked',
    host: 'srv-prod-08.us-east',
    requestId: 'req-002',
    requestFlow: { nodes: [], edges: [] }
  },
  {
    id: '15',
    timestamp: '2026-03-02T10:14:19.789Z',
    container: 'audit-log-01',
    service: 'Audit Log',
    level: 'info',
    message: 'Login event logged',
    host: 'srv-prod-09.us-east',
    requestId: 'req-002',
    requestFlow: { nodes: [], edges: [] }
  },
  // More logs for req-003
  {
    id: '16',
    timestamp: '2026-03-02T10:13:46.234Z',
    container: 'database-01',
    service: 'Database',
    level: 'warn',
    message: 'Query optimization suggestion',
    host: 'db-prod-01.us-east',
    requestId: 'req-003',
    requestFlow: { nodes: [], edges: [] }
  },
  {
    id: '17',
    timestamp: '2026-03-02T10:13:47.567Z',
    container: 'cache-service-02',
    service: 'Redis Cache',
    level: 'info',
    message: 'Query result cached',
    host: 'srv-prod-10.us-east',
    requestId: 'req-003',
    requestFlow: { nodes: [], edges: [] }
  },
  // Additional varied logs
  {
    id: '18',
    timestamp: '2026-03-02T09:45:12.345Z',
    container: 'search-service-01',
    service: 'Search Service',
    level: 'success',
    message: 'Product search completed',
    host: 'srv-prod-11.us-east',
    requestId: 'req-009',
    requestFlow: {
      nodes: [
        { id: 'n-9-1', name: 'Mobile App', type: 'client', status: 'success' },
        { id: 'n-9-2', name: 'API Gateway', type: 'gateway', status: 'success' },
        { id: 'n-9-3', name: 'Search Service', type: 'service', status: 'success' },
        { id: 'n-9-4', name: 'Elasticsearch', type: 'database', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-9-1', from: 'Mobile App', to: 'API Gateway', type: 'request', timestamp: '2026-03-02T09:45:11.000Z', status: 'success', label: 'GET /api/search?q=laptop' },
        { id: 'e-9-2', from: 'API Gateway', to: 'Search Service', type: 'request', timestamp: '2026-03-02T09:45:11.100Z', status: 'success', label: 'Routing to search service' },
        { id: 'e-9-3', from: 'Search Service', to: 'Elasticsearch', type: 'request', timestamp: '2026-03-02T09:45:11.200Z', status: 'success', label: 'Executing search query' },
        // response arrows (backward)
        { id: 'e-9-4', from: 'Elasticsearch', to: 'Search Service', type: 'response', timestamp: '2026-03-02T09:45:11.300Z', status: 'success', duration: 1045, label: '1045ms' },
        { id: 'e-9-5', from: 'Search Service', to: 'API Gateway', type: 'response', timestamp: '2026-03-02T09:45:11.200Z', status: 'success', duration: 1145, label: '1145ms' },
        { id: 'e-9-6', from: 'API Gateway', to: 'Mobile App', type: 'response', timestamp: '2026-03-02T09:45:11.100Z', status: 'success', duration: 1245, label: '1245ms' },
      ]
    }
  },
  {
    id: '19',
    timestamp: '2026-03-02T09:30:45.678Z',
    container: 'inventory-service-01',
    service: 'Inventory Service',
    level: 'warn',
    message: 'Low stock alert',
    host: 'srv-prod-12.us-east',
    requestId: 'req-010',
    requestFlow: {
      nodes: [
        { id: 'n-10-1', name: 'Scheduled Job', type: 'service', status: 'success' },
        { id: 'n-10-2', name: 'Inventory Database', type: 'database', status: 'success' },
        { id: 'n-10-3', name: 'Notification Service', type: 'service', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-10-1', from: 'Scheduled Job', to: 'Inventory Database', type: 'request', timestamp: '2026-03-02T09:30:45.000Z', status: 'success', label: 'Running inventory check' },
        { id: 'e-10-2', from: 'Scheduled Job', to: 'Notification Service', type: 'request', timestamp: '2026-03-02T09:30:45.500Z', status: 'success', label: 'Sending alert to warehouse team' },
        // response arrows (backward)
        { id: 'e-10-3', from: 'Inventory Database', to: 'Scheduled Job', type: 'response', timestamp: '2026-03-02T09:30:45.100Z', status: 'success', duration: 578, label: '578ms' },
        { id: 'e-10-4', from: 'Notification Service', to: 'Scheduled Job', type: 'response', timestamp: '2026-03-02T09:30:45.500Z', status: 'success', duration: 178, label: '178ms' },
      ]
    }
  },
  {
    id: '20',
    timestamp: '2026-03-02T09:15:33.901Z',
    container: 'recommendation-engine-01',
    service: 'ML Recommendations',
    level: 'success',
    message: 'Personalized recommendations generated',
    host: 'srv-ml-01.us-east',
    requestId: 'req-011',
    requestFlow: {
      nodes: [
        { id: 'n-11-1', name: 'Web Browser', type: 'client', status: 'success' },
        { id: 'n-11-2', name: 'API Gateway', type: 'gateway', status: 'success' },
        { id: 'n-11-3', name: 'ML Service', type: 'service', status: 'success' },
        { id: 'n-11-4', name: 'Redis Cache', type: 'cache', status: 'success' },
        { id: 'n-11-5', name: 'User Behavior DB', type: 'database', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-11-1', from: 'Web Browser', to: 'API Gateway', type: 'request', timestamp: '2026-03-02T09:15:30.000Z', status: 'success', label: 'GET /api/recommendations/user/12345' },
        { id: 'e-11-2', from: 'API Gateway', to: 'ML Service', type: 'request', timestamp: '2026-03-02T09:15:30.100Z', status: 'success', label: 'Routing to ML service' },
        { id: 'e-11-3', from: 'ML Service', to: 'Redis Cache', type: 'request', timestamp: '2026-03-02T09:15:30.200Z', status: 'success', label: 'Running recommendation model' },
        { id: 'e-11-4', from: 'ML Service', to: 'User Behavior DB', type: 'request', timestamp: '2026-03-02T09:15:30.300Z', status: 'success', label: 'Fetching user interaction history' },
        // response arrows (backward)
        { id: 'e-11-5', from: 'Redis Cache', to: 'ML Service', type: 'response', timestamp: '2026-03-02T09:15:30.250Z', status: 'success', duration: 50, label: 'Cache miss - computing fresh recommendations' },
        { id: 'e-11-6', from: 'User Behavior DB', to: 'ML Service', type: 'response', timestamp: '2026-03-02T09:15:30.300Z', status: 'success', duration: 3601, label: '3601ms' },
        { id: 'e-11-7', from: 'ML Service', to: 'API Gateway', type: 'response', timestamp: '2026-03-02T09:15:30.200Z', status: 'success', duration: 3701, label: '3701ms' },
        { id: 'e-11-8', from: 'API Gateway', to: 'Web Browser', type: 'response', timestamp: '2026-03-02T09:15:30.100Z', status: 'success', duration: 3801, label: '3801ms' },
      ]
    }
  },
  {
    id: '21',
    timestamp: '2026-03-02T08:55:17.234Z',
    container: 'order-service-01',
    service: 'Order Service',
    level: 'error',
    message: 'Order validation failed',
    host: 'srv-prod-13.us-east',
    requestId: 'req-012',
    requestFlow: {
      nodes: [
        { id: 'n-12-1', name: 'Mobile App', type: 'client', status: 'success' },
        { id: 'n-12-2', name: 'API Gateway', type: 'gateway', status: 'success' },
        { id: 'n-12-3', name: 'Order Service', type: 'service', status: 'error' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-12-1', from: 'Mobile App', to: 'API Gateway', type: 'request', timestamp: '2026-03-02T08:55:16.000Z', status: 'success', label: 'POST /api/orders/create' },
        { id: 'e-12-2', from: 'API Gateway', to: 'Order Service', type: 'request', timestamp: '2026-03-02T08:55:16.100Z', status: 'success', label: 'Routing to order service' },
        // response arrows (backward)
        { id: 'e-12-3', from: 'Order Service', to: 'API Gateway', type: 'response', timestamp: '2026-03-02T08:55:16.200Z', status: 'error', duration: 1034, label: 'Order validation failed', isErrorSource: true },
        { id: 'e-12-4', from: 'API Gateway', to: 'Mobile App', type: 'response', timestamp: '2026-03-02T08:55:16.100Z', status: 'error', duration: 1134, label: '1134ms' },
      ]
    }
  },
  {
    id: '22',
    timestamp: '2026-03-02T08:40:52.456Z',
    container: 'shipping-service-01',
    service: 'Shipping Service',
    level: 'success',
    message: 'Shipping label generated',
    host: 'srv-prod-14.us-east',
    requestId: 'req-013',
    requestFlow: {
      nodes: [
        { id: 'n-13-1', name: 'Order Service', type: 'service', status: 'success' },
        { id: 'n-13-2', name: 'Shipping Service', type: 'service', status: 'success' },
        { id: 'n-13-3', name: 'FedEx API', type: 'external', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-13-1', from: 'Order Service', to: 'Shipping Service', type: 'request', timestamp: '2026-03-02T08:40:50.000Z', status: 'success', label: 'Requesting shipping label' },
        { id: 'e-13-2', from: 'Shipping Service', to: 'FedEx API', type: 'request', timestamp: '2026-03-02T08:40:50.100Z', status: 'success', label: 'Processing shipping request' },
        // response arrows (backward)
        { id: 'e-13-3', from: 'FedEx API', to: 'Shipping Service', type: 'response', timestamp: '2026-03-02T08:40:50.500Z', status: 'success', duration: 1956, label: '1956ms' },
        { id: 'e-13-4', from: 'Shipping Service', to: 'Order Service', type: 'response', timestamp: '2026-03-02T08:40:50.100Z', status: 'success', duration: 2356, label: '2356ms' },
      ]
    }
  },
  {
    id: '23',
    timestamp: '2026-03-02T08:25:38.789Z',
    container: 'email-service-01',
    service: 'Email Service',
    level: 'success',
    message: 'Order confirmation email sent',
    host: 'srv-prod-15.us-east',
    requestId: 'req-014',
    requestFlow: {
      nodes: [
        { id: 'n-14-1', name: 'Order Service', type: 'service', status: 'success' },
        { id: 'n-14-2', name: 'Email Service', type: 'service', status: 'success' },
        { id: 'n-14-3', name: 'SendGrid', type: 'external', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-14-1', from: 'Order Service', to: 'Email Service', type: 'request', timestamp: '2026-03-02T08:25:37.000Z', status: 'success', label: 'Triggering confirmation email' },
        { id: 'e-14-2', from: 'Email Service', to: 'SendGrid', type: 'request', timestamp: '2026-03-02T08:25:37.100Z', status: 'success', label: 'Preparing email template' },
        // response arrows (backward)
        { id: 'e-14-3', from: 'SendGrid', to: 'Email Service', type: 'response', timestamp: '2026-03-02T08:25:38.200Z', status: 'success', duration: 589, label: '589ms' },
        { id: 'e-14-4', from: 'Email Service', to: 'Order Service', type: 'response', timestamp: '2026-03-02T08:25:37.100Z', status: 'success', duration: 1689, label: '1689ms' },
      ]
    }
  },
  {
    id: '24',
    timestamp: '2026-03-02T08:10:22.345Z',
    container: 'fraud-detection-01',
    service: 'Fraud Detection',
    level: 'warn',
    message: 'Suspicious activity detected',
    host: 'srv-security-01.us-east',
    requestId: 'req-015',
    requestFlow: {
      nodes: [
        { id: 'n-15-1', name: 'Payment Service', type: 'service', status: 'success' },
        { id: 'n-15-2', name: 'Fraud Detection', type: 'service', status: 'success' },
        { id: 'n-15-3', name: 'ML Fraud Model', type: 'service', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-15-1', from: 'Payment Service', to: 'Fraud Detection', type: 'request', timestamp: '2026-03-02T08:10:20.000Z', status: 'success', label: 'Running fraud check' },
        { id: 'e-15-2', from: 'Fraud Detection', to: 'ML Fraud Model', type: 'request', timestamp: '2026-03-02T08:10:20.100Z', status: 'success', label: 'Analyzing transaction patterns' },
        // response arrows (backward)
        { id: 'e-15-3', from: 'ML Fraud Model', to: 'Fraud Detection', type: 'response', timestamp: '2026-03-02T08:10:20.500Z', status: 'success', duration: 1845, label: '1845ms' },
        { id: 'e-15-4', from: 'Fraud Detection', to: 'Payment Service', type: 'response', timestamp: '2026-03-02T08:10:20.100Z', status: 'success', duration: 2245, label: '2245ms' },
      ]
    }
  },
  {
    id: '25',
    timestamp: '2026-03-02T07:55:11.678Z',
    container: 'customer-service-01',
    service: 'Customer Service',
    level: 'info',
    message: 'Support ticket created',
    host: 'srv-prod-16.us-east',
    requestId: 'req-016',
    requestFlow: {
      nodes: [
        { id: 'n-16-1', name: 'Web Browser', type: 'client', status: 'success' },
        { id: 'n-16-2', name: 'API Gateway', type: 'gateway', status: 'success' },
        { id: 'n-16-3', name: 'Customer Service', type: 'service', status: 'success' },
        { id: 'n-16-4', name: 'Ticket Database', type: 'database', status: 'success' },
      ],
      edges: [
        // request arrows (forward)
        { id: 'e-16-1', from: 'Web Browser', to: 'API Gateway', type: 'request', timestamp: '2026-03-02T07:55:10.000Z', status: 'success', label: 'POST /api/support/tickets' },
        { id: 'e-16-2', from: 'API Gateway', to: 'Customer Service', type: 'request', timestamp: '2026-03-02T07:55:10.100Z', status: 'success', label: 'Routing to customer service' },
        { id: 'e-16-3', from: 'Customer Service', to: 'Ticket Database', type: 'request', timestamp: '2026-03-02T07:55:10.200Z', status: 'success', label: 'Creating support ticket' },
        // response arrows (backward)
        { id: 'e-16-4', from: 'Ticket Database', to: 'Customer Service', type: 'response', timestamp: '2026-03-02T07:55:10.500Z', status: 'success', duration: 1178, label: '1178ms' },
        { id: 'e-16-5', from: 'Customer Service', to: 'API Gateway', type: 'response', timestamp: '2026-03-02T07:55:10.200Z', status: 'success', duration: 1478, label: '1478ms' },
        { id: 'e-16-6', from: 'API Gateway', to: 'Web Browser', type: 'response', timestamp: '2026-03-02T07:55:10.100Z', status: 'success', duration: 1578, label: '1578ms' },
      ]
    }
  }
];

export const logFields = [
  { key: 'timestamp', label: 'Timestamp', enabled: true },
  { key: 'level', label: 'Level', enabled: true },
  { key: 'container', label: 'Container', enabled: true },
  { key: 'service', label: 'Service', enabled: true },
  { key: 'message', label: 'Message', enabled: true },
  { key: 'host', label: 'Host', enabled: false },
] as const;
