import { Action, AlternateDisputeResolution, Breakdown, Severity } from "./types";

export interface AccountIssuesResponse {
  issues: AccountIssue[];
  alternateDisputeResolution?: AlternateDisputeResolution;
}

export interface AccountIssue {
  title: string;
  impact: AccountIssueImpact;
  prerenderedContent: string;
  actions?: Action[];
}

export interface AccountIssueImpact {
  severity: Severity;
  message?: string;
  breakdowns?: Breakdown[];
}
