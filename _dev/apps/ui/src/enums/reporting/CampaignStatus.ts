enum CampaignStatus {
  NOTELIGIBLE = 'NOT-ELIGIBLE',
  ELIGIBLE = 'ELIGIBLE',
  PAUSED = 'PAUSED',
  REMOVED = 'REMOVED',
  PENDING = 'PENDING',
  ENDED = 'ENDED',
  DRAFT = 'DRAFT',
}

export enum CampaignStatusToggle {
  ENABLED = 'ENABLED',
  PAUSED = 'PAUSED',
}

export enum CampaignTypes {
  SMART_SHOPPING = 'SMART_SHOPPING',
  PERFORMANCE_MAX = 'PERFORMANCE_MAX',
}

export default CampaignStatus;
