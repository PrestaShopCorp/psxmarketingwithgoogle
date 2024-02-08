export interface AccountIssue {
  title: string;
  severity: Severity;
  htmlContent: string;
  impact?: string;
}

export interface ProductIssue {
  title: string;
  message: string;
  severity: Severity;
  htmlContent: string;
  countries?: string[];
  impacts?: ProductIssueImpact[];
}

export interface ProductIssueImpact {
  currency: string;
  language: string;
  attribute: string;
}

export type Severity = 'ERROR' | 'WARNING' | 'INFO';
