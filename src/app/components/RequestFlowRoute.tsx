import { useParams, useNavigate } from 'react-router';
import { mockLogs } from '../utils/mockLogs';
import RequestFlow from './RequestFlow';

export default function RequestFlowRoute() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  return (
    <RequestFlow
      requestId={requestId!}
      logs={mockLogs}
      onViewLog={(logId) => navigate(`/${requestId}/log/${logId}`)}
    />
  );
}
