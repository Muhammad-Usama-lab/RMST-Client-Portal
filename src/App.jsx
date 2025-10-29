// third party
import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingOverlay from './components/Loader/LoadingOverlay';

// -----------------------|| APP ||-----------------------//

export default function App() {
  return (
    <LoadingProvider>
      <RouterProvider router={router} />
      <LoadingOverlay />
    </LoadingProvider>
  );
}
