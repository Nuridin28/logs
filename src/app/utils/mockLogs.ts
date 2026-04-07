import type { FlowEdge, Log, LogLevel } from '../components/RequestFlow';

export type { FlowEdge, FlowNode, Log, LogLevel } from '../components/RequestFlow';

export const mockEdges: Record<string, FlowEdge[]> = {
  '5e355c48-868a-42c6-9cc9-25500a8e1de8': [
    { id: 'e-1', from: 'BFF', to: 'GraphQL Orchestrator', type: 'request', status: 'success', label: 'Outgoing GQL request — POST /graphql', description: 'query searchAddressOrchestrated, variables={gaid: DXB_E3279L_13610_005404040}' },
    { id: 'e-2', from: 'GraphQL Orchestrator', to: 'Address Management API', type: 'request', status: 'success', label: 'HTTP Outgoing Request — GET /addressManagement/search', description: 'query=DXB_E3279L_13610_005404040' },
    { id: 'e-3', from: 'Address Management API', to: 'GraphQL Orchestrator', type: 'response', status: 'error', duration: 2, label: 'status=503, Request failed', description: 'Axios Incoming Response — status=503, Request failed with status code 503, url=/api/v1/tbapi/addressManagement/search', isErrorSource: true },
    { id: 'e-4', from: 'GraphQL Orchestrator', to: 'BFF', type: 'response', status: 'error', duration: 29, label: 'INTERNAL_SERVER_ERROR', description: 'Error occurred while searching address — data: {searchAddress: null}, errors: [INTERNAL_SERVER_ERROR]' },
  ],

  'a1b2c3d4-e5f6-7890-abcd-ef1234567890': [
    { id: 'e-1', from: 'BFF', to: 'GraphQL Orchestrator', type: 'request', status: 'success', label: 'Outgoing GQL request — POST /graphql', description: 'query getAccountDetailsOrchestrated' },
    { id: 'e-2', from: 'GraphQL Orchestrator', to: 'Account Management API', type: 'request', status: 'success', label: 'HTTP Outgoing Request — GET /accountManagement/details', description: 'accountId=ACC-001' },
    { id: 'e-3', from: 'Account Management API', to: 'GraphQL Orchestrator', type: 'response', status: 'success', duration: 180, label: 'status=200', description: 'data={accountId: "ACC-001", name: "John Doe"}' },
    { id: 'e-4', from: 'GraphQL Orchestrator', to: 'BFF', type: 'response', status: 'success', duration: 420, label: 'status=200', description: '{getAccountDetails: {accountId: "ACC-001"}}' },
  ],

  'f7e6d5c4-b3a2-1098-7654-321fedcba987': [
    { id: 'e-1', from: 'BFF', to: 'GraphQL Orchestrator', type: 'request', status: 'success', label: 'Outgoing GQL request — POST /graphql', description: 'mutation createOrderOrchestrated, variables={orderId: "ORD-5521"}' },
    { id: 'e-2', from: 'GraphQL Orchestrator', to: 'Payment Management API', type: 'request', status: 'success', label: 'HTTP Outgoing Request — POST /paymentManagement/charge', description: 'orderId=ORD-5521' },
    { id: 'e-3', from: 'Payment Management API', to: 'GraphQL Orchestrator', type: 'response', status: 'success', duration: 250, label: 'status=200', description: 'transactionId=TXN-88431' },
    { id: 'e-4', from: 'GraphQL Orchestrator', to: 'Inventory Management API', type: 'request', status: 'success', label: 'HTTP Outgoing Request — POST /inventoryManagement/reserve', description: 'itemId=ITEM-7712' },
    { id: 'e-5', from: 'Inventory Management API', to: 'GraphQL Orchestrator', type: 'response', status: 'success', duration: 200, label: 'status=200', description: 'reserved=true, itemId=ITEM-7712' },
    { id: 'e-6', from: 'GraphQL Orchestrator', to: 'BFF', type: 'response', status: 'success', duration: 750, label: 'status=200', description: '{createOrder: {orderId: "ORD-5521", status: "confirmed"}}' },
  ],

  'bb11cc22-dd33-ee44-ff55-667788990011': [
    { id: 'e-1', from: 'BFF', to: 'GraphQL Orchestrator', type: 'request', status: 'success', label: 'Outgoing GQL request — POST /graphql', description: 'query getBalanceOrchestrated, msisdn=971501234567' },
    { id: 'e-2', from: 'GraphQL Orchestrator', to: 'Balance Management API', type: 'request', status: 'success', label: 'HTTP Outgoing Request — GET /balanceManagement/balance', description: 'msisdn=971501234567' },
    { id: 'e-3', from: 'Balance Management API', to: 'GraphQL Orchestrator', type: 'response', status: 'error', duration: 5000, label: 'ECONNABORTED — timeout 5000ms', description: 'Axios Incoming Response — timeout of 5000ms exceeded', isErrorSource: true },
    { id: 'e-4', from: 'GraphQL Orchestrator', to: 'BFF', type: 'response', status: 'error', duration: 5060, label: 'GATEWAY_TIMEOUT', description: 'Error occurred while fetching balance — data: {getBalance: null}' },
  ],
};

export const mockRequestIds = Object.keys(mockEdges);

export const mockLogs: Log[] = [
  { id: '1', timestamp: '2026-03-18T05:00:55.363Z', container: 'du-bff', service: 'BFF', level: 'info', message: 'Incoming request: [POST] /graphql — operation: query searchAddress', host: 'pod-du-bff-7f8d6b5c4-x2k9m', requestId: '5e355c48-868a-42c6-9cc9-25500a8e1de8' },
  { id: '2', timestamp: '2026-03-18T05:00:55.567Z', container: 'du-bff', service: 'BFF', level: 'info', message: 'Successful token exchange — tokenType=Bearer', host: 'pod-du-bff-7f8d6b5c4-x2k9m', requestId: '5e355c48-868a-42c6-9cc9-25500a8e1de8' },
  { id: '3', timestamp: '2026-03-18T05:00:55.870Z', container: 'du-bff', service: 'BFF', level: 'debug', message: 'Outgoing GQL request — POST http://du-ngil-lite:8080/ngil/v5/graphql', host: 'pod-du-bff-7f8d6b5c4-x2k9m', requestId: '5e355c48-868a-42c6-9cc9-25500a8e1de8' },
  { id: '4', timestamp: '2026-03-18T05:00:55.871Z', container: 'service-du-ng11-lite', service: 'GraphQL Orchestrator', level: 'info', message: 'HTTP Incoming Request — POST /graphql, operation=searchAddressOrchestrated', host: 'svc-du-ng11-lite-5d9c8b7a3-j4n2', requestId: '5e355c48-868a-42c6-9cc9-25500a8e1de8' },
  { id: '5', timestamp: '2026-03-18T05:00:55.892Z', container: 'service-du-ng11-lite', service: 'GraphQL Orchestrator', level: 'info', message: 'HTTP Outgoing Request — GET /api/v1/tbapi/addressManagement/search', host: 'svc-du-ng11-lite-5d9c8b7a3-j4n2', requestId: '5e355c48-868a-42c6-9cc9-25500a8e1de8' },
  { id: '6', timestamp: '2026-03-18T05:00:55.893Z', container: 'service-du-ng11-lite', service: 'Address Management API', level: 'error', message: 'Axios Incoming Response — status=503, Request failed with status code 503', host: 'svc-du-ng11-lite-5d9c8b7a3-j4n2', requestId: '5e355c48-868a-42c6-9cc9-25500a8e1de8' },
  { id: '7', timestamp: '2026-03-18T05:00:55.895Z', container: 'service-du-ng11-lite', service: 'GraphQL Orchestrator', level: 'error', message: 'Error occurred while searching address — INTERNAL_SERVER_ERROR', host: 'svc-du-ng11-lite-5d9c8b7a3-j4n2', requestId: '5e355c48-868a-42c6-9cc9-25500a8e1de8' },
  { id: '8', timestamp: '2026-03-18T05:00:55.900Z', container: 'du-bff', service: 'BFF', level: 'error', message: 'Incoming GQL response — errors: [INTERNAL_SERVER_ERROR]', host: 'pod-du-bff-7f8d6b5c4-x2k9m', requestId: '5e355c48-868a-42c6-9cc9-25500a8e1de8' },
  { id: '9', timestamp: '2026-03-18T05:00:55.930Z', container: 'du-bff', service: 'BFF', level: 'error', message: 'Outgoing response — status=500', host: 'pod-du-bff-7f8d6b5c4-x2k9m', requestId: '5e355c48-868a-42c6-9cc9-25500a8e1de8' },
];

export const logFields = [
  { key: 'timestamp', label: 'Timestamp', enabled: true },
  { key: 'level', label: 'Level', enabled: true },
  { key: 'container', label: 'Container', enabled: true },
  { key: 'service', label: 'Service', enabled: true },
  { key: 'message', label: 'Message', enabled: true },
  { key: 'host', label: 'Host', enabled: false },
] as const;
