export type Settings = {
  title: string;
  description: string;
  enabled: boolean;
  calculationMethod: CalculationMethod;
  amount: number;
  eligibleItems: EligibleItems;
  onByDefault: boolean;
};

export enum EligibleItems {
  ALL = "ALL",
  SHIPPABLE = "SHIPPABLE",
}

export enum CalculationMethod {
  FIXED = "FIXED",
  PERCENTAGE_FROM_TOTAL = "PERCENTAGE_FROM_TOTAL",
  PERCENTAGE_FROM_SHIPPING_COST = "PERCENTAGE_FROM_SHIPPING_COST",
}
