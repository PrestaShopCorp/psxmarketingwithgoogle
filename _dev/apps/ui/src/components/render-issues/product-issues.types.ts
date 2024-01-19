import { Action, AlternateDisputeResolution, Breakdown, Severity } from "./types";

export interface ProductIssuesResponse {
  issues: ProductIssue[];
  alternateDisputeResolution?: AlternateDisputeResolution;
}

export interface ProductIssue {
  title: string;
  impact: ProductIssueImpact;
  prerenderedContent: string;
  actions?: Action[];
}

export interface ProductIssueImpact {
  severity: Severity;
  message?: string;
  breakdowns?: Breakdown[];
}
