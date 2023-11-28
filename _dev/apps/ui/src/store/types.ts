import {State as AppState} from './modules/app/state';
import {State as AccountsState} from './modules/accounts/state';
import {State as ProductFeedState} from './modules/product-feed/state';
import {State as GoogleAdsState} from './modules/google-ads/state';
import {State as CampaignsState} from './modules/campaigns/state';

export interface FullState {
  app: AppState,
  accounts: AccountsState,
  productFeed: ProductFeedState,
  googleAds: GoogleAdsState,
  campaigns: CampaignsState,
}

export enum RequestState {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}
