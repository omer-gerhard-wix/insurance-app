import {CalculationMethod, EligibleItems, Settings} from "../types";

export const SETTINGS_COLLECTION_ID = 'insurance-app-settings';
export const CHECKOUT_COLLECTION_ID = 'insurance-app-checkout';
export const DEFAULT_SETTING: Settings = {
  title: 'Protect your order',
  description: 'Add insurance to your order',
  enabled: true,
  eligibleItems: EligibleItems.ALL,
  calculationMethod: CalculationMethod.FIXED,
  amount: 2,
  onByDefault: true,
};
