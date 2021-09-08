export const sscDefault = {
  campaignName: '',
  campaignDurationDate: {
    startedAt: '',
    endedAt: '',
  },
  targetCountry: '',
  productCampaign: [],
  campaignBudget: '',
  tracking: null,
  tagAlreadyExists: false
  };
  

  export const sscTrackingIsFalse = {
      ...sscDefault,
    tracking: false,
  };
  

  export const sscTagAlreadyExists = {
      ...sscDefault,
    tracking: true,
    tagAlreadyExists: true,
  };
  
  
export default sscDefault;
  