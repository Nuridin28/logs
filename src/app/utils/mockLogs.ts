export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

export interface LogStep {
  id: string;
  timestamp: string;
  message: string;
  level: LogLevel;
  details?: string;
}

export interface Log {
  id: string;
  timestamp: string;
  container: string;
  service: string;
  level: LogLevel;
  message: string;
  host: string;
  requestId?: string;
  steps: LogStep[];
  requestFlow?: RequestFlowNode[];
}

export interface RequestFlowNode {
  id: string;
  name: string;
  type: 'client' | 'gateway' | 'service' | 'database' | 'external' | 'cache';
  timestamp: string;
  status: 'success' | 'error' | 'pending';
  duration?: number;
  details?: string;
}

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
    requestFlow: [
      {
        id: 'rf-1-1',
        name: 'Mobile App',
        type: 'client',
        timestamp: '2026-03-02T10:15:23.000Z',
        status: 'success',
        duration: 50,
        details: 'POST /api/payments - User initiated payment'
      },
      {
        id: 'rf-1-2',
        name: 'API Gateway',
        type: 'gateway',
        timestamp: '2026-03-02T10:15:23.050Z',
        status: 'success',
        duration: 100,
        details: 'Request authenticated and routed'
      },
      {
        id: 'rf-1-3',
        name: 'Payment Service',
        type: 'service',
        timestamp: '2026-03-02T10:15:23.150Z',
        status: 'success',
        duration: 200,
        details: 'Validating payment details'
      },
      {
        id: 'rf-1-4',
        name: 'Payment Processor',
        type: 'external',
        timestamp: '2026-03-02T10:15:23.350Z',
        status: 'error',
        duration: 3000,
        details: 'Connection timeout - External API unreachable'
      }
    ],
    steps: [
      {
        id: '1-1',
        timestamp: '2026-03-02T10:15:23.100Z',
        message: 'Received payment request from user_12345',
        level: 'info',
        details: 'Request payload: { amount: 149.99, currency: "USD", method: "card" }'
      },
      {
        id: '1-2',
        timestamp: '2026-03-02T10:15:23.250Z',
        message: 'Validating payment details',
        level: 'info',
        details: 'Card validation passed'
      },
      {
        id: '1-3',
        timestamp: '2026-03-02T10:15:23.380Z',
        message: 'Connecting to payment processor',
        level: 'info',
        details: 'Attempting connection to processor.payments.com'
      },
      {
        id: '1-4',
        timestamp: '2026-03-02T10:15:23.456Z',
        message: 'Payment processor connection timeout',
        level: 'error',
        details: 'Error: Connection timeout after 3000ms. Processor may be down.'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-2-1',
        name: 'Web Browser',
        type: 'client',
        timestamp: '2026-03-02T10:14:18.000Z',
        status: 'success',
        duration: 100,
        details: 'POST /api/auth/login'
      },
      {
        id: 'rf-2-2',
        name: 'Load Balancer',
        type: 'gateway',
        timestamp: '2026-03-02T10:14:18.100Z',
        status: 'success',
        duration: 50,
        details: 'Forwarding to auth service'
      },
      {
        id: 'rf-2-3',
        name: 'Auth Service',
        type: 'service',
        timestamp: '2026-03-02T10:14:18.150Z',
        status: 'success',
        duration: 530,
        details: 'Processing authentication'
      },
      {
        id: 'rf-2-4',
        name: 'User Database',
        type: 'database',
        timestamp: '2026-03-02T10:14:18.200Z',
        status: 'success',
        duration: 350,
        details: 'Query: SELECT * FROM users WHERE email = ?'
      },
      {
        id: 'rf-2-5',
        name: 'Redis Cache',
        type: 'cache',
        timestamp: '2026-03-02T10:14:18.680Z',
        status: 'success',
        duration: 9,
        details: 'Storing session token'
      }
    ],
    steps: [
      {
        id: '2-1',
        timestamp: '2026-03-02T10:14:18.100Z',
        message: 'Login attempt for user: john.doe@example.com',
        level: 'info',
        details: 'IP Address: 192.168.1.105'
      },
      {
        id: '2-2',
        timestamp: '2026-03-02T10:14:18.350Z',
        message: 'Password verification in progress',
        level: 'debug',
        details: 'Using bcrypt hash comparison'
      },
      {
        id: '2-3',
        timestamp: '2026-03-02T10:14:18.680Z',
        message: 'Password verified successfully',
        level: 'success',
        details: 'Hash match confirmed'
      },
      {
        id: '2-4',
        timestamp: '2026-03-02T10:14:18.789Z',
        message: 'JWT token generated and sent',
        level: 'success',
        details: 'Token expires in 24 hours'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-3-1',
        name: 'Admin Dashboard',
        type: 'client',
        timestamp: '2026-03-02T10:13:40.000Z',
        status: 'success',
        duration: 5123,
        details: 'GET /api/users/report'
      },
      {
        id: 'rf-3-2',
        name: 'API Gateway',
        type: 'gateway',
        timestamp: '2026-03-02T10:13:40.050Z',
        status: 'success',
        duration: 5073,
        details: 'Routing to analytics service'
      },
      {
        id: 'rf-3-3',
        name: 'Analytics Service',
        type: 'service',
        timestamp: '2026-03-02T10:13:40.100Z',
        status: 'success',
        duration: 5023,
        details: 'Generating user report'
      },
      {
        id: 'rf-3-4',
        name: 'PostgreSQL',
        type: 'database',
        timestamp: '2026-03-02T10:13:40.150Z',
        status: 'success',
        duration: 4973,
        details: 'Full table scan on users table'
      }
    ],
    steps: [
      {
        id: '3-1',
        timestamp: '2026-03-02T10:13:40.000Z',
        message: 'Query execution started',
        level: 'info',
        details: 'SELECT * FROM users WHERE created_at > "2026-01-01"'
      },
      {
        id: '3-2',
        timestamp: '2026-03-02T10:13:42.500Z',
        message: 'Full table scan in progress',
        level: 'debug',
        details: 'Scanning 2.5M rows'
      },
      {
        id: '3-3',
        timestamp: '2026-03-02T10:13:45.123Z',
        message: 'Query completed but took longer than 3 seconds',
        level: 'warn',
        details: 'Execution time: 5123ms. Consider adding index on created_at column.'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-4-1',
        name: 'Job Queue',
        type: 'cache',
        timestamp: '2026-03-02T10:12:30.000Z',
        status: 'success',
        duration: 100,
        details: 'Dequeued job: send_email_campaign_1234'
      },
      {
        id: 'rf-4-2',
        name: 'Worker Service',
        type: 'service',
        timestamp: '2026-03-02T10:12:30.100Z',
        status: 'success',
        duration: 280,
        details: 'Processing email job'
      },
      {
        id: 'rf-4-3',
        name: 'Template Service',
        type: 'service',
        timestamp: '2026-03-02T10:12:30.200Z',
        status: 'error',
        duration: 180,
        details: 'Template rendering failed'
      }
    ],
    steps: [
      {
        id: '4-1',
        timestamp: '2026-03-02T10:12:30.100Z',
        message: 'Dequeued job: send_email_campaign_1234',
        level: 'info',
        details: 'Job priority: high, attempts: 1'
      },
      {
        id: '4-2',
        timestamp: '2026-03-02T10:12:30.250Z',
        message: 'Loading email template',
        level: 'info',
        details: 'Template ID: marketing_promo_v2'
      },
      {
        id: '4-3',
        timestamp: '2026-03-02T10:12:30.380Z',
        message: 'Template rendering failed',
        level: 'error',
        details: 'Error: Variable "user.firstName" is undefined in template context'
      },
      {
        id: '4-4',
        timestamp: '2026-03-02T10:12:30.456Z',
        message: 'Job marked as failed and returned to queue',
        level: 'error',
        details: 'Will retry in 5 minutes (attempt 2 of 3)'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-5-1',
        name: 'CLI Tool',
        type: 'client',
        timestamp: '2026-03-02T10:11:15.000Z',
        status: 'success',
        duration: 789,
        details: 'Command: cache-clear --pattern user:session:*'
      },
      {
        id: 'rf-5-2',
        name: 'Cache Service',
        type: 'service',
        timestamp: '2026-03-02T10:11:15.100Z',
        status: 'success',
        duration: 689,
        details: 'Executing cache clear operation'
      },
      {
        id: 'rf-5-3',
        name: 'Redis',
        type: 'cache',
        timestamp: '2026-03-02T10:11:15.200Z',
        status: 'success',
        duration: 589,
        details: 'Deleted 1,245 keys'
      }
    ],
    steps: [
      {
        id: '5-1',
        timestamp: '2026-03-02T10:11:15.100Z',
        message: 'Cache clear command received',
        level: 'info',
        details: 'Pattern: user:session:*'
      },
      {
        id: '5-2',
        timestamp: '2026-03-02T10:11:15.450Z',
        message: 'Scanning for matching keys',
        level: 'debug',
        details: 'Found 1,245 matching keys'
      },
      {
        id: '5-3',
        timestamp: '2026-03-02T10:11:15.789Z',
        message: 'All matching keys deleted',
        level: 'success',
        details: 'Freed up 125MB of memory'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-6-1',
        name: 'Monitoring System',
        type: 'external',
        timestamp: '2026-03-02T10:10:05.000Z',
        status: 'success',
        duration: 234,
        details: 'GET /health'
      },
      {
        id: 'rf-6-2',
        name: 'API Gateway',
        type: 'gateway',
        timestamp: '2026-03-02T10:10:05.050Z',
        status: 'success',
        duration: 184,
        details: 'Running health checks'
      },
      {
        id: 'rf-6-3',
        name: 'Database',
        type: 'database',
        timestamp: '2026-03-02T10:10:05.100Z',
        status: 'success',
        duration: 50,
        details: 'Ping: 12ms'
      },
      {
        id: 'rf-6-4',
        name: 'Redis Cache',
        type: 'cache',
        timestamp: '2026-03-02T10:10:05.150Z',
        status: 'success',
        duration: 30,
        details: 'Ping: 8ms'
      }
    ],
    steps: [
      {
        id: '6-1',
        timestamp: '2026-03-02T10:10:05.100Z',
        message: 'Starting health check routine',
        level: 'info',
        details: 'Checking 5 downstream services'
      },
      {
        id: '6-2',
        timestamp: '2026-03-02T10:10:05.150Z',
        message: 'Database connection: OK',
        level: 'success',
        details: 'Latency: 12ms'
      },
      {
        id: '6-3',
        timestamp: '2026-03-02T10:10:05.180Z',
        message: 'Cache service: OK',
        level: 'success',
        details: 'Latency: 8ms'
      },
      {
        id: '6-4',
        timestamp: '2026-03-02T10:10:05.234Z',
        message: 'All services healthy',
        level: 'success',
        details: 'Total check time: 134ms'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-7-1',
        name: 'Mobile App',
        type: 'client',
        timestamp: '2026-03-02T10:09:45.000Z',
        status: 'success',
        duration: 567,
        details: 'Triggered by order shipment'
      },
      {
        id: 'rf-7-2',
        name: 'Notification Service',
        type: 'service',
        timestamp: '2026-03-02T10:09:45.100Z',
        status: 'success',
        duration: 467,
        details: 'Preparing push notification'
      },
      {
        id: 'rf-7-3',
        name: 'FCM (Firebase)',
        type: 'external',
        timestamp: '2026-03-02T10:09:45.250Z',
        status: 'error',
        duration: 317,
        details: 'Device token invalid'
      }
    ],
    steps: [
      {
        id: '7-1',
        timestamp: '2026-03-02T10:09:45.100Z',
        message: 'Preparing push notification',
        level: 'info',
        details: 'Target: device_token_xyz123, Message: "Your order has shipped"'
      },
      {
        id: '7-2',
        timestamp: '2026-03-02T10:09:45.250Z',
        message: 'Connecting to FCM service',
        level: 'info',
        details: 'Using Firebase Cloud Messaging'
      },
      {
        id: '7-3',
        timestamp: '2026-03-02T10:09:45.567Z',
        message: 'Device token is invalid or expired',
        level: 'error',
        details: 'Error: FCM returned 404 NotRegistered. Device token needs to be updated.'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-8-1',
        name: 'Web Browser',
        type: 'client',
        timestamp: '2026-03-02T10:08:18.000Z',
        status: 'success',
        duration: 2890,
        details: 'POST /api/files/upload'
      },
      {
        id: 'rf-8-2',
        name: 'API Gateway',
        type: 'gateway',
        timestamp: '2026-03-02T10:08:18.100Z',
        status: 'success',
        duration: 2790,
        details: 'Routing to storage service'
      },
      {
        id: 'rf-8-3',
        name: 'Storage Service',
        type: 'service',
        timestamp: '2026-03-02T10:08:18.200Z',
        status: 'success',
        duration: 2690,
        details: 'Validating and processing file'
      },
      {
        id: 'rf-8-4',
        name: 'AWS S3',
        type: 'external',
        timestamp: '2026-03-02T10:08:19.800Z',
        status: 'success',
        duration: 1090,
        details: 'Uploading 2.5MB file'
      }
    ],
    steps: [
      {
        id: '8-1',
        timestamp: '2026-03-02T10:08:18.100Z',
        message: 'Received file upload request',
        level: 'info',
        details: 'File: document.pdf, Size: 2.5MB'
      },
      {
        id: '8-2',
        timestamp: '2026-03-02T10:08:18.500Z',
        message: 'Validating file type and size',
        level: 'info',
        details: 'Type: application/pdf, Validation passed'
      },
      {
        id: '8-3',
        timestamp: '2026-03-02T10:08:19.800Z',
        message: 'Uploading to S3 bucket',
        level: 'debug',
        details: 'Bucket: prod-documents, Region: us-east-1'
      },
      {
        id: '8-4',
        timestamp: '2026-03-02T10:08:20.890Z',
        message: 'File uploaded successfully',
        level: 'success',
        details: 'URL: https://cdn.example.com/docs/abc123.pdf'
      }
    ]
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
    requestFlow: [],
    steps: [
      {
        id: '9-1',
        timestamp: '2026-03-02T10:15:24.123Z',
        message: 'Attempting payment retry',
        level: 'info',
        details: 'Retry attempt 1 of 3'
      }
    ]
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
    requestFlow: [],
    steps: [
      {
        id: '10-1',
        timestamp: '2026-03-02T10:15:25.456Z',
        message: 'Retry failed - processor still unreachable',
        level: 'error',
        details: 'All retry attempts exhausted'
      }
    ]
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
    requestFlow: [],
    steps: [
      {
        id: '11-1',
        timestamp: '2026-03-02T10:15:26.789Z',
        message: 'Returning 503 Service Unavailable',
        level: 'warn',
        details: 'Payment processor temporarily unavailable'
      }
    ]
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
    requestFlow: [],
    steps: [
      {
        id: '12-1',
        timestamp: '2026-03-02T10:15:27.234Z',
        message: 'Notifying on-call engineers',
        level: 'error',
        details: 'PagerDuty incident created: #INC-12345'
      }
    ]
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
    requestFlow: [],
    steps: [
      {
        id: '13-1',
        timestamp: '2026-03-02T10:14:19.123Z',
        message: 'New session initiated',
        level: 'success',
        details: 'Session ID: sess_abc123xyz'
      }
    ]
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
    requestFlow: [],
    steps: [
      {
        id: '14-1',
        timestamp: '2026-03-02T10:14:19.456Z',
        message: 'Recording login analytics',
        level: 'info',
        details: 'User ID: user_67890, Login method: email'
      }
    ]
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
    requestFlow: [],
    steps: [
      {
        id: '15-1',
        timestamp: '2026-03-02T10:14:19.789Z',
        message: 'Audit record created',
        level: 'info',
        details: 'Event: user.login, Status: success'
      }
    ]
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
    requestFlow: [],
    steps: [
      {
        id: '16-1',
        timestamp: '2026-03-02T10:13:46.234Z',
        message: 'Performance analysis complete',
        level: 'warn',
        details: 'Recommend creating index on created_at column'
      }
    ]
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
    requestFlow: [],
    steps: [
      {
        id: '17-1',
        timestamp: '2026-03-02T10:13:47.567Z',
        message: 'Storing query result in cache',
        level: 'info',
        details: 'Cache key: users:report:2026-01-01, TTL: 3600s'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-9-1',
        name: 'Mobile App',
        type: 'client',
        timestamp: '2026-03-02T09:45:11.000Z',
        status: 'success',
        duration: 1345,
        details: 'GET /api/search?q=laptop'
      },
      {
        id: 'rf-9-2',
        name: 'API Gateway',
        type: 'gateway',
        timestamp: '2026-03-02T09:45:11.100Z',
        status: 'success',
        duration: 1245,
        details: 'Routing to search service'
      },
      {
        id: 'rf-9-3',
        name: 'Search Service',
        type: 'service',
        timestamp: '2026-03-02T09:45:11.200Z',
        status: 'success',
        duration: 1145,
        details: 'Executing search query'
      },
      {
        id: 'rf-9-4',
        name: 'Elasticsearch',
        type: 'database',
        timestamp: '2026-03-02T09:45:11.300Z',
        status: 'success',
        duration: 1045,
        details: 'Full-text search on products index'
      }
    ],
    steps: [
      {
        id: '18-1',
        timestamp: '2026-03-02T09:45:11.200Z',
        message: 'Search query received',
        level: 'info',
        details: 'Query: laptop, Filters: price_range: 500-2000'
      },
      {
        id: '18-2',
        timestamp: '2026-03-02T09:45:12.345Z',
        message: 'Search completed successfully',
        level: 'success',
        details: 'Found 127 results in 1045ms'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-10-1',
        name: 'Scheduled Job',
        type: 'service',
        timestamp: '2026-03-02T09:30:45.000Z',
        status: 'success',
        duration: 678,
        details: 'Running inventory check'
      },
      {
        id: 'rf-10-2',
        name: 'Inventory Database',
        type: 'database',
        timestamp: '2026-03-02T09:30:45.100Z',
        status: 'success',
        duration: 578,
        details: 'Checking stock levels'
      },
      {
        id: 'rf-10-3',
        name: 'Notification Service',
        type: 'service',
        timestamp: '2026-03-02T09:30:45.500Z',
        status: 'success',
        duration: 178,
        details: 'Sending alert to warehouse team'
      }
    ],
    steps: [
      {
        id: '19-1',
        timestamp: '2026-03-02T09:30:45.100Z',
        message: 'Checking inventory levels',
        level: 'info',
        details: 'Scanning 5,432 SKUs'
      },
      {
        id: '19-2',
        timestamp: '2026-03-02T09:30:45.678Z',
        message: 'Low stock detected for 12 items',
        level: 'warn',
        details: 'Items below minimum threshold: [SKU-1234, SKU-5678, ...]'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-11-1',
        name: 'Web Browser',
        type: 'client',
        timestamp: '2026-03-02T09:15:30.000Z',
        status: 'success',
        duration: 3901,
        details: 'GET /api/recommendations/user/12345'
      },
      {
        id: 'rf-11-2',
        name: 'API Gateway',
        type: 'gateway',
        timestamp: '2026-03-02T09:15:30.100Z',
        status: 'success',
        duration: 3801,
        details: 'Routing to ML service'
      },
      {
        id: 'rf-11-3',
        name: 'ML Service',
        type: 'service',
        timestamp: '2026-03-02T09:15:30.200Z',
        status: 'success',
        duration: 3701,
        details: 'Running recommendation model'
      },
      {
        id: 'rf-11-4',
        name: 'Redis Cache',
        type: 'cache',
        timestamp: '2026-03-02T09:15:30.250Z',
        status: 'success',
        duration: 50,
        details: 'Cache miss - computing fresh recommendations'
      },
      {
        id: 'rf-11-5',
        name: 'User Behavior DB',
        type: 'database',
        timestamp: '2026-03-02T09:15:30.300Z',
        status: 'success',
        duration: 3601,
        details: 'Fetching user interaction history'
      }
    ],
    steps: [
      {
        id: '20-1',
        timestamp: '2026-03-02T09:15:30.300Z',
        message: 'Loading user behavior data',
        level: 'info',
        details: 'User ID: 12345, Historical actions: 234'
      },
      {
        id: '20-2',
        timestamp: '2026-03-02T09:15:32.500Z',
        message: 'Running ML model inference',
        level: 'debug',
        details: 'Model: collaborative_filtering_v2.3'
      },
      {
        id: '20-3',
        timestamp: '2026-03-02T09:15:33.901Z',
        message: 'Recommendations ready',
        level: 'success',
        details: 'Generated 20 personalized recommendations'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-12-1',
        name: 'Mobile App',
        type: 'client',
        timestamp: '2026-03-02T08:55:16.000Z',
        status: 'success',
        duration: 1234,
        details: 'POST /api/orders/create'
      },
      {
        id: 'rf-12-2',
        name: 'API Gateway',
        type: 'gateway',
        timestamp: '2026-03-02T08:55:16.100Z',
        status: 'success',
        duration: 1134,
        details: 'Routing to order service'
      },
      {
        id: 'rf-12-3',
        name: 'Order Service',
        type: 'service',
        timestamp: '2026-03-02T08:55:16.200Z',
        status: 'error',
        duration: 1034,
        details: 'Order validation failed'
      }
    ],
    steps: [
      {
        id: '21-1',
        timestamp: '2026-03-02T08:55:16.200Z',
        message: 'Processing order creation',
        level: 'info',
        details: 'Order items: 3, Total: $249.99'
      },
      {
        id: '21-2',
        timestamp: '2026-03-02T08:55:17.234Z',
        message: 'Insufficient stock for item',
        level: 'error',
        details: 'Product SKU-9876 has only 0 units available, requested: 2'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-13-1',
        name: 'Order Service',
        type: 'service',
        timestamp: '2026-03-02T08:40:50.000Z',
        status: 'success',
        duration: 2456,
        details: 'Requesting shipping label'
      },
      {
        id: 'rf-13-2',
        name: 'Shipping Service',
        type: 'service',
        timestamp: '2026-03-02T08:40:50.100Z',
        status: 'success',
        duration: 2356,
        details: 'Processing shipping request'
      },
      {
        id: 'rf-13-3',
        name: 'FedEx API',
        type: 'external',
        timestamp: '2026-03-02T08:40:50.500Z',
        status: 'success',
        duration: 1956,
        details: 'Generating shipping label'
      }
    ],
    steps: [
      {
        id: '22-1',
        timestamp: '2026-03-02T08:40:50.100Z',
        message: 'Calculating shipping rates',
        level: 'info',
        details: 'Weight: 2.5kg, Destination: New York, NY'
      },
      {
        id: '22-2',
        timestamp: '2026-03-02T08:40:52.456Z',
        message: 'Label generated successfully',
        level: 'success',
        details: 'Tracking number: FDX-123456789'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-14-1',
        name: 'Order Service',
        type: 'service',
        timestamp: '2026-03-02T08:25:37.000Z',
        status: 'success',
        duration: 1789,
        details: 'Triggering confirmation email'
      },
      {
        id: 'rf-14-2',
        name: 'Email Service',
        type: 'service',
        timestamp: '2026-03-02T08:25:37.100Z',
        status: 'success',
        duration: 1689,
        details: 'Preparing email template'
      },
      {
        id: 'rf-14-3',
        name: 'SendGrid',
        type: 'external',
        timestamp: '2026-03-02T08:25:38.200Z',
        status: 'success',
        duration: 589,
        details: 'Sending email via SMTP'
      }
    ],
    steps: [
      {
        id: '23-1',
        timestamp: '2026-03-02T08:25:37.100Z',
        message: 'Loading email template',
        level: 'info',
        details: 'Template: order_confirmation_v3'
      },
      {
        id: '23-2',
        timestamp: '2026-03-02T08:25:38.789Z',
        message: 'Email sent successfully',
        level: 'success',
        details: 'To: customer@example.com, Message-ID: msg_abc123'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-15-1',
        name: 'Payment Service',
        type: 'service',
        timestamp: '2026-03-02T08:10:20.000Z',
        status: 'success',
        duration: 2345,
        details: 'Running fraud check'
      },
      {
        id: 'rf-15-2',
        name: 'Fraud Detection',
        type: 'service',
        timestamp: '2026-03-02T08:10:20.100Z',
        status: 'success',
        duration: 2245,
        details: 'Analyzing transaction patterns'
      },
      {
        id: 'rf-15-3',
        name: 'ML Fraud Model',
        type: 'service',
        timestamp: '2026-03-02T08:10:20.500Z',
        status: 'success',
        duration: 1845,
        details: 'Running fraud detection model'
      }
    ],
    steps: [
      {
        id: '24-1',
        timestamp: '2026-03-02T08:10:20.500Z',
        message: 'Analyzing transaction',
        level: 'info',
        details: 'Amount: $5,000, Card: **** 4532'
      },
      {
        id: '24-2',
        timestamp: '2026-03-02T08:10:22.345Z',
        message: 'High fraud risk score detected',
        level: 'warn',
        details: 'Risk score: 0.87/1.0 - Flagged for manual review'
      }
    ]
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
    requestFlow: [
      {
        id: 'rf-16-1',
        name: 'Web Browser',
        type: 'client',
        timestamp: '2026-03-02T07:55:10.000Z',
        status: 'success',
        duration: 1678,
        details: 'POST /api/support/tickets'
      },
      {
        id: 'rf-16-2',
        name: 'API Gateway',
        type: 'gateway',
        timestamp: '2026-03-02T07:55:10.100Z',
        status: 'success',
        duration: 1578,
        details: 'Routing to customer service'
      },
      {
        id: 'rf-16-3',
        name: 'Customer Service',
        type: 'service',
        timestamp: '2026-03-02T07:55:10.200Z',
        status: 'success',
        duration: 1478,
        details: 'Creating support ticket'
      },
      {
        id: 'rf-16-4',
        name: 'Ticket Database',
        type: 'database',
        timestamp: '2026-03-02T07:55:10.500Z',
        status: 'success',
        duration: 1178,
        details: 'Storing ticket details'
      }
    ],
    steps: [
      {
        id: '25-1',
        timestamp: '2026-03-02T07:55:10.200Z',
        message: 'New support ticket submitted',
        level: 'info',
        details: 'Subject: Order delivery issue, Priority: medium'
      },
      {
        id: '25-2',
        timestamp: '2026-03-02T07:55:11.678Z',
        message: 'Ticket created successfully',
        level: 'info',
        details: 'Ticket ID: TKT-98765, Assigned to: support_team'
      }
    ]
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