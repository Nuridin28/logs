import { createBrowserRouter } from 'react-router';
import Root from './components/Root';
import LogsOverview from './components/LogsOverview';
import LogDetail from './components/LogDetail';
import RequestFlow from './components/RequestFlow';
import RequestIdEntry from './components/RequestIdEntry';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RequestIdEntry,
  },
  {
    path: '/:requestId',
    Component: Root,
    children: [
      {
        index: true,
        Component: LogsOverview,
      },
      {
        path: 'log/:id',
        Component: LogDetail,
      },
      {
        path: 'request-flow',
        Component: RequestFlow,
      },
    ],
  },
]);