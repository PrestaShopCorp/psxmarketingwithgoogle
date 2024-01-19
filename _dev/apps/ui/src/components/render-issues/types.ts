export interface Breakdown {
  regions?: Region[];
  details: string[];
}

export interface Region {
  code: string;
  name: string;
}

export interface Action {
  buttonLabel: string;
  isAvailable: boolean;
  externalAction?: ExternalAction;
  builtinSimpleAction?: BuiltInSimpleAction;
}

export interface ExternalAction {
  type: string;
  uri: string;
}

export interface BuiltInSimpleAction {
  type: BuiltInSimpleActionType;
  attributeCode?: string;
  additionalContent?: AdditionalContent;
}

export type BuiltInSimpleActionType =
  | 'VERIFY_PHONE'
  | 'CLAIM_WEBSITE'
  | 'ADD_PRODUCTS'
  | 'ADD_CONTACT_INFO'
  | 'LINK_ADS_ACCOUNT'
  | 'ADD_BUSINESS_REGISTRATION_NUMBER'
  | 'EDIT_ITEM_ATTRIBUTE'
  | 'FIX_ACCOUNT_ISSUE'
  | 'SHOW_ADDITIONAL_CONTENT';

export interface AdditionalContent {
  title: string;
  paragraphs: [string];
}

export interface AlternateDisputeResolution {
  uri: string;
  label: string;
}

export type Severity = 'ERROR' | 'WARNING' | 'INFO';
