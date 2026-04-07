import { useParams } from 'react-router';
import { mockEdges } from '../utils/mockLogs';
import RequestFlow from './RequestFlow';

export default function RequestFlowRoute() {
  const { requestId } = useParams<{ requestId: string }>();
  const edges = mockEdges[requestId!] ?? [];

  return (
    <RequestFlow
      requestId={requestId!}
      edges={edges}
    />
  );
}
