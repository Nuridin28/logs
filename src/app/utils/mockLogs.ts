import type { Log } from '../components/RequestFlow';
import { parseRawLogText } from './parseRawLogs';

export type { Log, FlowNode, FlowEdge, LogLevel } from '../components/RequestFlow';
const RAW_LOGS = `
logging-fluentd-2hwf7

[2026-03-18 05:00:55.363] [INFO] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-6] [class=com.du.bff.common.logging.LogService] [method=logIncomingRequest] [pod=du-bff] - Incoming request: [POST] /graphql | Started At: 2026-03-18T05:00:55.362Z | Operation: query searchAddress

[2026-03-18 05:00:55.410] [DEBUG] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-6] [class=com.du.bff.common.logging.LogService] [method=logIncomingRequest] [pod=du-bff] - Incoming request details | Headers: X-Device-ID-Type:"UUID", X-Device-ID:"4f7e669a-02d9-4cf6-bd90-5f37f6e31536", X-Correlation-ID:"54ea048f-23ca-48db-a47b-ba225e27c71b", Content-Type:"application/json; charset=utf-8" | Variables: {gaid=DXB_E3279L_13610_005404040}

[2026-03-18 05:00:55.567] [INFO] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-6] [class=com.du.bff.common.logging.LogService] [method=logTokenExchange] [pod=du-bff] - Successful token exchange — tokenType=Bearer, expiresIn=3600

[2026-03-18 05:00:55.869] [DEBUG] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-6] [class=com.du.bff.common.logging.LogService] [method=logGQLIncomingRequest] [pod=du-bff] - Incoming GQL request: Started At: 2026-03-18T05:00:55.868Z | Operation: query searchAddress($gaid: String!) { searchAddress(gaid: $gaid) { fixedLineActive addressUnit { id formattedAddress emirate city area street buildingName latitude longitude gid gaid } } } | Variables: {gaid=DXB_E3279L_13610_005404040}

[2026-03-18 05:00:55.870] [DEBUG] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-6] [class=com.du.bff.common.logging.LogService] [method=logOutgoingGqlRequest] [pod=du-bff] - Outgoing GQL request — POST http://du-ngil-lite:8080/ngil/v5/graphql | Operation: query searchAddressOrchestrated | Variables: {"input":{"gaid":"DXB_E3279L_13610_005404040"}}

[2026-03-18 05:00:55.871] [INFO] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-1] [class=com.du.orchestrator.logging.LogService] [method=logHttpIncomingRequest] [pod=service-du-ng11-lite] - HTTP Incoming Request — POST /graphql, operation=searchAddressOrchestrated

[2026-03-18 05:00:55.892] [INFO] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-1] [class=com.du.orchestrator.logging.LogService] [method=logHttpOutgoingRequest] [pod=service-du-ng11-lite] - HTTP Outgoing Request — GET /api/v1/tbapi/addressManagement/search?query=DXB_E3279L_13610_005404040

[2026-03-18 05:00:55.893] [ERROR] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-1] [class=com.du.orchestrator.logging.LogService] [method=logAxiosIncomingResponse] [pod=service-du-ng11-lite] - Axios Incoming Response — status=503, Request failed with status code 503, url=/api/v1/tbapi/addressManagement/search

[2026-03-18 05:00:55.895] [ERROR] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-1] [class=com.du.orchestrator.logging.LogService] [method=logError] [pod=service-du-ng11-lite] - Error occurred while searching address — INTERNAL_SERVER_ERROR, data: {searchAddress: null}

[2026-03-18 05:00:55.897] [INFO] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-1] [class=com.du.orchestrator.logging.LogService] [method=logHttpOutgoingResponse] [pod=service-du-ng11-lite] - HTTP Outgoing Response — status=200, body={data: {searchAddress: null}, errors: [INTERNAL_SERVER_ERROR]}

[2026-03-18 05:00:55.900] [ERROR] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-6] [class=com.du.bff.common.logging.LogService] [method=logIncomingGqlResponse] [pod=du-bff] - Incoming GQL response — errors: [INTERNAL_SERVER_ERROR], searchAddress=null

[2026-03-18 05:00:55.930] [ERROR] [request_id=5e355c48-868a-42c6-9cc9-25500a8e1de8] [thread=http-nio-8080-exec-6] [class=com.du.bff.common.logging.LogService] [method=logOutgoingResponse] [pod=du-bff] - Outgoing response — status=500, response={data: null, errors: ["error occurred while searching address"]}

[2026-03-18 05:01:10.100] [INFO] [request_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890] [thread=http-nio-8080-exec-3] [class=com.du.bff.common.logging.LogService] [method=logIncomingRequest] [pod=du-bff] - Incoming request: [POST] /graphql | Operation: query getAccountDetails

[2026-03-18 05:01:10.150] [INFO] [request_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890] [thread=http-nio-8080-exec-3] [class=com.du.bff.common.logging.LogService] [method=logTokenExchange] [pod=du-bff] - Successful token exchange — tokenType=Bearer, expiresIn=3600

[2026-03-18 05:01:10.200] [DEBUG] [request_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890] [thread=http-nio-8080-exec-3] [class=com.du.bff.common.logging.LogService] [method=logOutgoingGqlRequest] [pod=du-bff] - Outgoing GQL request — POST http://du-ngil-lite:8080/ngil/v5/graphql | Operation: query getAccountDetailsOrchestrated

[2026-03-18 05:01:10.350] [INFO] [request_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890] [thread=http-nio-8080-exec-2] [class=com.du.orchestrator.logging.LogService] [method=logHttpIncomingRequest] [pod=service-du-ng11-lite] - HTTP Incoming Request — POST /graphql, operation=getAccountDetailsOrchestrated

[2026-03-18 05:01:10.400] [INFO] [request_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890] [thread=http-nio-8080-exec-2] [class=com.du.orchestrator.logging.LogService] [method=logHttpOutgoingRequest] [pod=service-du-ng11-lite] - HTTP Outgoing Request — GET /api/v1/tbapi/accountManagement/details?accountId=ACC-001

[2026-03-18 05:01:10.580] [INFO] [request_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890] [thread=http-nio-8080-exec-2] [class=com.du.orchestrator.logging.LogService] [method=logAxiosIncomingResponse] [pod=service-du-ng11-lite] - Axios Incoming Response — status=200, data={accountId: "ACC-001", name: "John Doe"}

[2026-03-18 05:01:10.590] [INFO] [request_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890] [thread=http-nio-8080-exec-2] [class=com.du.orchestrator.logging.LogService] [method=logHttpOutgoingResponse] [pod=service-du-ng11-lite] - HTTP Outgoing Response — status=200, body={data: {getAccountDetails: {accountId: "ACC-001"}}}

[2026-03-18 05:01:10.620] [INFO] [request_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890] [thread=http-nio-8080-exec-3] [class=com.du.bff.common.logging.LogService] [method=logIncomingGqlResponse] [pod=du-bff] - Incoming GQL response — data: {getAccountDetails: {...}}, no errors

[2026-03-18 05:01:10.650] [INFO] [request_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890] [thread=http-nio-8080-exec-3] [class=com.du.bff.common.logging.LogService] [method=logOutgoingResponse] [pod=du-bff] - Outgoing response — status=200, completed in 550ms

[2026-03-18 05:02:01.000] [INFO] [request_id=f7e6d5c4-b3a2-1098-7654-321fedcba987] [thread=http-nio-8080-exec-5] [class=com.du.bff.common.logging.LogService] [method=logIncomingRequest] [pod=du-bff] - Incoming request: [POST] /graphql | Operation: mutation createOrder

[2026-03-18 05:02:01.050] [INFO] [request_id=f7e6d5c4-b3a2-1098-7654-321fedcba987] [thread=http-nio-8080-exec-5] [class=com.du.bff.common.logging.LogService] [method=logTokenExchange] [pod=du-bff] - Successful token exchange — tokenType=Bearer

[2026-03-18 05:02:01.100] [DEBUG] [request_id=f7e6d5c4-b3a2-1098-7654-321fedcba987] [thread=http-nio-8080-exec-5] [class=com.du.bff.common.logging.LogService] [method=logOutgoingGqlRequest] [pod=du-bff] - Outgoing GQL request — POST http://du-ngil-lite:8080/ngil/v5/graphql | Operation: mutation createOrderOrchestrated | Variables: {orderId: "ORD-5521"}

[2026-03-18 05:02:01.250] [INFO] [request_id=f7e6d5c4-b3a2-1098-7654-321fedcba987] [thread=http-nio-8080-exec-4] [class=com.du.orchestrator.logging.LogService] [method=logHttpIncomingRequest] [pod=service-du-ng11-lite] - HTTP Incoming Request — POST /graphql, operation=createOrderOrchestrated

[2026-03-18 05:02:01.300] [INFO] [request_id=f7e6d5c4-b3a2-1098-7654-321fedcba987] [thread=http-nio-8080-exec-4] [class=com.du.orchestrator.logging.LogService] [method=logHttpOutgoingRequest] [pod=service-du-ng11-lite] - HTTP Outgoing Request — POST /api/v1/tbapi/paymentManagement/charge, body={orderId: "ORD-5521", amount: 299.00}

[2026-03-18 05:02:01.550] [INFO] [request_id=f7e6d5c4-b3a2-1098-7654-321fedcba987] [thread=http-nio-8080-exec-4] [class=com.du.orchestrator.logging.LogService] [method=logAxiosIncomingResponse] [pod=service-du-ng11-lite] - Axios Incoming Response — status=200, transactionId=TXN-88431, url=/api/v1/tbapi/paymentManagement/charge

[2026-03-18 05:02:01.600] [INFO] [request_id=f7e6d5c4-b3a2-1098-7654-321fedcba987] [thread=http-nio-8080-exec-4] [class=com.du.orchestrator.logging.LogService] [method=logHttpOutgoingRequest] [pod=service-du-ng11-lite] - HTTP Outgoing Request — POST /api/v1/tbapi/inventoryManagement/reserve, body={itemId: "ITEM-7712"}

[2026-03-18 05:02:01.800] [INFO] [request_id=f7e6d5c4-b3a2-1098-7654-321fedcba987] [thread=http-nio-8080-exec-4] [class=com.du.orchestrator.logging.LogService] [method=logAxiosIncomingResponse] [pod=service-du-ng11-lite] - Axios Incoming Response — status=200, reserved=true, itemId=ITEM-7712, url=/api/v1/tbapi/inventoryManagement/reserve

[2026-03-18 05:02:01.850] [INFO] [request_id=f7e6d5c4-b3a2-1098-7654-321fedcba987] [thread=http-nio-8080-exec-4] [class=com.du.orchestrator.logging.LogService] [method=logHttpOutgoingResponse] [pod=service-du-ng11-lite] - HTTP Outgoing Response — status=200, body={data: {createOrder: {orderId: "ORD-5521", status: "confirmed"}}}

[2026-03-18 05:02:01.880] [INFO] [request_id=f7e6d5c4-b3a2-1098-7654-321fedcba987] [thread=http-nio-8080-exec-5] [class=com.du.bff.common.logging.LogService] [method=logIncomingGqlResponse] [pod=du-bff] - Incoming GQL response — data: {createOrder: {orderId: "ORD-5521", status: "confirmed"}}

[2026-03-18 05:02:01.900] [INFO] [request_id=f7e6d5c4-b3a2-1098-7654-321fedcba987] [thread=http-nio-8080-exec-5] [class=com.du.bff.common.logging.LogService] [method=logOutgoingResponse] [pod=du-bff] - Outgoing response — status=200, completed in 900ms

[2026-03-18 05:03:20.000] [INFO] [request_id=bb11cc22-dd33-ee44-ff55-667788990011] [thread=http-nio-8080-exec-7] [class=com.du.bff.common.logging.LogService] [method=logIncomingRequest] [pod=du-bff] - Incoming request: [POST] /graphql | Operation: query getBalance

[2026-03-18 05:03:20.050] [DEBUG] [request_id=bb11cc22-dd33-ee44-ff55-667788990011] [thread=http-nio-8080-exec-7] [class=com.du.bff.common.logging.LogService] [method=logOutgoingGqlRequest] [pod=du-bff] - Outgoing GQL request — POST http://du-ngil-lite:8080/ngil/v5/graphql | Operation: query getBalanceOrchestrated

[2026-03-18 05:03:20.200] [INFO] [request_id=bb11cc22-dd33-ee44-ff55-667788990011] [thread=http-nio-8080-exec-8] [class=com.du.orchestrator.logging.LogService] [method=logHttpIncomingRequest] [pod=service-du-ng11-lite] - HTTP Incoming Request — POST /graphql, operation=getBalanceOrchestrated

[2026-03-18 05:03:20.250] [INFO] [request_id=bb11cc22-dd33-ee44-ff55-667788990011] [thread=http-nio-8080-exec-8] [class=com.du.orchestrator.logging.LogService] [method=logHttpOutgoingRequest] [pod=service-du-ng11-lite] - HTTP Outgoing Request — GET /api/v1/tbapi/balanceManagement/balance?msisdn=971501234567

[2026-03-18 05:03:25.250] [ERROR] [request_id=bb11cc22-dd33-ee44-ff55-667788990011] [thread=http-nio-8080-exec-8] [class=com.du.orchestrator.logging.LogService] [method=logAxiosIncomingResponse] [pod=service-du-ng11-lite] - Axios Incoming Response — ECONNABORTED, timeout of 5000ms exceeded, url=/api/v1/tbapi/balanceManagement/balance

[2026-03-18 05:03:25.260] [ERROR] [request_id=bb11cc22-dd33-ee44-ff55-667788990011] [thread=http-nio-8080-exec-8] [class=com.du.orchestrator.logging.LogService] [method=logError] [pod=service-du-ng11-lite] - Error occurred while fetching balance — GATEWAY_TIMEOUT, data: {getBalance: null}

[2026-03-18 05:03:25.280] [ERROR] [request_id=bb11cc22-dd33-ee44-ff55-667788990011] [thread=http-nio-8080-exec-7] [class=com.du.bff.common.logging.LogService] [method=logIncomingGqlResponse] [pod=du-bff] - Incoming GQL response — errors: [GATEWAY_TIMEOUT], getBalance=null

[2026-03-18 05:03:25.300] [ERROR] [request_id=bb11cc22-dd33-ee44-ff55-667788990011] [thread=http-nio-8080-exec-7] [class=com.du.bff.common.logging.LogService] [method=logOutgoingResponse] [pod=du-bff] - Outgoing response — status=504, Gateway Timeout, completed in 5300ms
`;

export const mockLogs: Log[] = parseRawLogText(RAW_LOGS);

export const logFields = [
  { key: 'timestamp', label: 'Timestamp', enabled: true },
  { key: 'level', label: 'Level', enabled: true },
  { key: 'container', label: 'Container', enabled: true },
  { key: 'service', label: 'Service', enabled: true },
  { key: 'message', label: 'Message', enabled: true },
  { key: 'host', label: 'Host', enabled: false },
] as const;
