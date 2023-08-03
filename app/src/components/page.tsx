import React, { forwardRef } from 'react';
import { Helmet } from 'react-helmet';
// import { useLocation } from 'react-router';
// import track from 'src/utils/analytics';

const Page = forwardRef((propx: any, ref) => {
  const { title, children, ...rest } = propx;
  // const location = useLocation();

  // const sendPageViewEvent = useCallback(() => {
  //   track.pageview({
  //     page_path: location.pathname,
  //   });
  // }, [location]);

  // useEffect(() => {
  //   sendPageViewEvent();
  // }, [sendPageViewEvent]);

  return (
    <div ref={ref} {...rest}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </div>
  );
});

export default Page;
