import type { Log } from '../components/RequestFlow';

export type { Log, FlowNode, FlowEdge, LogLevel } from '../components/RequestFlow';

/**
 * Mock logs — чистые логи с разных микросервисов.
 * Граф строится автоматически из порядка timestamps через buildGraphFromLogs().
 */
export const mockLogs: Log[] = [
  // ═══ req-001: Payment flow (linear A→B→C→D, error at D) ═══════════════════
  { id: '1',  timestamp: '2026-03-02T10:15:22.000Z', container: 'mobile-app',        service: 'Mobile App',         level: 'info',    message: 'User initiated payment POST /api/payments',       host: 'client-device',          requestId: 'req-001' },
  { id: '2',  timestamp: '2026-03-02T10:15:22.050Z', container: 'api-gateway-01',     service: 'API Gateway',        level: 'info',    message: 'Received POST /api/payments, forwarding',         host: 'srv-prod-01.us-east',    requestId: 'req-001' },
  { id: '3',  timestamp: '2026-03-02T10:15:22.200Z', container: 'payment-service-01', service: 'Payment Service',    level: 'info',    message: 'Processing payment for order #12345',             host: 'srv-prod-06.us-east',    requestId: 'req-001' },
  { id: '4',  timestamp: '2026-03-02T10:15:22.400Z', container: 'payment-proc-01',    service: 'Payment Processor',  level: 'error',   message: 'Connection timeout — external API unreachable',   host: 'srv-external-01.us-east', requestId: 'req-001' },
  { id: '5',  timestamp: '2026-03-02T10:15:22.600Z', container: 'payment-service-01', service: 'Payment Service',    level: 'error',   message: 'Payment retry failed after 3 attempts',           host: 'srv-prod-06.us-east',    requestId: 'req-001' },
  { id: '6',  timestamp: '2026-03-02T10:15:22.700Z', container: 'api-gateway-01',     service: 'API Gateway',        level: 'error',   message: '502 Bad Gateway returned to client',              host: 'srv-prod-01.us-east',    requestId: 'req-001' },
  { id: '7',  timestamp: '2026-03-02T10:15:22.800Z', container: 'mobile-app',         service: 'Mobile App',         level: 'error',   message: 'Payment failed — showing error to user',          host: 'client-device',          requestId: 'req-001' },

  // ═══ req-002: Auth flow (B calls DB, then B calls Redis — re-request) ═════
  { id: '8',  timestamp: '2026-03-02T10:14:18.000Z', container: 'web-browser',        service: 'Web Browser',        level: 'info',    message: 'POST /api/auth/login',                            host: 'client-browser',         requestId: 'req-002' },
  { id: '9',  timestamp: '2026-03-02T10:14:18.050Z', container: 'load-balancer-01',   service: 'Load Balancer',      level: 'info',    message: 'Forwarding to auth service',                      host: 'lb-prod-01.us-east',     requestId: 'req-002' },
  { id: '10', timestamp: '2026-03-02T10:14:18.100Z', container: 'auth-service-02',    service: 'Auth Service',       level: 'info',    message: 'Processing authentication request',                host: 'srv-prod-02.us-east',    requestId: 'req-002' },
  { id: '11', timestamp: '2026-03-02T10:14:18.200Z', container: 'user-db-01',         service: 'User Database',      level: 'info',    message: 'Looking up user credentials',                     host: 'db-prod-01.us-east',     requestId: 'req-002' },
  { id: '12', timestamp: '2026-03-02T10:14:18.550Z', container: 'auth-service-02',    service: 'Auth Service',       level: 'info',    message: 'Credentials verified, creating session',          host: 'srv-prod-02.us-east',    requestId: 'req-002' },
  { id: '13', timestamp: '2026-03-02T10:14:18.600Z', container: 'redis-cache-01',     service: 'Redis Cache',        level: 'info',    message: 'Storing session token TTL=3600s',                 host: 'cache-prod-01.us-east',  requestId: 'req-002' },
  { id: '14', timestamp: '2026-03-02T10:14:18.650Z', container: 'auth-service-02',    service: 'Auth Service',       level: 'success', message: 'Session created successfully',                     host: 'srv-prod-02.us-east',    requestId: 'req-002' },
  { id: '15', timestamp: '2026-03-02T10:14:18.700Z', container: 'load-balancer-01',   service: 'Load Balancer',      level: 'success', message: 'Auth complete, returning 200',                     host: 'lb-prod-01.us-east',     requestId: 'req-002' },
  { id: '16', timestamp: '2026-03-02T10:14:18.750Z', container: 'web-browser',        service: 'Web Browser',        level: 'success', message: 'Login successful — redirecting to dashboard',      host: 'client-browser',         requestId: 'req-002' },

  // ═══ req-003: Slow query (simple linear) ══════════════════════════════════
  { id: '17', timestamp: '2026-03-02T10:13:40.000Z', container: 'admin-dashboard',    service: 'Admin Dashboard',    level: 'info',    message: 'GET /api/users/report',                           host: 'client-admin',           requestId: 'req-003' },
  { id: '18', timestamp: '2026-03-02T10:13:40.050Z', container: 'api-gateway-02',     service: 'API Gateway',        level: 'info',    message: 'Routing to analytics service',                     host: 'srv-prod-01.us-east',    requestId: 'req-003' },
  { id: '19', timestamp: '2026-03-02T10:13:40.100Z', container: 'analytics-svc-01',   service: 'Analytics Service',  level: 'info',    message: 'Generating user report',                           host: 'srv-prod-03.us-east',    requestId: 'req-003' },
  { id: '20', timestamp: '2026-03-02T10:13:40.150Z', container: 'postgres-01',        service: 'PostgreSQL',         level: 'warn',    message: 'Slow query detected: 4973ms',                      host: 'db-prod-01.us-east',     requestId: 'req-003' },
  { id: '21', timestamp: '2026-03-02T10:13:45.123Z', container: 'analytics-svc-01',   service: 'Analytics Service',  level: 'info',    message: 'Report generated, returning 42 rows',              host: 'srv-prod-03.us-east',    requestId: 'req-003' },
  { id: '22', timestamp: '2026-03-02T10:13:45.173Z', container: 'api-gateway-02',     service: 'API Gateway',        level: 'info',    message: 'Response sent, 5073ms total',                      host: 'srv-prod-01.us-east',    requestId: 'req-003' },
  { id: '23', timestamp: '2026-03-02T10:13:45.200Z', container: 'admin-dashboard',    service: 'Admin Dashboard',    level: 'success', message: 'Report loaded',                                    host: 'client-admin',           requestId: 'req-003' },

  // ═══ req-004: Fan-out (health check → DB + Redis in parallel) ═════════════
  { id: '24', timestamp: '2026-03-02T10:10:05.000Z', container: 'monitoring-sys',     service: 'Monitoring System',  level: 'info',    message: 'GET /health',                                      host: 'monitoring-01.us-east',  requestId: 'req-004' },
  { id: '25', timestamp: '2026-03-02T10:10:05.050Z', container: 'api-gateway-01',     service: 'API Gateway',        level: 'info',    message: 'Running health checks',                            host: 'srv-prod-01.us-east',    requestId: 'req-004' },
  { id: '26', timestamp: '2026-03-02T10:10:05.100Z', container: 'database-01',        service: 'Database',           level: 'info',    message: 'Health ping OK, 12ms',                             host: 'db-prod-01.us-east',     requestId: 'req-004' },
  { id: '27', timestamp: '2026-03-02T10:10:05.130Z', container: 'api-gateway-01',     service: 'API Gateway',        level: 'info',    message: 'DB check passed',                                  host: 'srv-prod-01.us-east',    requestId: 'req-004' },
  { id: '28', timestamp: '2026-03-02T10:10:05.150Z', container: 'redis-cache-01',     service: 'Redis Cache',        level: 'info',    message: 'Health ping OK, 8ms',                              host: 'cache-prod-01.us-east',  requestId: 'req-004' },
  { id: '29', timestamp: '2026-03-02T10:10:05.180Z', container: 'api-gateway-01',     service: 'API Gateway',        level: 'success', message: 'All checks passed',                                host: 'srv-prod-01.us-east',    requestId: 'req-004' },
  { id: '30', timestamp: '2026-03-02T10:10:05.200Z', container: 'monitoring-sys',     service: 'Monitoring System',  level: 'success', message: 'Health check OK, 200ms total',                     host: 'monitoring-01.us-east',  requestId: 'req-004' },

  // ═══ req-005: Simple cache clear ══════════════════════════════════════════
  { id: '31', timestamp: '2026-03-02T10:11:15.000Z', container: 'cli-tool',           service: 'CLI Tool',           level: 'info',    message: 'Command: cache-clear --pattern user:session:*',    host: 'admin-laptop',           requestId: 'req-005' },
  { id: '32', timestamp: '2026-03-02T10:11:15.100Z', container: 'cache-service-01',   service: 'Cache Service',      level: 'info',    message: 'Executing FLUSHDB for pattern user:session:*',     host: 'srv-prod-04.us-east',    requestId: 'req-005' },
  { id: '33', timestamp: '2026-03-02T10:11:15.200Z', container: 'redis-01',           service: 'Redis',              level: 'info',    message: 'Deleted 1,247 keys',                               host: 'cache-prod-02.us-east',  requestId: 'req-005' },
  { id: '34', timestamp: '2026-03-02T10:11:15.700Z', container: 'cache-service-01',   service: 'Cache Service',      level: 'success', message: 'Cache cleared, 1247 keys removed',                 host: 'srv-prod-04.us-east',    requestId: 'req-005' },
  { id: '35', timestamp: '2026-03-02T10:11:15.800Z', container: 'cli-tool',           service: 'CLI Tool',           level: 'success', message: 'Done in 800ms',                                    host: 'admin-laptop',           requestId: 'req-005' },

  // ═══ req-006: Notification error ══════════════════════════════════════════
  { id: '36', timestamp: '2026-03-02T10:09:45.000Z', container: 'mobile-app',         service: 'Mobile App',         level: 'info',    message: 'Triggered by order shipment event',                host: 'client-device',          requestId: 'req-006' },
  { id: '37', timestamp: '2026-03-02T10:09:45.100Z', container: 'notif-svc-01',       service: 'Notification Service', level: 'info',  message: 'Preparing push notification',                      host: 'srv-prod-04.us-east',    requestId: 'req-006' },
  { id: '38', timestamp: '2026-03-02T10:09:45.250Z', container: 'fcm-adapter',        service: 'FCM (Firebase)',     level: 'error',   message: 'Device token invalid — NotRegistered',             host: 'srv-external-02.us-east', requestId: 'req-006' },
  { id: '39', timestamp: '2026-03-02T10:09:45.400Z', container: 'notif-svc-01',       service: 'Notification Service', level: 'error', message: 'Push notification failed',                         host: 'srv-prod-04.us-east',    requestId: 'req-006' },
  { id: '40', timestamp: '2026-03-02T10:09:45.500Z', container: 'mobile-app',         service: 'Mobile App',         level: 'warn',    message: 'Notification not delivered',                        host: 'client-device',          requestId: 'req-006' },

  // ═══ req-007: File upload (linear, success) ═══════════════════════════════
  { id: '41', timestamp: '2026-03-02T10:08:18.000Z', container: 'web-browser',        service: 'Web Browser',        level: 'info',    message: 'POST /api/files/upload (2.4MB)',                   host: 'client-browser',         requestId: 'req-007' },
  { id: '42', timestamp: '2026-03-02T10:08:18.100Z', container: 'api-gateway-01',     service: 'API Gateway',        level: 'info',    message: 'Routing to storage service',                       host: 'srv-prod-01.us-east',    requestId: 'req-007' },
  { id: '43', timestamp: '2026-03-02T10:08:18.200Z', container: 'storage-svc-01',     service: 'Storage Service',    level: 'info',    message: 'Validating and processing file',                   host: 'srv-prod-05.us-east',    requestId: 'req-007' },
  { id: '44', timestamp: '2026-03-02T10:08:18.300Z', container: 's3-adapter',         service: 'AWS S3',             level: 'info',    message: 'Uploading to bucket prod-files',                   host: 'srv-external-03.us-east', requestId: 'req-007' },
  { id: '45', timestamp: '2026-03-02T10:08:19.400Z', container: 'storage-svc-01',     service: 'Storage Service',    level: 'success', message: 'File stored, URL generated',                       host: 'srv-prod-05.us-east',    requestId: 'req-007' },
  { id: '46', timestamp: '2026-03-02T10:08:19.500Z', container: 'api-gateway-01',     service: 'API Gateway',        level: 'success', message: 'Returning file URL',                                host: 'srv-prod-01.us-east',    requestId: 'req-007' },
  { id: '47', timestamp: '2026-03-02T10:08:19.600Z', container: 'web-browser',        service: 'Web Browser',        level: 'success', message: 'File uploaded successfully',                        host: 'client-browser',         requestId: 'req-007' },

  // ═══ req-008: ML Recommendations (fan-out: ML → Cache + DB) ═══════════════
  { id: '48', timestamp: '2026-03-02T09:15:30.000Z', container: 'web-browser',        service: 'Web Browser',        level: 'info',    message: 'GET /api/recommendations/user/12345',              host: 'client-browser',         requestId: 'req-008' },
  { id: '49', timestamp: '2026-03-02T09:15:30.100Z', container: 'api-gateway-02',     service: 'API Gateway',        level: 'info',    message: 'Routing to ML service',                            host: 'srv-prod-01.us-east',    requestId: 'req-008' },
  { id: '50', timestamp: '2026-03-02T09:15:30.200Z', container: 'ml-svc-01',          service: 'ML Service',         level: 'info',    message: 'Running recommendation model',                     host: 'srv-ml-01.us-east',      requestId: 'req-008' },
  { id: '51', timestamp: '2026-03-02T09:15:30.250Z', container: 'redis-cache-02',     service: 'Redis Cache',        level: 'info',    message: 'Cache miss for user 12345',                        host: 'cache-prod-01.us-east',  requestId: 'req-008' },
  { id: '52', timestamp: '2026-03-02T09:15:30.300Z', container: 'ml-svc-01',          service: 'ML Service',         level: 'info',    message: 'Fetching user interaction history',                 host: 'srv-ml-01.us-east',      requestId: 'req-008' },
  { id: '53', timestamp: '2026-03-02T09:15:30.400Z', container: 'user-behavior-db',   service: 'User Behavior DB',   level: 'info',    message: 'Returning 2,847 interaction records',              host: 'db-ml-01.us-east',       requestId: 'req-008' },
  { id: '54', timestamp: '2026-03-02T09:15:33.800Z', container: 'ml-svc-01',          service: 'ML Service',         level: 'success', message: 'Generated 20 recommendations',                     host: 'srv-ml-01.us-east',      requestId: 'req-008' },
  { id: '55', timestamp: '2026-03-02T09:15:33.850Z', container: 'api-gateway-02',     service: 'API Gateway',        level: 'success', message: 'Returning recommendations, 3.8s',                   host: 'srv-prod-01.us-east',    requestId: 'req-008' },
  { id: '56', timestamp: '2026-03-02T09:15:33.900Z', container: 'web-browser',        service: 'Web Browser',        level: 'success', message: 'Recommendations loaded',                            host: 'client-browser',         requestId: 'req-008' },

  // ═══ req-009: Order validation error (short) ══════════════════════════════
  { id: '57', timestamp: '2026-03-02T08:55:16.000Z', container: 'mobile-app',         service: 'Mobile App',         level: 'info',    message: 'POST /api/orders/create',                          host: 'client-device',          requestId: 'req-009' },
  { id: '58', timestamp: '2026-03-02T08:55:16.100Z', container: 'api-gateway-01',     service: 'API Gateway',        level: 'info',    message: 'Routing to order service',                          host: 'srv-prod-01.us-east',    requestId: 'req-009' },
  { id: '59', timestamp: '2026-03-02T08:55:16.200Z', container: 'order-svc-01',       service: 'Order Service',      level: 'error',   message: 'Order validation failed: invalid shipping address', host: 'srv-prod-13.us-east',    requestId: 'req-009' },
  { id: '60', timestamp: '2026-03-02T08:55:17.100Z', container: 'api-gateway-01',     service: 'API Gateway',        level: 'error',   message: '400 Bad Request — validation error',                host: 'srv-prod-01.us-east',    requestId: 'req-009' },
  { id: '61', timestamp: '2026-03-02T08:55:17.200Z', container: 'mobile-app',         service: 'Mobile App',         level: 'warn',    message: 'Showing validation error to user',                  host: 'client-device',          requestId: 'req-009' },
];

export const logFields = [
  { key: 'timestamp', label: 'Timestamp', enabled: true },
  { key: 'level', label: 'Level', enabled: true },
  { key: 'container', label: 'Container', enabled: true },
  { key: 'service', label: 'Service', enabled: true },
  { key: 'message', label: 'Message', enabled: true },
  { key: 'host', label: 'Host', enabled: false },
] as const;
