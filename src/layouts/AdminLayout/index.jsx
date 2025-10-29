import { Suspense, useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// project imports
import Loader from 'components/Loader/Loader';
import { ConfigContext } from 'contexts/ConfigContext';
import useWindowSize from 'hooks/useWindowSize';
import * as actionType from 'store/actions';
import Breadcrumb from './Breadcrumb';
import MobileHeader from './MobileHeader';
import NavBar from './NavBar';
import Navigation from './Navigation';

// -----------------------|| ADMIN LAYOUT ||-----------------------//

export default function AdminLayout() {
  const windowSize = useWindowSize();
  const configContext = useContext(ConfigContext);
  const bodyElement = document.body;
  const { collapseLayout } = configContext.state;
  const { dispatch } = configContext;
  useEffect(() => {
    if (windowSize.width > 992 && windowSize.width <= 1024) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  }, [dispatch, windowSize]);

  if (windowSize.width > 992 && collapseLayout) {
    bodyElement.classList.add('minimenu');
  } else {
    bodyElement.classList.remove('minimenu');
  }

  let containerClass = ['pc-container'];

  let adminlayout = (
    <>
      <MobileHeader />
      <NavBar />
      <Navigation />
      <div className={containerClass.join(' ')}>
        <div className="pcoded-content">
          <>
            <Breadcrumb />
            <Suspense fallback={<Loader />}>
              <Outlet />
            </Suspense>
          </>
        </div>
      </div>
    </>
  );
  return <>{adminlayout}</>;
}
