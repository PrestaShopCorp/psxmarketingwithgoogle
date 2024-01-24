export interface AccountIssue {
  title: string;
  severity: Severity;
  htmlContent: string;
  impact?: string;
}

export interface ProductIssue {
  title: string;
  severity: Severity;
  htmlContent: string;
  countries?: string[];
  impact?: string;
}

export type Severity = 'ERROR' | 'WARNING' | 'INFO';
