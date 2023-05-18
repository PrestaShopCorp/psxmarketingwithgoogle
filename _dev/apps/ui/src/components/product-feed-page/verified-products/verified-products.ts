export type StatusCard = {
  title: string;
  description: string;
  value: string | null;
  reverseColors: boolean;
  variant: string;
};

export type VerificationStats = null|{
  productsInCatalog: string;
  verifiedProducts: string;
  nonCompliantProducts: string;
};