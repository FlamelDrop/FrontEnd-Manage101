function track(...args: any[]) {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (!(window as any).gtag) {
    return;
  }

  (window as any).gtag(...args);
}

function pageview(propx: any) {
  track('config', process.env.REACT_APP_GA_MEASUREMENT_ID, propx);
}

function event(type: any, propx: any) {
  track('event', type, propx);
}

export default {
  pageview,
  event,
};
