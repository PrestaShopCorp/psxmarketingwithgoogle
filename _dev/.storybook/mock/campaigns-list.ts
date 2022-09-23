import { CampaignObject, CampaignsLists } from "@/store/modules/campaigns/state";

export const campaignsEmpty: CampaignsLists = {
  sscList: [],
  pMaxList: [],
};

export const onlySsc: CampaignObject[] = [
  {
    campaignName: "L'hiver est là",
    startDate: "2021-09-23",
    endDate: "2021-12-30",
    targetCountry: "FR",
    dailyBudget: 7,
    status: "ELIGIBLE",
    currencyCode: "EUR",
    productFilters: [],
    type: "SMART_SHOPPING",
  },
  {
    campaignName: "Destockage massif des chaussettes",
    startDate: "2021-09-23",
    endDate: "2037-12-01",
    targetCountry: "FR",
    dailyBudget: 1,
    status: "ELIGIBLE",
    currencyCode: "EUR",
    productFilters: [],
    type: "SMART_SHOPPING",
  },
  {
    campaignName: "Easter eggs",
    startDate: "2020-02-23",
    endDate: "2020-12-01",
    targetCountry: "FR",
    dailyBudget: 25,
    status: "ELIGIBLE",
    currencyCode: "EUR",
    productFilters: [],
    type: "SMART_SHOPPING",
  },
  {
    campaignName: "Black friday",
    startDate: "2021-07-10",
    endDate: "2037-12-01",
    targetCountry: "FR",
    dailyBudget: 1,
    status: "ELIGIBLE",
    currencyCode: "EUR",
    productFilters: [],
    type: "SMART_SHOPPING",
  },
];

export const onlyPmax: CampaignObject[] = [
  {
    campaignName: "Tartiflette day",
    startDate: "2021-06-20",
    endDate: "2021-11-15",
    targetCountry: "FR",
    dailyBudget: 112,
    status: "ELIGIBLE",
    currencyCode: "EUR",
    productFilters: [],
    type: "PERFORMANCE_MAX",
  },
];

export const campaigns: CampaignsLists = {
  sscList: onlySsc,
  pMaxList: onlyPmax,
};

export const campaignWithOnlySsc: CampaignsLists = {
  sscList: onlySsc,
  pMaxList: [],
};

export const campaignWithOnlyPmax: CampaignsLists = {
  sscList: [],
  pMaxList: onlyPmax,
};

export const campaignsListResponse = {
  campaigns: campaigns,
  nextPageToken: "foobar",
};
