export type StatusCard = {
  title: string;
  description: string;
  value: string | null;
  reverseColors: boolean;
  variant: string;
  link?: {
    to?: {
      name: string;
    };
    href?: string;
  };
};

export type VerificationStats = null|{
  productsInCatalog: string;
  verifiedProducts: string;
  nonCompliantProducts: string;
};
