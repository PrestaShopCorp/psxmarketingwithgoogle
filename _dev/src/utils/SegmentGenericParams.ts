import store from '@/store';

const SegmentGenericParams = {
  // @ts-ignore
  api_endpoint: store.state.app.psxMktgWithGoogleApiUrl,
  browser: navigator.userAgent,
  browser_version: navigator.userAgent,
  // category,
  // city,
  country: window.psxMtgWithGoogleDefaultShopCountry,
  current_url: window.location.href,
  // device_id,
  // distinct_id,
  // initial_referrer,
  // initial_referring_domain,
  // insert_id,
  // library_version,
  // mixpanel_library,
  os: navigator.appVersion,
  path: window.location.hash,
  plan_name: window.location.pathname,
  // referrer_url,
  // referrer,
  // referring_domain,
  // region,
  screen_height: window.screen.height,
  screen_width: window.screen.width,
  // search,
  // time,
  // time_processed,
  // title,
  url: window.location.origin,
};
export default SegmentGenericParams;
